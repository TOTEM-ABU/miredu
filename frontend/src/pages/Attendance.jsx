import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Save,
  Loader2,
  AlertCircle,
  CalendarDays,
  Download
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

export default function Attendance() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attendanceData, setAttendanceData] = useState({}); // { studentId: status }

  // Hafta kunlari lug'ati
  const DAYS_MAP = {
    1: "Dushanba",
    2: "Seshanba",
    3: "Chorshanba",
    4: "Payshanba",
    5: "Juma",
    6: "Shanba",
    0: "Yakshanba",
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupDetails(selectedGroup.id);
    } else {
      setStudents([]);
      setAttendanceData({});
    }
  }, [selectedGroup]);

  // Sana o'zgarganda mavjud davomatni tekshirish
  useEffect(() => {
    if (selectedGroup && date) {
      fetchExistingAttendance();
    }
  }, [date, selectedGroup]);

  const fetchGroups = async () => {
    try {
      const { data } = await api.get("/api/group/GetAllGroupsWithFilters");
      setGroups(data.data || []);
    } catch (err) {
      toast.error("Guruhlarni yuklashda xatolik");
    }
  };

  const fetchGroupDetails = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/group/${id}`);
      setStudents(data.students || []);
      // Default hammani PRESENT qilib turish (agar yangi davomat bo'lsa)
      const initial = {};
      (data.students || []).forEach((s) => (initial[s.id] = "PRESENT"));
      setAttendanceData(initial);
    } catch (err) {
      toast.error("Guruh ma'lumotlarini olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const { data } = await api.get("/api/attendance", {
        params: { groupId: selectedGroup.id, date },
      });

      const newAttendance = {};

      if (data.data && data.data.length > 0) {
        data.data.forEach((a) => (newAttendance[a.studentId] = a.status));
        // O'quvchilar kamayib yoki ko'paygan bo'lsa, qolganlarni 'PRESENT' qilamiz
        students.forEach((s) => {
          if (!newAttendance[s.id]) newAttendance[s.id] = "PRESENT";
        });
        setAttendanceData(newAttendance);
        toast.success("Ushbu sana uchun davomat yuklandi");
      } else {
        // Agar o'sha sanaga davomat hali olinmagan bo'lsa, default hammaga 'PRESENT'
        students.forEach((s) => (newAttendance[s.id] = "PRESENT"));
        setAttendanceData(newAttendance);
      }
    } catch (err) {
      console.error("Attendance fetch error:", err);
    }
  };

  // Tanlangan sana guruh kuniga to'g'ri kelishini tekshirish
  const isDateValid = () => {
    if (!selectedGroup || !selectedGroup.days) return true;
    const dayOfWeek = new Date(date).getDay().toString();
    return selectedGroup.days.split(",").includes(dayOfWeek);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllAsPresent = () => {
    const next = { ...attendanceData };
    students.forEach((s) => (next[s.id] = "PRESENT"));
    setAttendanceData(next);
    toast.success('Barcha o\'quvchilar "Keldi" deb belgilandi');
  };

  const onSave = async () => {
    if (!isDateValid()) {
      return toast.error("Ushbu kunda guruhda dars yo'q!");
    }
    setSaving(true);
    try {
      const records = Object.entries(attendanceData).map(
        ([studentId, status]) => ({
          studentId,
          status,
        }),
      );
      await api.post("/api/attendance/bulk", {
        groupId: selectedGroup.id,
        date,
        records,
      });
      toast.success("Davomat muvaffaqiyatli saqlandi! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const downloadExcel = () => {
    if (!selectedGroup || students.length === 0) {
      return toast.error("Eksport qilish uchun ma'lumot yo'q");
    }

    const statusMap = {
      PRESENT: "Keldi",
      ABSENT: "Yo'q",
      LATE: "Kech qoldi",
    };

    const dataToExport = students.map((s, index) => ({
      "T/r": index + 1,
      "Ism Familiya": `${s.firstName} ${s.lastName}`,
      "Holati": statusMap[attendanceData[s.id]] || "Belgilanmagan",
      "Sana": date,
      "Guruh": selectedGroup.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Davomat");
    XLSX.writeFile(workbook, `${selectedGroup.name}_Davomat_${date}.xlsx`);

    toast.success("Excel fayl yuklandi! 📊");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 900,
            marginBottom: "0.4rem",
          }}
        >
          Davomat 📅
        </h1>
        <p style={{ color: "#475569", fontWeight: 600 }}>
          O'quvchilarning darsga qatnashishini nazorat qiling
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Group Selection */}
        <div className="content-card">
          <label className="field-label">Guruhni Tanlang</label>
          <div className="field-wrap">
            <Users className="field-icon" size={18} />
            <select
              className="field-input"
              style={{ appearance: "none" }}
              value={selectedGroup?.id || ""}
              onChange={(e) =>
                setSelectedGroup(groups.find((g) => g.id === e.target.value))
              }
            >
              <option value="" style={{ background: "#0f172a" }}>
                Guruhni tanlang...
              </option>
              {groups.map((g) => (
                <option
                  key={g.id}
                  value={g.id}
                  style={{ background: "#0f172a" }}
                >
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          {selectedGroup && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {selectedGroup.days?.split(",").map((d) => (
                <span
                  key={d}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "0.3rem 0.6rem",
                    borderRadius: "0.5rem",
                    background: "rgba(99,102,241,0.1)",
                    color: "var(--primary)",
                  }}
                >
                  {DAYS_MAP[d]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="content-card">
          <label className="field-label">Sana</label>
          <div className="field-wrap">
            <Calendar className="field-icon" size={18} />
            <input
              type="date"
              className="field-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {!isDateValid() && selectedGroup && (
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#ef4444",
              }}
            >
              <AlertCircle size={14} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                Ushbu kunda guruhda dars yo'q!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Student List */}
      <div
        className="content-card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: 850, fontSize: "1.1rem" }}>
            Talabalar Ro'yxati
          </h3>
          {selectedGroup && (
            <button
              onClick={markAllAsPresent}
              className="btn-ghost"
              style={{ fontSize: "0.75rem", color: "var(--primary)" }}
            >
              <CheckCircle2 size={16} /> Hammani "Keldi" qilish
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "3rem",
              }}
            >
              <Loader2 className="spin" size={32} color="var(--primary)" />
            </div>
          ) : !selectedGroup ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "#475569",
              }}
            >
              <CalendarDays
                size={48}
                style={{ marginBottom: "1rem", opacity: 0.3 }}
              />
              <p style={{ fontWeight: 700 }}>
                Davomat qilish uchun guruhni tanlang
              </p>
            </div>
          ) : students.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "#475569",
              }}
            >
              <p style={{ fontWeight: 700 }}>Guruhda o'quvchilar mavjud emas</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {students.map((student, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={student.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    borderRadius: "1rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid rgba(99,102,241,0.2)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={
                        student.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName)}&background=6366f1&color=fff`
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      alt={student.firstName}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "0.95rem",
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
                      ID: {student.id.slice(0, 8)}...
                    </div>
                  </div>

                  {/* Status Switcher */}
                  <div
                    style={{
                      display: "flex",
                      background: "rgba(0,0,0,0.2)",
                      padding: "0.25rem",
                      borderRadius: "0.75rem",
                      gap: "0.25rem",
                    }}
                  >
                    {[
                      {
                        id: "PRESENT",
                        label: "Keldi",
                        icon: CheckCircle2,
                        color: "#10b981",
                      },
                      {
                        id: "ABSENT",
                        label: "Yo'q",
                        icon: XCircle,
                        color: "#ef4444",
                      },
                      {
                        id: "LATE",
                        label: "Kech",
                        icon: Clock,
                        color: "#f59e0b",
                      },
                    ].map((st) => {
                      const isActive = attendanceData[student.id] === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => handleStatusChange(student.id, st.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.5rem 0.8rem",
                            borderRadius: "0.6rem",
                            border: "none",
                            background: isActive ? st.color : "transparent",
                            color: isActive ? "#fff" : "#475569",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                          }}
                        >
                          <st.icon size={14} />
                          <span
                            style={{ display: isActive ? "inline" : "none" }}
                          >
                            {st.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {selectedGroup && (
          <div
            style={{
              padding: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={downloadExcel}
              className="btn-secondary"
              style={{
                width: "auto",
                padding: "0.8rem 1.5rem",
                marginRight: "auto",
                background: "rgba(34,211,238,0.1)",
                color: "#22d3ee",
                border: "none",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(34,211,238,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(34,211,238,0.1)";
              }}
            >
              <Download size={18} /> Excel'ga Yuklash
            </button>
            <button
              onClick={onSave}
              disabled={saving || !isDateValid()}
              className="btn-primary"
              style={{ width: "auto", padding: "0.8rem 2.5rem" }}
            >
              {saving ? (
                <Loader2 className="spin" size={20} />
              ) : (
                <>
                  <Save size={18} /> Saqlash
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
