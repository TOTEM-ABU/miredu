import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, UserPlus, Edit, Trash2 } from "lucide-react";
import { formatDays } from "../../utils/format";

export default function GroupCard({
  group,
  isAdmin,
  onEdit,
  onDelete,
  onAssign,
}) {
  // Current user for checking if the teacher is the owner of the group
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <motion.div
      layout
      className="content-card"
      style={{ padding: "1.5rem", position: "relative", overflow: "visible" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "0.6rem",
            background:
              group.courseType === "English"
                ? "rgba(99,102,241,0.1)"
                : "rgba(34,211,238,0.1)",
            color: group.courseType === "English" ? "#818cf8" : "#22d3ee",
            fontSize: "0.75rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {group.courseType}
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(isAdmin || group.teacherId === currentUser?.id) && (
            <button
              onClick={onAssign}
              title="O'quvchi qo'shish"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "none",
                color: "#34d399",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserPlus size={16} />
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={onEdit}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={onDelete}
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <h3
        style={{
          fontSize: "1.4rem",
          fontWeight: 900,
          marginBottom: "0.5rem",
          color: "#f1f5f9",
        }}
      >
        {group.name}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#64748b",
          fontWeight: 500,
          marginBottom: "1.25rem",
          lineHeight: "1.5",
        }}
      >
        {group.description || "Ushbu guruh uchun tavsif mavjud emas."}
      </p>

      {/* Days Info */}
      {(group.days || group.startTime || group.endTime) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            background: "rgba(255,255,255,0.02)",
            padding: "0.75rem 1rem",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.02)",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(245,158,11,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CalendarDays size={16} color="#fbbf24" />
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
              Vaqti
            </div>
            <div
              style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fbbf24" }}
            >
              {formatDays(group.days)}{" "}
              {group.startTime ? `| ${group.startTime}` : ""}
              {group.endTime ? ` - ${group.endTime}` : ""}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            padding: "0.75rem",
            borderRadius: "0.85rem",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Narxi
          </div>
          <div style={{ color: "#34d399", fontWeight: 900, fontSize: "1rem" }}>
            {group.price.toLocaleString()} so'm
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            padding: "0.75rem",
            borderRadius: "0.85rem",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            O'quvchilar
          </div>
          <div style={{ color: "#f1f5f9", fontWeight: 900, fontSize: "1rem" }}>
            {group._count?.students || 0} ta
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(99,102,241,0.3)",
            background: "rgba(99,102,241,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
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
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=T";
              }}
            />
          ) : (
            <span
              style={{ color: "#818cf8", fontWeight: 800, fontSize: "0.9rem" }}
            >
              {group.teacher?.name?.[0] || "T"}
            </span>
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            O'qituvchi
          </div>
          <div
            style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0" }}
          >
            {group.teacher?.name || "Biriktirilmagan"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
