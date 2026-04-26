import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CalendarCheck,
  Wallet,
  TrendingUp,
  Star,
  Award,
  Loader2,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    attendanceCount: 0,
    paymentCount: 0,
    groups: [],
    firstName: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const [a, p, me, g] = await Promise.all([
          api.get(`/api/attendance/student/${user.id}`).catch(() => ({ data: { total: 0 } })),
          api.get(`/api/payment/student/${user.id}`).catch(() => ({ data: { total: 0 } })),
          api.get("/api/User/get-me").catch(() => ({ data: null })),
          api.get("/api/group/my-groups").catch(() => ({ data: { data: [] } })),
        ]);
        const paymentsList = p.data?.data || [];
        const unpaidPayment = paymentsList.find(pay => pay.status !== 'PAID');
        
        const groupsList = g.data?.data || g.data || [];
        const nextClass = groupsList.length > 0 ? groupsList[0] : null;

        const dynamicReminders = [];
        if (unpaidPayment) {
           dynamicReminders.push({
             title: "To'lov holati",
             text: "Sizda to'lanmagan to'lov mavjud. O'z vaqtida to'lashni unutmang.",
             color: "#ef4444",
           });
        } else {
           dynamicReminders.push({
             title: "Muvaffaqiyatli to'lov",
             text: "Sizda hozircha qarzdorlik yo'q. Rahmat!",
             color: "#34d399",
           });
        }

        if (nextClass) {
           dynamicReminders.push({
             title: "Faol Guruhingiz",
             text: `${nextClass.name} guruhi. Dars kunlari: ${nextClass.days || 'Belgilanmagan'}`,
             color: "#6366f1",
           });
        }

        dynamicReminders.push({
           title: "Davomat",
           text: `Jami ${a.data?.total ?? 0} ta darsda ishtirok etgansiz. Shunday davom eting!`,
           color: "#f59e0b",
        });

        setInfo({
          attendanceCount: a.data?.total ?? 0,
          paymentCount: p.data?.total ?? 0,
          groups: groupsList,
          firstName: me.data?.firstName ?? user.firstName ?? "Foydalanuvchi",
          reminders: dynamicReminders
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      label: "Guruhlar",
      value: info.groups.length,
      icon: BookOpen,
      color: "#6366f1",
      bg: "rgba(99,102,241,0.12)",
    },
    {
      label: "Davomatlar",
      value: info.attendanceCount,
      icon: CalendarCheck,
      color: "#22d3ee",
      bg: "rgba(34,211,238,0.12)",
    },
    {
      label: "To'lovlar",
      value: info.paymentCount,
      icon: Wallet,
      color: "#34d399",
      bg: "rgba(52,211,153,0.12)",
    },
    {
      label: "Natija",
      value: "100%",
      icon: TrendingUp,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
  ];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: "1rem",
        }}
      >
        <Loader2
          size={32}
          color="var(--primary)"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#334155",
          }}
        >
          Yuklanmoqda...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: "0.4rem",
            }}
          >
            Xush kelibsiz,{" "}
            <span
              style={{
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {info.firstName}
            </span>
            !
          </h1>
          <p style={{ color: "#475569", fontWeight: 600 }}>
            Bugungi darslarni o'zlashtirishga tayyormisiz? 🚀
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#475569",
                  marginBottom: "0.2rem",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "#f1f5f9",
                }}
              >
                {s.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
          marginTop: "0.5rem",
        }}
      >
        {/* Groups */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem" }}>Guruhlarim</h3>
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: 800,
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Hammasi →
            </button>
          </div>
          {info.groups.length > 0 ? (
            info.groups.map((g) => (
              <div
                key={g.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  borderRadius: "0.85rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "0.7rem",
                    background: "rgba(99,102,241,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={18} color="var(--primary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, marginBottom: "0.2rem" }}>
                    {g.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#475569",
                      fontWeight: 700,
                    }}
                  >
                    {g.courseType || "Frontend"}
                  </div>
                </div>
                <ChevronRight size={16} color="#334155" />
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 0",
                color: "#334155",
                fontWeight: 700,
              }}
            >
              Hech qanday guruh topilmadi
            </div>
          )}
        </div>

        {/* Reminders */}
        <div className="content-card">
          <h3
            style={{
              fontWeight: 800,
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
            }}
          >
            Eslatmalar
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {(info.reminders || []).map((r) => (
              <div
                key={r.title}
                style={{
                  padding: "1rem",
                  borderRadius: "0.85rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `3px solid ${r.color}`,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#475569",
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {r.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
