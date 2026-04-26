import React, { useState } from "react";
import toast from "react-hot-toast";
import { Users, Mail, Phone, Lock } from "lucide-react";
import api from "../../api/axios";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    parentsPhoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/User/registerStudent", form);
      toast.success("Talaba muvaffaqiyatli saqlandi! ✅");
      onSuccess();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Ro'yxatdan o'tkazishda xatolik",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yangi Talaba Qo'shish">
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          marginTop: "-1rem",
        }}
      >
        <p style={{ color: "#64748b", fontWeight: 600 }}>
          Tizimga o'quvchi ma'lumotlarini kiriting
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <Input
            label="Ism"
            icon={Users}
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="Aziz"
            required
          />
          <Input
            label="Familiya"
            icon={Users}
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Azizov"
            required
          />
        </div>

        <Input
          label="Email manzil"
          icon={Mail}
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="misol@mail.com"
          required
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <Input
            label="Telefon raqam"
            icon={Phone}
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            placeholder="+998901234567"
            required
          />
          <Input
            label="Ota-onasi raqami"
            icon={Phone}
            name="parentsPhoneNumber"
            value={form.parentsPhoneNumber}
            onChange={onChange}
            placeholder="+998901234567"
            required
          />
        </div>

        <Input
          label="Vaqtinchalik Parol"
          icon={Lock}
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="123456"
          minLength={6}
          maxLength={8}
          required
        />

        <Button
          type="submit"
          loading={loading}
          style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
        >
          Talabani Saqlash
        </Button>
      </form>
    </Modal>
  );
}
