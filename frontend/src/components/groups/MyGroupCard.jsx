import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  CalendarDays,
  ChevronRight,
  Award,
} from "lucide-react";

export default function MyGroupCard({ group, onSelect, variants }) {
  return (
    <motion.div
      variants={variants}
      className="content-card group-card-premium"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "1.5rem",
      }}
    >
      {/* Category Badge & Top Right Accent */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.85rem",
            borderRadius: "2rem",
            fontSize: "0.65rem",
            fontWeight: 900,
            background:
              group.courseType === "English"
                ? "rgba(99,102,241,0.1)"
                : "rgba(34,211,238,0.1)",
            color: group.courseType === "English" ? "#a5b4fc" : "#67e8f9",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            border:
              group.courseType === "English"
                ? "1px solid rgba(99,102,241,0.2)"
                : "1px solid rgba(34,211,238,0.2)",
          }}
        >
          <Award size={12} /> Categoriya: {group.courseType}
        </span>

        <div
          style={{ opacity: 0.3, transition: "all 0.3s" }}
          className="top-corner-icon"
        >
          <BookOpen
            size={20}
            color={group.courseType === "English" ? "#818cf8" : "#22d3ee"}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <h3
          style={{
            fontSize: "1.75rem",
            fontWeight: 950,
            color: "#f8fafc",
            letterSpacing: "-0.02em",
            wordBreak: "break-word",
            lineHeight: "1.2",
          }}
        >
          {group.name}
        </h3>
      </div>

      {/* Stacked Info Blocks */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {/* Teacher Info Micro-layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            background: "rgba(255,255,255,0.02)",
            padding: "0.75rem 1rem",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.02)",
          }}
        >
          <div
            className="teacher-avatar-ring"
            style={{ width: "40px", height: "40px" }}
          >
            {group.teacher?.avatar ? (
              <img
                src={
                  group.teacher.avatar.startsWith("http")
                    ? group.teacher.avatar
                    : `http://localhost:3000${group.teacher.avatar}`
                }
                alt="Teacher"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: group.teacher?.avatar ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.03)",
                color: "#64748b",
                fontSize: "0.75rem",
                fontWeight: 900,
              }}
            >
              {group.teacher?.name
                ? group.teacher.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "?"}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              O'qituvchi
            </div>
            <div
              style={{ fontSize: "0.95rem", fontWeight: 800, color: "#e2e8f0" }}
            >
              {group.teacher?.name || "Biriktirilmagan"}
            </div>
          </div>
        </div>

        {/* Days Info Micro-layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            background: "rgba(255,255,255,0.02)",
            padding: "0.75rem 1rem",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarDays size={18} color="#94a3b8" />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Dars Kunlari & Vaqti
            </div>
            <div
              style={{ fontSize: "0.95rem", fontWeight: 800, color: "#e2e8f0" }}
            >
              {group.days || "Belgilanmagan"}{" "}
              {group.startTime ? ` | ${group.startTime}` : ""}
              {group.endTime ? ` - ${group.endTime}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flexGrow: 1 }} />

      {/* Footer Stats & Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "1.5rem",
          borderTop: "1px dashed rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                color: "#64748b",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              O'quvchilar
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.95rem",
                color: "#f1f5f9",
                fontWeight: 900,
              }}
            >
              <Users size={14} color="#64748b" /> {group._count?.students || 0}
            </span>
          </div>
        </div>

        <button className="pro-details-btn" onClick={() => onSelect(group)}>
          Tafsilotlar <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
