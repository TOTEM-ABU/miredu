import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/group/GetAllGroupsWithFilters");
      // If data is array, set it; else if it's an object with data, set data.data
      setGroups(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Groups fetch error:", err);
      toast.error("Guruhlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGroup = async (id) => {
    if (!window.confirm("Haqiqatan ham ushbu guruhni o'chirmoqchimisiz?"))
      return false;
    try {
      await api.delete(`/api/group/${id}`);
      toast.success("Guruh o'chirildi");
      fetchGroups();
      return true;
    } catch (err) {
      toast.error("O'chirishda xatolik");
      return false;
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, fetchGroups, deleteGroup };
}
