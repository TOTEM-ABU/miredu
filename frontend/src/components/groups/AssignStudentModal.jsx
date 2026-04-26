import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Loader2 } from "lucide-react";
import api from "../../api/axios";
import Modal from "../ui/Modal";
import Input from "../ui/Input";

export default function AssignStudentModal({
  isOpen,
  onClose,
  onSuccess,
  group,
}) {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setStudents([]);
    }
  }, [isOpen]);

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length < 2) {
      setStudents([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await api.get("/api/User/GetAllStudentsWithFilters", {
        params: { firstName: val, limit: 5 },
      });
      setStudents(data.data || []);
    } catch (err) {
      console.error("Student search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async (studentId) => {
    if (!group) return;

    setLoading(true);

    try {
      await api.patch("/api/group/addStudentToGroup", {
        studentId,
        groupId: group.id,
      });

      toast.success("O'quvchi guruhga biriktirildi! ✅");
      onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Xatolik yuz berdi";
      toast.error(`Xatolik: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="O'quvchi Qo'shish">
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          marginTop: "-1rem",
        }}
      >
        <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
          Guruh: <span style={{ color: "var(--primary)" }}>{group?.name}</span>
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <Input
          label="O'quvchini qidirish"
          icon={Search}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Ism yoki familiya..."
          autoFocus
        />
        {searching && (
          <Loader2
            size={16}
            style={{
              position: "absolute",
              right: "1rem",
              top: "2.4rem",
              color: "#64748b",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
      </div>

      <div
        style={{
          maxHeight: "250px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                borderRadius: "0.85rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(99,102,241,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#818cf8", fontWeight: 800 }}>
                  {student.firstName[0]}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "#f1f5f9",
                  }}
                >
                  {student.firstName} {student.lastName}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  {student.phoneNumber}
                </div>
              </div>
              <button
                onClick={() => handleAssign(student.id)}
                disabled={loading}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.6rem",
                  border: "none",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                Qo'shish
              </button>
            </div>
          ))
        ) : search.length >= 2 && !searching ? (
          <div
            style={{
              textAlign: "center",
              color: "#64748b",
              padding: "1rem",
              fontWeight: 600,
            }}
          >
            O'quvchi topilmadi
          </div>
        ) : search.length < 2 ? (
          <div
            style={{
              textAlign: "center",
              color: "#475569",
              padding: "1rem",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            Kamida 2 ta harf kiriting...
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
