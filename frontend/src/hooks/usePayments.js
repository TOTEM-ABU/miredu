import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export function usePayments(filters) {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPaid: 0,
    pendingCount: 0,
    todayPaid: 0,
  });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/payment", {
        params: { ...filters, limit: 50 },
      });
      const paymentData = data.data || [];
      setPayments(paymentData);
      setTotal(data.total || 0);

      const paid = paymentData
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0);
      const pending = paymentData.filter((p) => p.status === "PENDING").length;

      // Calculate today's paid (just for demo now, ideally from API)
      setStats({ totalPaid: paid, pendingCount: pending, todayPaid: paid / 2 });
    } catch (err) {
      console.error(err);
      toast.error("To'lovlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const deletePayment = async (id) => {
    if (!window.confirm("Haqiqatdan ham ushbu to'lovni o'chirmoqchimisiz?"))
      return;
    try {
      await api.delete(`/api/payment/${id}`);
      toast.success("To'lov o'chirildi");
      fetchPayments();
    } catch (err) {
      toast.error("O'chirishda xatolik");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, total, loading, stats, fetchPayments, deletePayment };
}
