import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export function useStudents(filters) {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/User/GetAllStudentsWithFilters", {
        params: { ...filters, limit: 50, sortOrder: "desc" },
      });
      setStudents(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Talabalarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const deleteStudent = async (id, name) => {
    if (
      !window.confirm(
        `Haqiqatdan ham ${name} ismli o'quvchini tizimdan o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!`,
      )
    )
      return;
    try {
      await api.delete(`/api/User/STUDENT/${id}`);
      toast.success("Talaba muvaffaqiyatli o'chirildi");
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, total, loading, fetchStudents, deleteStudent };
}
