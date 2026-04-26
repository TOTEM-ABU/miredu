import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Calendar, Loader2 } from "lucide-react";
import api from "../../api/axios";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function AddPaymentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    studentId: "",
    coursePrice: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentType: "CASH",
    status: "PAID",
  });
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api
        .get("/api/group/GetAllGroupsWithFilters?limit=100")
        .then((res) => setGroups(res.data.data || []))
        .catch(console.error);
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
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId) return toast.error("O'quvchini tanlang");
    setLoading(true);
    try {
      const paidAmount = Number(form.amount);
      const coursePrice = Number(form.coursePrice);

      // Asosiy to'lovni yaratish
      await api.post("/api/payment", {
        studentId: form.studentId,
        amount: paidAmount,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        paymentType: form.paymentType,
        status: form.status,
      });

      // Agar kurs narxi kiritilgan bo'lsa va to'langan summadan katta bo'lsa, Qarz (PENDING) yaratish
      if (
        coursePrice > 0 &&
        coursePrice > paidAmount &&
        form.status === "PAID"
      ) {
        const debtAmount = coursePrice - paidAmount;
        await api.post("/api/payment", {
          studentId: form.studentId,
          amount: debtAmount,
          date: form.date ? new Date(form.date).toISOString() : undefined,
          paymentType: form.paymentType,
          status: "PENDING",
        });
        toast.success(
          `To'lov qabul qilindi va ${new Intl.NumberFormat("uz-UZ").format(debtAmount)} so'm qarz (kutilayotgan) ga o'tkazildi! ✅`,
        );
      } else {
        toast.success("To'lov qabul qilindi! ✅");
      }

      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="To'lov Qabul Qilish">
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          marginTop: "-1rem",
        }}
      >
        <p style={{ color: "#64748b", fontWeight: 600 }}>
          Tizimga yangi to'lovni kiriting
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="field-group">
          <label className="field-label">O'quvchini qidirish</label>
          <div className="field-wrap">
            <Search className="field-icon" size={17} />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="field-input"
              placeholder="Ism yoki familiya..."
            />
            {searching && (
              <Loader2
                size={16}
                className="field-icon"
                style={{
                  right: "1rem",
                  left: "auto",
                  animation: "spin 1s linear infinite",
                }}
              />
            )}
          </div>

          {students.length > 0 && (
            <div
              style={{
                marginTop: "0.5rem",
                background: "rgba(15,23,42,0.9)",
                borderRadius: "0.8rem",
                border: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}
            >
              {students.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setForm({ ...form, studentId: s.id });
                    setSearch(`${s.firstName} ${s.lastName}`);
                    setStudents([]);
                  }}
                  style={{
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(99,102,241,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      color: "#fff",
                      fontWeight: 900,
                    }}
                  >
                    {s.firstName[0]}
                  </div>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#e2e8f0",
                      fontWeight: 700,
                    }}
                  >
                    {s.firstName} {s.lastName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          label="To'lov Sanasi (Haqiqiy davr boshlanishi)"
          icon={Calendar}
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className="field-group">
            <label className="field-label">Kursni tanlang</label>
            <select
              className="field-input"
              onChange={(e) => {
                const selectedGroup = groups.find(
                  (g) => g.id === e.target.value,
                );
                setForm({
                  ...form,
                  coursePrice: selectedGroup ? selectedGroup.price : "",
                });
              }}
              style={{ appearance: "none" }}
            >
              <option value="" style={{ background: "#0f172a" }}>
                Tanlang (ixtiyoriy)
              </option>
              {groups.map((g) => (
                <option
                  key={g.id}
                  value={g.id}
                  style={{ background: "#0f172a" }}
                >
                  {g.name} - {g.price} so'm
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Asosiy Kurs Narxi"
            type="number"
            placeholder="Avtomatik yoki qo'lda"
            value={form.coursePrice}
            onChange={(e) => setForm({ ...form, coursePrice: e.target.value })}
          />
        </div>

        <div className="field-group">
          <label className="field-label">To'langan Summa</label>
          <input
            type="number"
            required
            className="field-input"
            placeholder="Masalan: 300000"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className="field-group">
            <label className="field-label">To'lov Turi</label>
            <select
              className="field-input"
              value={form.paymentType}
              onChange={(e) =>
                setForm({ ...form, paymentType: e.target.value })
              }
              style={{ appearance: "none" }}
            >
              <option
                style={{ background: "#0f172a", color: "#f1f5f9" }}
                value="CASH"
              >
                Naqd
              </option>
              <option
                style={{ background: "#0f172a", color: "#f1f5f9" }}
                value="CARD"
              >
                Plastik
              </option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Status</label>
            <select
              className="field-input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ appearance: "none" }}
            >
              <option
                style={{ background: "#0f172a", color: "#10b981" }}
                value="PAID"
              >
                To'langan
              </option>
              <option
                style={{ background: "#0f172a", color: "#f59e0b" }}
                value="PENDING"
              >
                Kutilmoqda
              </option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
        >
          Tasdiqlash
        </Button>
      </form>
    </Modal>
  );
}
