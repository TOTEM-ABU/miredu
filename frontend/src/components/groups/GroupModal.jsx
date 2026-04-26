import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BookOpen, Filter, DollarSign, Users, Clock, Info } from "lucide-react";
import api from "../../api/axios";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

const COURSE_TYPES = ["English", "Math"];

export default function GroupModal({
  isOpen,
  onClose,
  onSuccess,
  editingGroup,
  teachers,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    courseType: "English",
    price: "",
    description: "",
    teacherId: "",
    days: "1,3,5",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (editingGroup) {
      setForm({
        name: editingGroup.name,
        courseType: editingGroup.courseType,
        price: editingGroup.price.toString(),
        description: editingGroup.description || "",
        teacherId: editingGroup.teacherId || "",
        days: editingGroup.days || "1,3,5",
        startTime: editingGroup.startTime || "",
        endTime: editingGroup.endTime || "",
      });
    } else {
      setForm({
        name: "",
        courseType: "English",
        price: "",
        description: "",
        teacherId: "",
        days: "1,3,5",
        startTime: "",
        endTime: "",
      });
    }
  }, [editingGroup, isOpen]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        teacherId: form.teacherId || undefined,
      };
      if (editingGroup) {
        await api.patch(`/api/group/${editingGroup.id}`, payload);
        toast.success("Guruh yangilandi! ✅");
      } else {
        await api.post("/api/group", payload);
        toast.success("Yangi guruh yaratildi! ✅");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGroup ? "Guruhni Tahrirlash" : "Yangi Guruh"}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          marginTop: "-1rem",
        }}
      >
        <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
          Barcha maydonlarni to'ldiring
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <Input
          label="Guruh Nomi"
          icon={BookOpen}
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Masalan: IELTS Morning 1"
          required
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div className="field-group">
            <label className="field-label">Kurs Turi</label>
            <div className="field-wrap">
              <Filter className="field-icon" size={17} />
              <select
                name="courseType"
                value={form.courseType}
                onChange={onChange}
                className="field-input"
                style={{ appearance: "none" }}
              >
                {COURSE_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: "#0f172a" }}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Narxi (so'm)"
            icon={DollarSign}
            name="price"
            type="number"
            value={form.price}
            onChange={onChange}
            placeholder="550000"
            required
          />
        </div>

        <div className="field-group">
          <label className="field-label">O'qituvchi</label>
          <div className="field-wrap">
            <Users className="field-icon" size={17} />
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={onChange}
              required
              className="field-input"
              style={{ appearance: "none" }}
            >
              <option value="" style={{ background: "#0f172a" }}>
                O'qituvchini tanlang
              </option>
              {teachers.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  style={{ background: "#0f172a" }}
                >
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Day Selector */}
        <div className="field-group">
          <label className="field-label">Dars Kunlari</label>
          <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
            {[
              { id: "1", label: "Du" },
              { id: "2", label: "Se" },
              { id: "3", label: "Chor" },
              { id: "4", label: "Pay" },
              { id: "5", label: "Ju" },
              { id: "6", label: "Sha" },
              { id: "0", label: "Yak" },
            ].map((day) => {
              const isActive = form.days.split(",").includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => {
                    const current = form.days ? form.days.split(",") : [];
                    const next = isActive
                      ? current.filter((d) => d !== day.id)
                      : [...current, day.id];
                    setForm({ ...form, days: next.sort().join(",") });
                  }}
                  style={{
                    flex: 1,
                    padding: "0.6rem 0",
                    borderRadius: "0.6rem",
                    border: "1px solid",
                    background: isActive
                      ? "var(--primary)"
                      : "rgba(255,255,255,0.03)",
                    color: isActive ? "#fff" : "#64748b",
                    borderColor: isActive
                      ? "var(--primary)"
                      : "rgba(255,255,255,0.08)",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "center",
                  }}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Inputs */}
        <div className="field-group">
          <label className="field-label">
            Dars Vaqti (Boshlanish — Tugash)
          </label>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div className="field-wrap" style={{ flex: 1 }}>
              <Clock className="field-icon" size={17} />
              <input
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={onChange}
                className="field-input"
              />
            </div>
            <span style={{ color: "#475569", fontWeight: 900 }}>—</span>
            <div className="field-wrap" style={{ flex: 1 }}>
              <Clock className="field-icon" size={17} />
              <input
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={onChange}
                className="field-input"
              />
            </div>
          </div>
        </div>

        <div className="field-group" style={{ marginBottom: "2rem" }}>
          <label className="field-label">Tavsif (Optional)</label>
          <div className="field-wrap">
            <Info className="field-icon" size={17} style={{ top: "1.2rem" }} />
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="field-input"
              placeholder="Guruh haqida qisqacha ma'lumot..."
              style={{
                minHeight: "80px",
                paddingTop: "1rem",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          style={{ width: "100%", padding: "0.85rem" }}
        >
          {editingGroup ? "Saqlash" : "Yaratish"}
        </Button>
      </form>
    </Modal>
  );
}
