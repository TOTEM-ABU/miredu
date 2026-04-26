import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  BadgeInfo,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import "dayjs/locale/uz-latn";

dayjs.locale("uz-latn");

const STATUS_MAP = {
  PAID: {
    label: "To'langan",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    icon: CheckCircle2,
  },
  PENDING: {
    label: "Kutilmoqda",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    icon: Clock,
  },
  UNPAID: {
    label: "To'lanmagan",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    icon: XCircle,
  },
};

const TYPE_MAP = {
  CASH: { label: "Naqd pul", icon: DollarSign },
  CARD: { label: "Plastik karta", icon: CreditCard },
};

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      if (!user.id) throw new Error("Foydalanuvchi topilmadi");
      const { data } = await api.get(
        `/api/payment/student/${user.id}?limit=100`,
      );
      setPayments(data.data || []);
    } catch (error) {
      console.error("Fetch payments error:", error);
      toast.error("To'lovlarni yuklashda xatolik yuz berdi");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ── Hisob-kitoblar ──────────────────────────────────────────────────────────
  const formatPrice = (n) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const lastPaidPayment = payments.find((p) => p.status === "PAID");
  const nextPaymentDate = lastPaidPayment
    ? dayjs(lastPaidPayment.date).add(1, "month")
    : null;
  const daysUntilNext = nextPaymentDate
    ? nextPaymentDate.startOf("day").diff(dayjs().startOf("day"), "day")
    : null;

  // Animations
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVars = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: "4rem", minHeight: "100%" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: 950,
            color: "#f8fafc",
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="title-gradient">To'lovlarim</span> 💳
        </motion.h1>
        <p style={{ color: "#94a3b8", fontWeight: 600, fontSize: "1.05rem" }}>
          Barcha moliyaviy operatsiyalar tarixi va keyingi to'lov muddati
        </p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-card"
                  style={{ height: "140px" }}
                >
                  <div className="skeleton-shine" />
                </div>
              ))}
            </div>
            <div className="skeleton-card" style={{ height: "400px" }}>
              <div className="skeleton-shine" />
            </div>
          </motion.div>
        ) : payments.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="content-card"
            style={{
              textAlign: "center",
              padding: "6rem 2rem",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(99,102,241,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
              }}
            >
              <Wallet size={48} color="#6366f1" style={{ opacity: 0.5 }} />
            </div>
            <h3
              style={{
                color: "#f1f5f9",
                fontWeight: 900,
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              To'lov tarixi bo'sh
            </h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1rem",
                fontWeight: 500,
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              Sizda hali hech qanday to'lov qayd etilmagan. To'lov
              qilganingizdan so'ng bu yerda aks etadi.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* ── Top Stats Grid ──────────────────────────────────────────────── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              {/* Jami to'langan */}
              <motion.div
                variants={itemVars}
                initial="hidden"
                animate="show"
                className="content-card"
                style={{
                  padding: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.06)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "0.75rem",
                      background: "rgba(16,185,129,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={18} color="#10b981" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Jami to'langan
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "#10b981",
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(totalPaid)}
                </div>
              </motion.div>

              {/* Kutilayotgan */}
              <motion.div
                variants={itemVars}
                initial="hidden"
                animate="show"
                className="content-card"
                style={{
                  padding: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(245,158,11,0.06)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "0.75rem",
                      background: "rgba(245,158,11,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Clock size={18} color="#f59e0b" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Kutilayotgan
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "#f59e0b",
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(totalPending)}
                </div>
              </motion.div>

              {/* Keyingi to'lov sanasi */}
              <motion.div
                variants={itemVars}
                initial="hidden"
                animate="show"
                className="content-card"
                style={{
                  padding: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(99,102,241,0.06)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "0.75rem",
                      background: "rgba(99,102,241,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CalendarDays size={18} color="#818cf8" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Keyingi to'lov
                  </span>
                </div>
                {nextPaymentDate ? (
                  <>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 900,
                        color: "#f8fafc",
                        lineHeight: 1,
                      }}
                    >
                      {nextPaymentDate.format("DD MMMM")}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "1rem",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        background:
                          daysUntilNext <= 5
                            ? "rgba(239,68,68,0.1)"
                            : daysUntilNext <= 15
                              ? "rgba(245,158,11,0.1)"
                              : "rgba(16,185,129,0.1)",
                        color:
                          daysUntilNext <= 5
                            ? "#ef4444"
                            : daysUntilNext <= 15
                              ? "#f59e0b"
                              : "#10b981",
                      }}
                    >
                      {daysUntilNext <= 0
                        ? "Bugun yoki o'tib ketgan!"
                        : `${daysUntilNext} kun qoldi`}
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#64748b",
                    }}
                  >
                    Ma'lumot yo'q
                  </div>
                )}
              </motion.div>
            </div>

            {/* ── Payment History ─────────────────────────────────────────────── */}
            <div className="content-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 900,
                    color: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Receipt size={22} color="#818cf8" /> To'lov Tarixi
                </h3>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    color: "#64748b",
                    background: "rgba(255,255,255,0.03)",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "2rem",
                  }}
                >
                  Jami: {payments.length} ta
                </span>
              </div>

              <motion.div
                variants={containerVars}
                initial="hidden"
                animate="show"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {payments.map((p) => {
                  const status = STATUS_MAP[p.status] || STATUS_MAP.UNPAID;
                  const type = TYPE_MAP[p.paymentType] || TYPE_MAP.CASH;
                  const StatusIcon = status.icon;
                  const TypeIcon = type.icon;

                  return (
                    <motion.div
                      key={p.id}
                      variants={itemVars}
                      className="payment-row"
                    >
                      {/* Left: Icon */}
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "1rem",
                          flexShrink: 0,
                          background: status.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {p.status === "PAID" ? (
                          <ArrowUpRight
                            size={22}
                            color={status.color}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <ArrowDownRight
                            size={22}
                            color={status.color}
                            strokeWidth={2.5}
                          />
                        )}
                      </div>

                      {/* Center: Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1rem",
                              fontWeight: 800,
                              color: "#f1f5f9",
                            }}
                          >
                            {formatPrice(p.amount)}
                          </span>
                          <span
                            style={{
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.5rem",
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              background: status.bg,
                              color: status.color,
                              textTransform: "uppercase",
                            }}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#64748b",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <CalendarDays size={13} />{" "}
                            {dayjs(p.date).format("DD MMMM, YYYY")}
                          </span>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#64748b",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <TypeIcon size={13} /> {type.label}
                          </span>
                        </div>
                      </div>

                      {/* Right: Chevron amount indicator */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            color:
                              p.status === "PAID"
                                ? "#10b981"
                                : p.status === "PENDING"
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        >
                          {p.status === "PAID" ? "+" : "-"}
                          {formatPrice(p.amount)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .title-gradient { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .skeleton-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 1.5rem; position: relative; overflow: hidden; }
        .skeleton-shine {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          animation: shine 1.5s infinite;
        }
        @keyframes shine { to { left: 200%; } }

        .payment-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 1.25rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }
        .payment-row:hover {
          background: rgba(255,255,255,0.025);
          border-color: rgba(255,255,255,0.08);
          transform: translateX(4px);
        }
      `}</style>
    </motion.div>
  );
}
