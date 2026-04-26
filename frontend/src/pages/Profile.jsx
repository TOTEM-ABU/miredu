import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  // Tab 1: Info State
  const [infoForm, setInfoForm] = useState({
    firstName: user.firstName || user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    avatar: user.avatar || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);

  // Tab 2: Security State
  const [secForm, setSecForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [secLoading, setSecLoading] = useState(false);

  // Phone Formatter
  const formatPhone = (val) => {
    const cleaned = (val || "").replace(/\D/g, "");
    let res = "+998 ";
    if (cleaned.startsWith("998")) {
      const rest = cleaned.substring(3);
      if (rest.length > 0) res += rest.substring(0, 2);
      if (rest.length > 2) res += " " + rest.substring(2, 5);
      if (rest.length > 5) res += " " + rest.substring(5, 7);
      if (rest.length > 7) res += " " + rest.substring(7, 9);
      return res.trim();
    }
    return val;
  };

  const handlePhone = (e) => {
    setInfoForm({ ...infoForm, phoneNumber: formatPhone(e.target.value) });
  };

  const handleInfoChange = (e) => {
    setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
  };

  const handleSecChange = (e) => {
    setSecForm({ ...secForm, [e.target.name]: e.target.value });
  };

  const [preview, setPreview] = useState(null);

  // Avatar Upload
  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Rasm hajmi 2MB dan oshmasligi kerak!");
    }

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/api/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInfoForm((prev) => ({ ...prev, avatar: data.url }));
      toast.success("Avatar yuklandi!");
    } catch {
      toast.error("Rasm yuklashda xatolik yuz berdi");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Info
  const onInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoLoading(true);

    try {
      const payload = { ...infoForm };

      // Clean up empty fields to prevent backend validation errors (e.g. empty strings)
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === null) {
          delete payload[key];
        }
      });

      // Different roles have different name fields
      if (user.role === "TEACHER" || user.role === "ADMIN") {
        if (payload.firstName) {
          payload.name = payload.firstName;
          delete payload.firstName;
        }
        delete payload.lastName;
        // Admins do not have phone numbers in DB schema
        if (user.role === "ADMIN") {
          delete payload.phoneNumber;
        } else if (payload.phoneNumber) {
          payload.phoneNumber = payload.phoneNumber.replace(/\s/g, "");
        }
      } else if (user.role === "STUDENT" && payload.phoneNumber) {
        payload.phoneNumber = payload.phoneNumber.replace(/\s/g, "");
      }

      const { data } = await api.patch("/api/User/update-me", payload);

      // Update local storage exactly like login
      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Ma'lumotlar muvaffaqiyatli saqlandi! ✅");

      // Force page reload so DashboardLayout fetches new user from localStorage
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Saqlashda xatolik!",
      );
    } finally {
      setInfoLoading(false);
    }
  };

  // Submit Password
  const onSecSubmit = async (e) => {
    e.preventDefault();
    if (secForm.newPassword !== secForm.confirmPassword) {
      return toast.error("Yangi parollar mos kelmadi!");
    }
    if (secForm.newPassword.length < 6) {
      return toast.error(
        "Yangi parol kamida 6ta belgidan iborat bo'lishi kerak!",
      );
    }

    setSecLoading(true);
    try {
      await api.patch("/api/User/update-password", {
        oldPassword: secForm.oldPassword,
        newPassword: secForm.newPassword,
      });
      toast.success("Parol muvaffaqiyatli o'zgartirildi! ✅");
      setSecForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Parolni o'zgartirishda xatolik!",
      );
    } finally {
      setSecLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 900,
            marginBottom: "0.4rem",
          }}
        >
          Mening Profilim 👤
        </h1>
        <p style={{ color: "#475569", fontWeight: 600 }}>
          Tizimdagi shaxsiy ma'lumotlaringiz va xavfsizlik sozlamalari
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* PERSONAL INFO CARD */}
        <motion.div
          className="content-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                background: "rgba(99,102,241,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={16} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
              Shaxsiy Ma'lumotlar
            </h2>
          </div>

          <form onSubmit={onInfoSubmit}>
            {/* Avatar Row */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                marginBottom: "2rem",
                paddingBottom: "2rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="avatar-upload-circle"
                style={{
                  width: "100px",
                  height: "100px",
                  margin: 0,
                  border: "2px solid rgba(255,255,255,0.08)",
                  flexShrink: 0,
                }}
              >
                {preview || infoForm.avatar ? (
                  <img
                    src={preview || infoForm.avatar}
                    alt="Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--accent-gradient)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: 900,
                        color: "white",
                      }}
                    >
                      {(infoForm.firstName ||
                        user.name ||
                        "U")[0].toUpperCase()}
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatar}
                  id="prof-avatar"
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="prof-avatar"
                  className="upload-overlay"
                  style={{ cursor: "pointer" }}
                >
                  {isUploading ? (
                    <Loader2 className="spin" size={24} />
                  ) : (
                    <Camera size={26} />
                  )}
                </label>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    marginBottom: "0.2rem",
                  }}
                >
                  Profil Rasmi
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  Sizning vizual ko'rinishingiz (max 2MB)
                </p>
              </div>
            </div>

            {/* Fields Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <div className="field-group">
                <label className="field-label">Ism</label>
                <div className="field-wrap">
                  <User className="field-icon" size={16} />
                  <input
                    name="firstName"
                    value={infoForm.firstName}
                    onChange={handleInfoChange}
                    required
                    className="field-input"
                    placeholder="Ism"
                  />
                </div>
              </div>

              {user.role === "STUDENT" && (
                <div className="field-group">
                  <label className="field-label">Familiya</label>
                  <div className="field-wrap">
                    <User className="field-icon" size={16} />
                    <input
                      name="lastName"
                      value={infoForm.lastName}
                      onChange={handleInfoChange}
                      required
                      className="field-input"
                      placeholder="Familiya"
                    />
                  </div>
                </div>
              )}

              <div className="field-group">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <Mail className="field-icon" size={16} />
                  <input
                    name="email"
                    value={infoForm.email}
                    onChange={handleInfoChange}
                    required
                    type="email"
                    className="field-input"
                    placeholder="misol@mail.com"
                  />
                </div>
              </div>

              {["TEACHER", "STUDENT"].includes(user.role) && (
                <div className="field-group">
                  <label className="field-label">Telefon Raqam</label>
                  <div className="field-wrap">
                    <Phone className="field-icon" size={16} />
                    <input
                      name="phoneNumber"
                      value={infoForm.phoneNumber}
                      onChange={handlePhone}
                      required
                      className="field-input"
                      placeholder="+998"
                      maxLength={17}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                disabled={infoLoading || isUploading}
                type="submit"
                className="btn-primary"
                style={{ minWidth: "140px" }}
              >
                {infoLoading ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <>
                    <Save size={16} /> Saqlash
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* SECURITY CARD */}
        <motion.div
          className="content-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                background: "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={16} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Xavfsizlik</h2>
          </div>

          <form onSubmit={onSecSubmit}>
            <div className="field-group" style={{ marginBottom: "1.25rem" }}>
              <label className="field-label">Joriy Parol (Eski)</label>
              <div className="field-wrap">
                <Lock className="field-icon" size={16} />
                <input
                  name="oldPassword"
                  value={secForm.oldPassword}
                  onChange={handleSecChange}
                  required
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="field-group" style={{ marginBottom: "1.25rem" }}>
              <label className="field-label">Yangi Parol</label>
              <div className="field-wrap">
                <RefreshCw className="field-icon" size={16} />
                <input
                  name="newPassword"
                  value={secForm.newPassword}
                  onChange={handleSecChange}
                  required
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                />
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginTop: "0.4rem",
                  fontWeight: 500,
                }}
              >
                Kamida 6ta belgi bo'lishi shart
              </div>
            </div>

            <div className="field-group" style={{ marginBottom: "2rem" }}>
              <label className="field-label">Yangi Parolni Takrorlang</label>
              <div className="field-wrap">
                <RefreshCw className="field-icon" size={16} />
                <input
                  name="confirmPassword"
                  value={secForm.confirmPassword}
                  onChange={handleSecChange}
                  required
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={secLoading}
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                background: "var(--red-gradient)",
                boxShadow: "0 8px 24px rgba(239, 68, 68, 0.2)",
              }}
            >
              {secLoading ? (
                <Loader2 size={18} className="spin" />
              ) : (
                <>
                  <Lock size={16} /> Parolni Yangilash
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
