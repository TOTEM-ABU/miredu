import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  UserCircle,
  DollarSign,
  Clock,
  Info,
  GraduationCap,
  X,
} from "lucide-react";

export default function GroupDetailModal({ group, onClose }) {
  const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p) + " so'm";

  return (
    <AnimatePresence>
      {group && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(3, 7, 18, 0.75)",
              backdropFilter: "blur(16px)",
              zIndex: 9999,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 10000,
              width: "100%",
              maxWidth: "550px",
              padding: "1.5rem",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                background: "#0f172a",
                borderRadius: "2rem",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.02) inset",
                position: "relative",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                  e.currentTarget.style.color = "#ef4444";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <X size={18} strokeWidth={3} />
              </button>

              {/* Cover graphic */}
              <div
                style={{
                  height: "140px",
                  background:
                    group.courseType === "English"
                      ? "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)"
                      : "linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(14,165,233,0.1) 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.5,
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    right: "-10px",
                    opacity: 0.1,
                    transform: "rotate(-15deg)",
                  }}
                >
                  <GraduationCap size={140} color="#fff" />
                </div>
              </div>

              {/* Content */}
              <div
                style={{
                  padding: "0 2rem 2.5rem 2rem",
                  position: "relative",
                  marginTop: "-40px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "1.5rem",
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                      color:
                        group.courseType === "English" ? "#818cf8" : "#22d3ee",
                    }}
                  >
                    <BookOpen size={36} strokeWidth={2.5} />
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        background:
                          group.courseType === "English"
                            ? "#4f46e5"
                            : "#0284c7",
                        color: "#fff",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {group.courseType}
                    </span>
                    <h2
                      style={{
                        fontSize: "2rem",
                        fontWeight: 950,
                        color: "#fff",
                        letterSpacing: "-0.02em",
                        lineHeight: "1.2",
                      }}
                    >
                      {group.name}
                    </h2>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "1rem",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "0.75rem",
                        background: "rgba(99,102,241,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                      }}
                    >
                      {group.teacher?.avatar ? (
                        <img
                          src={group.teacher.avatar.startsWith('http') ? group.teacher.avatar : `http://localhost:3000${group.teacher.avatar}`}
                          alt="Teacher"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div style={{ display: group.teacher?.avatar ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#818cf8', fontSize: '0.8rem', fontWeight: 900 }}>
                        {group.teacher?.name ? group.teacher.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Ustoz
                      </div>
                      <div
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 800,
                          color: "#f1f5f9",
                        }}
                      >
                        {group.teacher?.name || "Biriktirilmagan"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "1rem",
                        border: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "0.75rem",
                          background: "rgba(16,185,129,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DollarSign size={20} color="#34d399" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#64748b",
                            textTransform: "uppercase",
                            marginBottom: "0.2rem",
                          }}
                        >
                          To'lov
                        </div>
                        <div
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 900,
                            color: "#34d399",
                          }}
                        >
                          {formatPrice(group.price)}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "1rem",
                        border: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "0.75rem",
                          background: "rgba(245,158,11,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Clock size={20} color="#fbbf24" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#64748b",
                            textTransform: "uppercase",
                            marginBottom: "0.2rem",
                          }}
                        >
                          Kunlar
                        </div>
                        <div
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 900,
                            color: "#fbbf24",
                          }}
                        >
                          {group.days || "Kiritilmagan"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "1.25rem",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "1rem",
                    border: "1px dashed rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <Info size={16} color="#94a3b8" />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                      }}
                    >
                      Guruh haqida
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#cbd5e1",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    {group.description ||
                      "Ushbu kurs uslubiy jihatdan ilg'or va zamonaviy o'quv standartlariga javob beradi. Muntazam tarzda darslarda qatnashib borish tavsiya etiladi."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
