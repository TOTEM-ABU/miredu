import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Camera,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { motion } from "framer-motion";

const DEFAULT_AVATAR = null;

const KEYFRAMES = `
  @keyframes spin       { to { transform: rotate(360deg); } }
  @keyframes ringRotate { to { transform: rotate(360deg); } }
  @keyframes popIn {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.3); }
    100% { transform: scale(1);   opacity: 1; }
  }
`;

export default function AdminSetup() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [preview, setPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const local = URL.createObjectURL(file);
    setPreview(local);
    setIsUploaded(false);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/api/file", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarUrl(data.url);
      setIsUploaded(true);
      toast.success("Avatar yuklandi! ✓");
    } catch {
      toast.error("Rasmni yuklashda xatolik");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/User/registerAdmin", {
        ...form,
        avatar: avatarUrl || undefined,
      });
      toast.success("Admin yaratildi! Kodni kiriting.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const ringBg = uploading
    ? "conic-gradient(#6366f1 0% 70%, rgba(255,255,255,0.07) 70%)"
    : isUploaded
      ? "#34d399"
      : "linear-gradient(135deg, #ef4444, #f59e0b)";
  const ringGlow = uploading
    ? "0 0 28px rgba(99,102,241,0.5)"
    : isUploaded
      ? "0 0 28px rgba(52,211,153,0.5)"
      : "0 0 28px rgba(239,68,68,0.3)";

  return (
    <div
      className="auth-page"
      style={{
        overflowY: "auto",
        alignItems: "flex-start",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <style>{KEYFRAMES}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
      >
        <div
          className="auth-card"
          style={{ border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                marginBottom: "1rem",
              }}
            >
              <ShieldAlert size={32} color="#ef4444" />
            </div>
            <h1
              style={{
                fontSize: "1.85rem",
                fontWeight: 900,
                marginBottom: "0.4rem",
                color: "#fff",
              }}
            >
              Admin Setup
            </h1>
            <p
              style={{
                color: "#ef4444",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              HIMOYALANGAN XUDUD
            </p>
          </div>

          {/* Avatar Ring */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              onClick={() => fileRef.current?.click()}
              title="Rasm yuklash"
              style={{
                position: "relative",
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: ringBg,
                boxShadow: ringGlow,
                cursor: "pointer",
                animation: uploading
                  ? "ringRotate 1.2s linear infinite"
                  : "none",
                transition: "box-shadow 0.4s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: 3,
                  right: 3,
                  bottom: 3,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="admin preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: uploading ? "brightness(0.4)" : "brightness(1)",
                      transition: "filter 0.3s",
                    }}
                  />
                ) : (
                  <Camera size={28} color="#475569" />
                )}
                {uploading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.45)",
                      borderRadius: "50%",
                    }}
                  >
                    <Loader2
                      size={26}
                      color="#fff"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  </div>
                )}
              </div>
              {isUploaded && !uploading && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "#34d399",
                    border: "3px solid #030712",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    color: "#fff",
                    animation:
                      "popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
                  }}
                >
                  ✓
                </div>
              )}
            </div>

            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: "0.75rem",
                transition: "color 0.3s",
                color: uploading
                  ? "#ef4444"
                  : isUploaded
                    ? "#34d399"
                    : "#64748b",
              }}
            >
              {uploading
                ? "Yuklanmoqda..."
                : isUploaded
                  ? "Avatar yuklandi ✓"
                  : "Rasm yuklash (ixtiyoriy)"}
            </span>

            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <div className="field-group">
              <label className="field-label">Ism</label>
              <div className="field-wrap">
                <User className="field-icon" size={17} />
                <input
                  name="name"
                  type="text"
                  required
                  className="field-input"
                  placeholder="Admin Ismi"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <div className="field-wrap">
                <Mail className="field-icon" size={17} />
                <input
                  name="email"
                  type="email"
                  required
                  className="field-input"
                  placeholder="admin@miredu.uz"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field-group" style={{ marginBottom: "2rem" }}>
              <label className="field-label">Parol</label>
              <div className="field-wrap">
                <Lock className="field-icon" size={17} />
                <input
                  name="password"
                  type="password"
                  required
                  className="field-input"
                  placeholder="••••••••"
                  onChange={onChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-primary"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
                boxShadow: "0 8px 24px -6px rgba(239,68,68,0.45)",
              }}
            >
              {loading ? (
                <Loader2
                  size={20}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <>
                  <ShieldAlert size={18} /> Admin yaratish
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.75rem",
              fontSize: "0.85rem",
              color: "#475569",
              fontWeight: 600,
            }}
          >
            Tizimga{" "}
            <Link
              to="/login"
              className="link-primary"
              style={{ marginLeft: "0.25rem" }}
            >
              Kirish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
