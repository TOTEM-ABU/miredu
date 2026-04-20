import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, Clock, CheckCircle2, XCircle,
  ShieldCheck, ShieldAlert, BadgeInfo, Layers, Check, Search, CalendarDays, BookOpen
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/uz-latn';

dayjs.locale('uz-latn');

export default function MyAttendances() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      if (!user.id) throw new Error("Foydalanuvchi topilmadi");
      // Fetch up to 200 records to show good stats over time
      const { data } = await api.get(`/api/attendance/student/${user.id}?limit=200`);
      setAttendances(data.data || []);
    } catch (error) {
      console.error('Fetch attendances error:', error);
      toast.error('Davomat ma\'lumotlarini yuklashda xatolik yuz berdi');
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const groupsList = Array.from(new Set(attendances.map(a => a.group?.name)))
    .filter(Boolean)
    .sort();

  const filteredData = selectedGroup === 'ALL'
    ? attendances
    : attendances.filter(a => a.group?.name === selectedGroup);

  const total = filteredData.length;
  const presentCount = filteredData.filter(a => a.status === 'PRESENT').length;
  const absentCount = filteredData.filter(a => a.status === 'ABSENT').length;
  const lateCount = filteredData.filter(a => a.status === 'LATE').length;

  const ratePercentage = total > 0
    ? Math.round(((presentCount + (lateCount * 0.5)) / total) * 100)
    : 0;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ratePercentage / 100) * circumference;

  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } } };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PRESENT': return { label: 'Keldi', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle2 };
      case 'ABSENT': return { label: 'O\'tkazib yubordi', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle };
      case 'LATE': return { label: 'Kechikdi', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock };
      default: return { label: 'Noma\'lum', color: '#94a3b8', bg: 'rgba(255,255,255,0.1)', icon: BadgeInfo };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="attendances-page"
      style={{ paddingBottom: '4rem', minHeight: '100%' }}
    >
      <div style={{ marginBottom: '3rem' }}>
        <motion.h1
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          style={{ fontSize: '2.5rem', fontWeight: 950, color: '#f8fafc', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}
        >
          <span className="title-gradient">Davomat</span> Reytingi 🎯
        </motion.h1>
        <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '1.1rem' }}>
          O'quv intizomingiz va yo'qlamalar tarixi
        </p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="skeleton-card" style={{ height: '300px', marginBottom: '2rem' }}><div className="skeleton-shine" /></div>
            <div className="skeleton-card" style={{ height: '500px' }}><div className="skeleton-shine" /></div>
          </motion.div>
        ) : attendances.length === 0 ? (
          <motion.div
            key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="content-card"
            style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.015)' }}
          >
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(99,102,241,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <CalendarCheck size={48} color="#6366f1" opacity={0.5} />
            </div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>Sizda davomat tarixi yo'q</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>Siz hali darslarga qatnashishni boshlamagansiz.</p>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Top Dashboard Setup */}
            <div className="attendance-grid top-grid">
              {/* Circular Progress Card */}
              <div className="content-card stat-hero-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem' }}>
                <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
                    <motion.circle
                      cx="90" cy="90" r={radius} fill="none"
                      stroke={ratePercentage > 85 ? '#10b981' : ratePercentage > 60 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="18"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ strokeLinecap: 'round', dropShadow: `0 0 10px ${ratePercentage > 85 ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}` }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 900, color: '#f8fafc', lineHeight: '1', letterSpacing: '-0.05em' }}>
                      {ratePercentage}%
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
                      Reyting
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {ratePercentage > 85 ? <ShieldCheck size={18} color="#10b981" /> : <ShieldAlert size={18} color="#f59e0b" />}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
                    {ratePercentage > 85 ? 'Juda yaxshi intizom, barakalla!' : ratePercentage > 60 ? 'Muntazamlikni oshiring' : 'Davomat holati yomon'}
                  </span>
                </div>
              </div>

              {/* Stats Counters Card */}
              <div className="content-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.5rem', letterSpacing: '0.02em' }}>Batafsil ko'rsatkichlar</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.25rem' }}>
                  {/* Present Card */}
                  <div style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', padding: '1.25rem', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>{presentCount}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kelgan</div>
                  </div>

                  {/* Late Card */}
                  <div style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)', padding: '1.25rem', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
                        <Clock size={18} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>{lateCount}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kechikib kelgan</div>
                  </div>

                  {/* Absent Card */}
                  <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)', padding: '1.25rem', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
                        <XCircle size={18} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>{absentCount}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sababsiz yo'q</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area: Tabs + Timeline */}
            <div className="content-card" style={{ marginTop: '2.5rem', padding: '2rem' }}>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Timeline History section - Takes mostly left */}
                <div style={{ flex: '1 1 500px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f1f5f9', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CalendarDays size={24} color="#818cf8" /> Davomat Tarixi
                  </h3>

                  {filteredData.length === 0 ? (
                    <div style={{ padding: '3rem 0', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '1rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 600 }}>Ushbu filtr bo'yicha tarix topilmadi.</div>
                    </div>
                  ) : (
                    <motion.div variants={containerVars} initial="hidden" animate="show" className="timeline-container">
                      {filteredData.map((record, index) => {
                        const info = getStatusInfo(record.status);
                        const Icon = info.icon;

                        return (
                          <motion.div key={record.id} variants={itemVars} className="timeline-item">
                            <div className="timeline-connector" />
                            <div className="timeline-marker" style={{ background: info.color, boxShadow: `0 0 10px ${info.color}80` }}>
                              <Icon size={14} color="#fff" strokeWidth={3} />
                            </div>

                            <div className="timeline-content">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.3rem' }}>
                                    {dayjs(record.date).format('DD MMMM, YYYY')}
                                  </div>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                                    {dayjs(record.date).format('dddd')} kuni
                                  </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                  <div style={{
                                    padding: '0.3rem 0.8rem', borderRadius: '1rem', background: info.bg,
                                    color: info.color, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
                                    border: `1px solid ${info.color}20`
                                  }}>
                                    {info.label}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '0.5rem' }}>
                                    {record.group?.name || 'Noma\'lum guruh'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {/* Right Filter Sidebar */}
                <div style={{ width: '100%', maxWidth: '280px', flexShrink: 0 }}>
                  <div style={{ position: 'sticky', top: '2rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                      Filtrlash
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        onClick={() => setSelectedGroup('ALL')}
                        className={`filter-tab ${selectedGroup === 'ALL' ? 'active' : ''}`}
                      >
                        <Layers size={18} /> Barcha Guruhlar
                        {selectedGroup === 'ALL' && <Check size={16} style={{ marginLeft: 'auto' }} />}
                      </button>

                      {groupsList.map(g => (
                        <button
                          key={g}
                          onClick={() => setSelectedGroup(g)}
                          className={`filter-tab ${selectedGroup === g ? 'active' : ''}`}
                        >
                          <BookOpen size={18} /> {g}
                          {selectedGroup === g && <Check size={16} style={{ marginLeft: 'auto' }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .attendance-grid {
          display: grid;
          gap: 2rem;
        }
        .top-grid {
          grid-template-columns: 350px 1fr;
        }
        @media (max-width: 900px) {
          .top-grid { grid-template-columns: 1fr; }
        }

        .title-gradient { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .skeleton-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 1.5rem; position: relative; overflow: hidden; }
        .skeleton-shine {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          animation: shine 1.5s infinite;
        }
        @keyframes shine { to { left: 200%; } }

        .stat-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem;
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 1rem;
          transition: all 0.3s;
        }
        .stat-row:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); transform: translateX(5px); }
        .stat-icon-wrap {
          width: 50px; height: 50px; border-radius: 1rem; 
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .filter-tab {
          display: flex; alignItems: center; gap: 0.75rem; 
          width: 100%; text-align: left;
          padding: 1rem; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.03); border-radius: 1rem;
          color: #94a3b8; font-weight: 700; font-size: 0.95rem; font-family: inherit;
          cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .filter-tab:hover { background: rgba(255,255,255,0.04); color: #f1f5f9; }
        .filter-tab.active {
          background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #818cf8;
          box-shadow: 0 4px 15px rgba(99,102,241,0.1);
        }

        .timeline-container {
          position: relative;
          padding-left: 2rem;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
        }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-connector {
          position: absolute; left: -2rem; top: 30px; bottom: -30px; width: 2px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
        }
        .timeline-item:last-child .timeline-connector { display: none; }
        .timeline-marker {
          position: absolute; left: -2rem; top: 0; width: 24px; height: 24px; borderRadius: 50%;
          transform: translateX(-48%); z-index: 2;
          display: flex; align-items: center; justify-content: center;
        }
        .timeline-content {
          background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04);
          padding: 1.5rem; border-radius: 1.25rem; transition: all 0.3s;
        }
        .timeline-content:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); transform: translateX(5px); }
      `}</style>
    </motion.div>
  );
}
