import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  CreditCard,
  ArrowUpRight,
  Clock,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const SPIN = `@keyframes spin { to { transform: rotate(360deg); } }`;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGroups: 0,
    monthlyRevenue: 0,
  });
  const [charts, setCharts] = useState({ attendance: [], payments: [] });
  const [recent, setRecent] = useState({ students: [], payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, c, r] = await Promise.all([
          api.get("/api/dashboard/stats"),
          api.get("/api/dashboard/charts"),
          api.get("/api/dashboard/recent"),
        ]);
        setStats(s.data ?? {});
        setCharts(c.data ?? { attendance: [], payments: [] });
        setRecent(r.data ?? { students: [], payments: [] });
      } catch {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
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
        <style>{SPIN}</style>
      </div>
    );

  const statCards = [
    {
      label: "Jami Talabalar",
      value: stats.totalStudents ?? 0,
      icon: Users,
      color: "#6366f1",
      bg: "rgba(99,102,241,0.12)",
    },
    {
      label: "Guruhlar soni",
      value: stats.totalGroups ?? 0,
      icon: BookOpen,
      color: "#34d399",
      bg: "rgba(52,211,153,0.12)",
    },
    {
      label: "Oylik Tushum",
      value: `${(stats.monthlyRevenue ?? 0).toLocaleString()} so'm`,
      icon: CreditCard,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <style>{SPIN}</style>

      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 900,
            marginBottom: "0.4rem",
          }}
        >
          Bosh sahifa 👋
        </h1>
        <p style={{ color: "#475569", fontWeight: 600 }}>
          MirEdu o'quv markazining bugungi holati
        </p>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {statCards.map((s, i) => (
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

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Attendance chart */}
        <div className="content-card">
          <h3
            style={{
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ArrowUpRight size={18} color="var(--primary)" /> Haftalik Davomat
            (%)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={charts.attendance ?? []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#334155"
                axisLine={false}
                tickLine={false}
                dy={8}
                tick={{ fontSize: 12, fontWeight: 700 }}
              />
              <YAxis
                stroke="#334155"
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tick={{ fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "0.85rem",
                  fontSize: "0.875rem",
                }}
                itemStyle={{ color: "var(--primary)" }}
              />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ fill: "var(--primary)", r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent payments */}
        <div
          className="content-card"
          style={{ overflowY: "auto", maxHeight: "340px" }}
        >
          <h3
            style={{
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              position: "sticky",
              top: 0,
              background: "rgba(15,23,42,0.8)",
              paddingBottom: "0.5rem",
              backdropFilter: "blur(8px)",
            }}
          >
            <Clock size={16} color="#f59e0b" /> Oxirgi To'lovlar
          </h3>
          {(recent.payments ?? []).length === 0 ? (
            <p
              style={{
                color: "#334155",
                fontSize: "0.875rem",
                fontWeight: 700,
                padding: "1rem 0",
              }}
            >
              To'lovlar topilmadi
            </p>
          ) : (
            recent.payments.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "50%",
                    background: "rgba(245,158,11,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CreditCard size={14} color="#f59e0b" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "0.875rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.student?.firstName} {p.student?.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#475569",
                      fontWeight: 700,
                    }}
                  >
                    {p.date
                      ? new Date(p.date).toLocaleDateString("uz-UZ")
                      : "—"}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: "0.875rem",
                    color: "#34d399",
                    flexShrink: 0,
                  }}
                >
                  +{(p.amount ?? 0).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent students */}
      <div className="content-card">
        <h3
          style={{
            fontWeight: 800,
            fontSize: "1rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <UserPlus size={18} color="var(--primary)" /> Yangi Talabalar
        </h3>
        {(recent.students ?? []).length === 0 ? (
          <p
            style={{ color: "#334155", fontSize: "0.875rem", fontWeight: 700 }}
          >
            Talabalar topilmadi
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {recent.students.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "1rem",
                  borderRadius: "0.85rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "2px solid rgba(99,102,241,0.3)",
                  }}
                >
                  <img
                    src={
                      s.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(s.firstName + " " + s.lastName)}&background=6366f1&color=fff`
                    }
                    alt={s.firstName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) =>
                      (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.firstName || "U")}&background=6366f1&color=fff`)
                    }
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "0.875rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.firstName} {s.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#475569",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
