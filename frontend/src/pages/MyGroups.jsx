import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award } from "lucide-react";
import { useMyGroups } from "../hooks/useMyGroups";
import MyGroupCard from "../components/groups/MyGroupCard";
import GroupDetailModal from "../components/groups/GroupDetailModal";

export default function MyGroups() {
  const { groups, loading } = useMyGroups();
  const [selectedGroup, setSelectedGroup] = useState(null);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-groups-page"
      style={{ minHeight: "100%", position: "relative" }}
    >
      {/* Page Header */}
      <div
        style={{
          marginBottom: "3.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{
              fontSize: "2.75rem",
              fontWeight: 950,
              color: "#f8fafc",
              marginBottom: "0.6rem",
              letterSpacing: "-0.02em",
            }}
          >
            Mening <span className="title-gradient">Guruhlarim</span> 📚
          </motion.h1>
          <p style={{ color: "#94a3b8", fontWeight: 600, fontSize: "1.1rem" }}>
            O'quv jarayoningiz va faol kurslaringiz monitoringi
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: "0.85rem 1.5rem",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Jami guruhlar
            </div>
            <div
              style={{ fontSize: "1.5rem", fontWeight: 950, color: "#818cf8" }}
            >
              {groups.length} ta
            </div>
          </div>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "1rem",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 8px 16px var(--primary-glow)",
            }}
          >
            <Award size={24} />
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "2rem",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="content-card skeleton-card"
                style={{
                  height: "320px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="skeleton-shine" />
              </div>
            ))}
          </motion.div>
        ) : groups.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="content-card"
            style={{
              textAlign: "center",
              padding: "7rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "3rem",
                background: "rgba(99,102,241,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5rem",
                border: "1px solid rgba(99,102,241,0.1)",
              }}
            >
              <BookOpen size={56} style={{ color: "#6366f1", opacity: 0.4 }} />
            </div>
            <h3
              style={{
                color: "#f1f5f9",
                fontWeight: 900,
                fontSize: "1.75rem",
                marginBottom: "1rem",
              }}
            >
              Siz hali hech qanday guruhga a'zo emassiz
            </h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1.1rem",
                fontWeight: 600,
                maxWidth: "450px",
                lineHeight: "1.7",
              }}
            >
              Kurslarga yozilish yoki guruhga qo'shilish uchun o'quv
              markazimizning administratoriga murojaat qiling.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={containerVars}
            initial="hidden"
            animate="show"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "2rem",
            }}
          >
            {groups.map((g) => (
              <MyGroupCard
                key={g.id}
                group={g}
                variants={itemVars}
                onSelect={setSelectedGroup}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <GroupDetailModal
        group={selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .title-gradient { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .group-card-premium { 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(12px);
          cursor: pointer;
        }
        .group-card-premium:hover { 
          transform: translateY(-8px); 
          border-color: rgba(255,255,255,0.15); 
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          background: rgba(255,255,255,0.03);
        }
        
        .group-card-premium:hover .top-corner-icon { opacity: 1 !important; transform: scale(1.1) rotate(5deg); }
        
        .pro-details-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f8fafc;
          padding: 0.6rem 1.15rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pro-details-btn:hover {
          background: #fff;
          color: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(255,255,255,0.5);
        }
        
        .skeleton-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 1.5rem; }
        .skeleton-shine {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          animation: shine 1.5s infinite;
        }
        @keyframes shine { to { left: 200%; } }
      `}</style>
    </motion.div>
  );
}
