import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export function useMyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyGroups = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/group/my-groups");
      setGroups(data.data || []);
    } catch (error) {
      console.error("Fetch groups error:", error);
      toast.error("Guruhlarni yuklashda xatolik yuz berdi");
    } finally {
      setTimeout(() => setLoading(false), 600); // UI feel
    }
  }, []);

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  return { groups, loading, fetchMyGroups };
}
