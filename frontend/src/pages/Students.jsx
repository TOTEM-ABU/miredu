import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Loader2, Phone, Edit } from "lucide-react";
import { useStudents } from "../hooks/useStudents";
import AddStudentModal from "../components/students/AddStudentModal";

export default function Students() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN";

  const [filters, setFilters] = useState({ firstName: "", phoneNumber: "" });
  const { students, total, loading, fetchStudents, deleteStudent } =
    useStudents(filters);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="students-page"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2.5rem",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              color: "#f1f5f9",
              marginBottom: "0.4rem",
            }}
          >
            Talabalar ({total})
          </h1>
          <p style={{ color: "#64748b", fontWeight: 600 }}>
            Markazdagi barcha mavjud talabalar ro'yxati
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{
              width: "auto",
              padding: "0.6rem 1.25rem",
              height: "fit-content",
            }}
          >
            <Plus size={18} /> Yangi Talaba
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div
        className="content-card"
        style={{
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, minWidth: "220px" }}>
          <div className="field-wrap">
            <Search className="field-icon" size={17} />
            <input
              placeholder="Ism bo'yicha qidiruv..."
              className="field-input"
              value={filters.firstName}
              onChange={(e) =>
                setFilters({ ...filters, firstName: e.target.value })
              }
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <div className="field-wrap">
            <Phone className="field-icon" size={17} />
            <input
              placeholder="Telefon raqami..."
              className="field-input"
              value={filters.phoneNumber}
              onChange={(e) =>
                setFilters({ ...filters, phoneNumber: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="content-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <th
                  style={{
                    padding: "1.25rem 1.5rem",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Talaba (F.I.SH)
                </th>
                <th
                  style={{
                    padding: "1.25rem 1.5rem",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Aloqa (Email / Raqam)
                </th>
                <th
                  style={{
                    padding: "1.25rem 1.5rem",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Ota-onasi (Raqam)
                </th>
                <th
                  style={{
                    padding: "1.25rem 1.5rem",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Ro'yxatdan o'tgan
                </th>
                {isAdmin && (
                  <th style={{ padding: "1.25rem 1.5rem", width: "50px" }}></th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ padding: "4rem", textAlign: "center" }}
                  >
                    <Loader2
                      className="spin"
                      size={32}
                      color="var(--primary)"
                    />
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "4rem",
                      textAlign: "center",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    Hech qanday talabalar topilmadi
                  </td>
                </tr>
              ) : (
                students.map((s, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={s.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      transition: "all 0.2s",
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "rgba(99,102,241,0.15)",
                            border: "2px solid rgba(99,102,241,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#818cf8",
                            fontWeight: 900,
                            fontSize: "1rem",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {s.avatar ? (
                            <img
                              src={
                                s.avatar.startsWith("http")
                                  ? s.avatar
                                  : `http://localhost:3000${s.avatar}`
                              }
                              alt="Avatar"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <span
                            style={{
                              display: s.avatar ? "none" : "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {s.firstName?.[0]?.toUpperCase() || ""}
                            {s.lastName?.[0]?.toUpperCase() || ""}
                          </span>
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "#f1f5f9",
                              fontSize: "1rem",
                            }}
                          >
                            {s.firstName} {s.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          color: "#e2e8f0",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {s.phoneNumber}
                      </div>
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {s.email}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div
                        style={{
                          color: "#e2e8f0",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                        }}
                      >
                        {s.parentsPhoneNumber || "-"}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "#94a3b8",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {new Date(s.createdAt).toLocaleDateString("uz-UZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    {isAdmin && (
                      <td
                        style={{ padding: "1rem 1.5rem", textAlign: "right" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "0.4rem",
                          }}
                        >
                          <button
                            className="btn-icon"
                            style={{ color: "#6366f1" }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteStudent(s.id, s.firstName)}
                            className="btn-icon"
                            style={{ color: "#ef4444" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchStudents();
        }}
      />

      <style>{`
        .table-row-hover:hover { background: rgba(255,255,255,0.015); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
