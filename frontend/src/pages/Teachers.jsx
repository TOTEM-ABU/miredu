import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Loader2,
  UserPlus,
  Mail,
  Lock,
  Phone,
  Camera,
  X,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_AVATAR = null;

// Phone formatter
function formatUzPhone(raw) {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("998") ? digits.slice(3) : digits;
  const d = local.slice(0, 9);
  let out = "+998";
  if (d.length > 0) out += " " + d.slice(0, 2);
  if (d.length > 2) out += " " + d.slice(2, 5);
  if (d.length > 5) out += " " + d.slice(5, 7);
  if (d.length > 7) out += " " + d.slice(7, 9);
  return out;
}

const SPIN = `@keyframes spin { to { transform: rotate(360deg); } }
  @keyframes ringRotate { to { transform: rotate(360deg); } }
  @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.3); } 100% { transform: scale(1); opacity: 1; } }`;

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/api/User/GetAllTeachersWithFilters");
      setTeachers(data.data || []);
    } catch (err) {
      toast.error("O'qituvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <style>{SPIN}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              marginBottom: "0.2rem",
            }}
          >
            O'qituvchilar 👨‍🏫
          </h1>
          <p style={{ color: "#64748b", fontWeight: 600 }}>
            Barcha o'qituvchilarni boshqarish
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="search-wrap" style={{ width: "240px" }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Qidiruv..."
              className="search-input"
              style={{ width: "100%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "0.75rem 1.25rem", gap: "0.5rem" }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Qo'shish
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="content-card"
        style={{
          flex: 1,
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Loader2
              size={32}
              color="var(--primary)"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              flexDirection: "column",
              color: "#64748b",
            }}
          >
            <UserPlus
              size={48}
              style={{ marginBottom: "1rem", opacity: 0.5 }}
            />
            <p style={{ fontWeight: 700 }}>Hech qanday o'qituvchi topilmadi</p>
          </div>
        ) : (
          <div style={{ overflowY: "auto", padding: "1.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  style={{
                    padding: "1.25rem",
                    borderRadius: "1rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid rgba(99,102,241,0.3)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={
                        teacher.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=6366f1&color=fff`
                      }
                      alt={teacher.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) =>
                        (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name || "T")}&background=6366f1&color=fff`)
                      }
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        color: "#f1f5f9",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {teacher.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    >
                      {teacher.email}
                    </div>
                  </div>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setLoading(true);
          fetchTeachers();
        }}
      />
    </motion.div>
  );
}

// ── Modal Component ────────────────────────────────────────────────────────
function AddTeacherModal({ isOpen, onClose, onSuccess }) {
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
    phoneNumber: "+998",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onPhoneChange = (e) => {
    setForm((f) => ({ ...f, phoneNumber: formatUzPhone(e.target.value) }));
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
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
      await api.post("/api/User/registerTeacher", {
        ...form,
        phoneNumber: form.phoneNumber.replace(/\s/g, ""),
        avatar: avatarUrl || undefined,
      });
      toast.success("O'qituvchi muvaffaqiyatli qo'shildi!");
      onSuccess();
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
      : "linear-gradient(135deg, #6366f1, #22d3ee)";
  const ringGlow = uploading
    ? "0 0 28px rgba(99,102,241,0.5)"
    : isUploaded
      ? "0 0 28px rgba(52,211,153,0.5)"
      : "0 0 16px rgba(99,102,241,0.25)";

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(3,7,18,0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 40,
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 50,
              width: "100%",
              maxWidth: "500px",
              padding: "1rem",
              maxHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="auth-card"
              style={{
                padding: "2.5rem",
                overflowY: "auto",
                maxHeight: "calc(100vh - 2rem)",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#f1f5f9",
                  }}
                >
                  O'qituvchi Qo'shish
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Tizimga yangi o'qituvchi kiritish
                </p>
              </div>

              {/* Avatar Ring */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    position: "relative",
                    width: 90,
                    height: 90,
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
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: uploading
                            ? "brightness(0.4)"
                            : "brightness(1)",
                        }}
                      />
                    ) : (
                      <Camera size={24} color="#475569" />
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
                          size={24}
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
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#34d399",
                        border: "3px solid #030712",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        color: "#fff",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
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
                  <label className="field-label">Ism familiya</label>
                  <div className="field-wrap">
                    <UserPlus className="field-icon" size={17} />
                    <input
                      name="name"
                      type="text"
                      required
                      className="field-input"
                      placeholder="Alijon Valiyev"
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
                      placeholder="teacher@miredu.uz"
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Tel Raqam</label>
                  <div className="field-wrap">
                    <span
                      style={{
                        position: "absolute",
                        left: "1rem",
                        fontSize: "1.1rem",
                        zIndex: 2,
                      }}
                    >
                      🇺🇿
                    </span>
                    <input
                      name="phoneNumber"
                      type="tel"
                      required
                      className="field-input"
                      style={{ paddingLeft: "3rem" }}
                      value={form.phoneNumber}
                      onChange={onPhoneChange}
                      maxLength={17}
                    />
                  </div>
                </div>

                <div className="field-group" style={{ marginBottom: "1.5rem" }}>
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
                >
                  {loading ? (
                    <Loader2
                      size={18}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    "Qo'shish"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
