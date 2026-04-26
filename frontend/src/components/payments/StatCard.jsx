import React from "react";

export default function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div
      className="content-card"
      style={{ padding: "1.5rem", borderLeft: `4px solid ${color}` }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#64748b",
              fontSize: "0.8rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
            }}
          >
            {label}
          </div>
          <div
            style={{ fontSize: "1.5rem", fontWeight: 900, color: "#f1f5f9" }}
          >
            {value}
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "1rem",
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
