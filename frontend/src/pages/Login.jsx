import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/User/login", form);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, role: data.role }),
      );
      toast.success(`Xush kelibsiz, ${data.user.firstName || data.user.name}!`);
      navigate(data.role === "STUDENT" ? "/student-dashboard" : "/dashboard");
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("verify")) {
        toast.error("Iltimos, avval email'ni tasdiqlang!");
        navigate("/verify-otp", { state: { email: form.email } });
      } else {
        toast.error("Login yoki parol xato");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="auth-card">
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px",
                borderRadius: "1.25rem",
                background: "var(--accent-gradient)",
                boxShadow: "0 8px 24px var(--primary-glow)",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: 900, fontSize: "1.75rem" }}
              >
                M
              </span>
            </div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                marginBottom: "0.4rem",
              }}
            >
              <span className="title-gradient">MirEdu</span> Portal
            </h1>
            <p
              style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}
            >
              Tizimga kirish uchun ma'lumotlarni kiriting
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="field-group">
              <label className="field-label">Email manzil</label>
              <div className="field-wrap">
                <Mail className="field-icon" size={17} />
                <input
                  name="email"
                  type="email"
                  required
                  className="field-input"
                  placeholder="misol@mail.com"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="field-group" style={{ marginBottom: "1.75rem" }}>
              <label className="field-label">Parol</label>
              <div className="field-wrap">
                <Lock className="field-icon" size={17} />
                <input
                  name="password"
                  type="password"
                  required
                  className="field-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onChange={onChange}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <Loader2
                  size={20}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <>
                  <LogIn size={18} /> Tizimga Kirish
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "2rem",
              fontSize: "0.875rem",
              color: "#475569",
              fontWeight: 600,
            }}
          >
            Hisobingiz yo'qmi?{" "}
            <Link
              to="/register"
              className="link-primary"
              style={{ marginLeft: "0.25rem" }}
            >
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
