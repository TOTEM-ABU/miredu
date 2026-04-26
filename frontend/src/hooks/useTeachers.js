import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export function useTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/User/teachers");
      // Adjust if API returns an object or array
      setTeachers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Teachers fetch error:", err);
      toast.error("O'qituvchilarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return { teachers, loading, fetchTeachers };
}
