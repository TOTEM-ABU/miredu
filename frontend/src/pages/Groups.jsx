import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Loader2, BookOpen } from "lucide-react";
import { useGroups } from "../hooks/useGroups";
import { useTeachers } from "../hooks/useTeachers";
import GroupCard from "../components/groups/GroupCard";
import GroupModal from "../components/groups/GroupModal";
import AssignStudentModal from "../components/groups/AssignStudentModal";

const COURSE_TYPES = ["English", "Math"];

const KEYFRAMES = `
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Groups() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN" || user.role === "TEACHER";

  const { groups, loading, fetchGroups, deleteGroup } = useGroups();
  const { teachers } = useTeachers();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningGroup, setAssigningGroup] = useState(null);

  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = typeFilter === "All" || g.courseType === typeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <style>{KEYFRAMES}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              marginBottom: "0.4rem",
              letterSpacing: "-0.02em",
            }}
          >
            Guruhlar <span style={{ color: "var(--primary)" }}>Hubi</span> 📚
          </h1>
          <p style={{ color: "#64748b", fontWeight: 600 }}>
            O'quv markazidagi barcha faol va yangi guruhlar
          </p>
        </div>

        {isAdmin && (
          <button
            className="btn-primary"
            style={{
              width: "auto",
              padding: "0.8rem 1.75rem",
              gap: "0.6rem",
              borderRadius: "1rem",
            }}
            onClick={() => {
              setEditingGroup(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={20} strokeWidth={3} /> Yangi Guruh
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          alignItems: "center",
          background: "rgba(255,255,255,0.02)",
          padding: "0.75rem",
          borderRadius: "1.25rem",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="search-wrap" style={{ flex: 1, minWidth: "200px" }}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Guruh nomi bo'yicha qidiruv..."
            className="search-input"
            style={{ width: "100%", background: "transparent" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "rgba(0,0,0,0.2)",
            padding: "0.3rem",
            borderRadius: "0.85rem",
          }}
        >
          {["All", ...COURSE_TYPES].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.6rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 700,
                background:
                  typeFilter === type ? "var(--primary)" : "transparent",
                color: typeFilter === type ? "#fff" : "#64748b",
                transition: "all 0.2s",
              }}
            >
              {type === "All" ? "Barchasi" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
            }}
          >
            <Loader2
              size={40}
              color="var(--primary)"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div
            style={{
              height: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#475569",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "2rem",
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <BookOpen size={40} opacity={0.3} />
            </div>
            <h3
              style={{ fontSize: "1.25rem", fontWeight: 800, color: "#94a3b8" }}
            >
              Guruhlar topilmadi
            </h3>
            <p style={{ fontWeight: 600 }}>
              Qidiruv shartlarini o'zgartirib ko'ring
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.5rem",
              paddingBottom: "2rem",
            }}
          >
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isAdmin={isAdmin}
                onEdit={() => {
                  setEditingGroup(group);
                  setIsModalOpen(true);
                }}
                onDelete={() => deleteGroup(group.id)}
                onAssign={() => {
                  setAssigningGroup(group);
                  setIsAssignModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchGroups();
          setIsModalOpen(false);
        }}
        editingGroup={editingGroup}
        teachers={teachers}
      />

      <AssignStudentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          fetchGroups();
          setIsAssignModalOpen(false);
        }}
        group={assigningGroup}
      />
    </motion.div>
  );
}
