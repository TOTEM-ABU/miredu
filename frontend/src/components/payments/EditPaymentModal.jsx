import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DollarSign } from "lucide-react";
import api from "../../api/axios";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function EditPaymentModal({ payment, onClose, onSuccess }) {
  const [form, setForm] = useState({
    amount: "",
    paymentType: "CASH",
    status: "PAID",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (payment) {
      setForm({
        amount: payment.amount || "",
        paymentType: payment.paymentType || "CASH",
        status: payment.status || "PAID",
      });
    }
  }, [payment]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/api/payment/${payment.id}`, {
        ...form,
        amount: Number(form.amount),
      });
      toast.success("To'lov muvaffaqiyatli tahrirlandi! ✅");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!payment} onClose={onClose} title="To'lovni Tahrirlash">
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          marginTop: "-1rem",
        }}
      >
        <p style={{ color: "#64748b", fontWeight: 600 }}>
          {payment?.student?.firstName} {payment?.student?.lastName} uchun
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <Input
          label="Summa (so'm)"
          icon={DollarSign}
          type="number"
          required
          placeholder="Masalan: 500000"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

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
          O'zgarishlarni Saqlash
        </Button>
      </form>
    </Modal>
  );
}
