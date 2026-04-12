import React, { useState, useEffect } from 'react';
import { BookOpen, Users, CalendarDays, Loader2, UserCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const { data } = await api.get('/api/group/my-groups');
        setGroups(data.data || []);
      } catch (error) {
        toast.error("Guruhlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchMyGroups();
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p) + ' so\'m';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-groups-page">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', marginBottom: '0.4rem' }}>Guruhlarim 📚</h1>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Siz a'zo bo'lgan va ta'lim olayotgan barcha guruhlar ro'yxati</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spin" size={32} color="var(--primary)" />
        </div>
      ) : groups.length === 0 ? (
        <div className="content-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookOpen size={48} style={{ color: '#334155', marginBottom: '1rem', opacity: 0.5, margin: '0 auto' }} />
          <h3 style={{ color: '#94a3b8', fontWeight: 700, fontSize: '1.2rem' }}>Siz hozircha hech qaysi guruhga a'zo emassiz</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Administratorga murojaat qiling</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {groups.map((g, idx) => (
            <motion.div 
              key={g.id} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: idx * 0.1 }}
              className="content-card group-card"
              style={{ position: 'relative', overflow: 'hidden', padding: '1.75rem', cursor: 'pointer' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-gradient)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f1f5f9', marginBottom: '0.3rem' }}>{g.name}</h3>
                  <span style={{ 
                    display: 'inline-block', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', 
                    fontSize: '0.7rem', fontWeight: 800, background: 'rgba(99,102,241,0.1)', color: 'var(--primary)',
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {g.courseType}
                  </span>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <BookOpen size={20} color="var(--secondary)" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                  <UserCircle size={16} color="#64748b" />
                  Ustozi: <span style={{ color: '#e2e8f0' }}>{g.teacher?.name || "Biriktirilmagan"}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                  <CalendarDays size={16} color="#64748b" />
                  Kunlar: <span style={{ color: '#e2e8f0' }}>{g.days || "Belgilanmagan"}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Narxi</div>
                    <div style={{ color: '#10b981', fontWeight: 800 }}>{formatPrice(g.price)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Sinfdoshlar</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f1f5f9', fontWeight: 800 }}>
                      <Users size={14} color="var(--primary)" /> {g._count?.students || 0} nafar
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .group-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.3); }
        .group-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </motion.div>
  );
}
