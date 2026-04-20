import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, CalendarDays, Loader2, UserCircle,
  ChevronRight, Award, X, MapPin, Phone, Info, GraduationCap, DollarSign,
  Clock
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchMyGroups = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/group/my-groups');
      setGroups(data.data || []);
    } catch (error) {
      console.error('Fetch groups error:', error);
      toast.error("Guruhlarni yuklashda xatolik yuz berdi");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p) + ' so\'m';

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-groups-page"
      style={{ minHeight: '100%', position: 'relative' }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{ fontSize: '2.75rem', fontWeight: 950, color: '#f8fafc', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}
          >
            Mening <span className="title-gradient">Guruhlarim</span> 📚
          </motion.h1>
          <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '1.1rem' }}>
            O'quv jarayoningiz va faol kurslaringiz monitoringi
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1.5rem', borderRadius: '1.5rem',
            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1.25rem',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jami guruhlar</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#818cf8' }}>{groups.length} ta</div>
          </div>
          <div style={{
            width: '46px', height: '46px', borderRadius: '1rem',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: '0 8px 16px var(--primary-glow)'
          }}>
            <Award size={24} />
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}
          >
            {[1, 2, 3].map(i => (
              <div key={i} className="content-card skeleton-card" style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
                <div className="skeleton-shine" />
              </div>
            ))}
          </motion.div>
        ) : groups.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="content-card"
            style={{ textAlign: 'center', padding: '7rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}
          >
            <div style={{
              width: '120px', height: '120px', borderRadius: '3rem', background: 'rgba(99,102,241,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem',
              border: '1px solid rgba(99,102,241,0.1)'
            }}>
              <BookOpen size={56} style={{ color: '#6366f1', opacity: 0.4 }} />
            </div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 900, fontSize: '1.75rem', marginBottom: '1rem' }}>Siz hali hech qanday guruhga a'zo emassiz</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 600, maxWidth: '450px', lineHeight: '1.7' }}>
              Kurslarga yozilish yoki guruhga qo'shilish uchun o'quv markazimizning administratoriga murojaat qiling.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={containerVars} initial="hidden" animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}
          >
            {groups.map((g) => (
              <motion.div
                key={g.id}
                variants={itemVars}
                className="content-card group-card-premium"
                style={{ position: 'relative', overflow: 'hidden', padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}
              >
                {/* Category Badge & Top Right Accent */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.85rem', borderRadius: '2rem',
                    fontSize: '0.65rem', fontWeight: 900,
                    background: g.courseType === 'English' ? 'rgba(99,102,241,0.1)' : 'rgba(34,211,238,0.1)',
                    color: g.courseType === 'English' ? '#a5b4fc' : '#67e8f9',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    border: g.courseType === 'English' ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(34,211,238,0.2)'
                  }}>
                    <Award size={12} /> Categoriya: {g.courseType}
                  </span>

                  <div style={{ opacity: 0.3, transition: 'all 0.3s' }} className="top-corner-icon">
                    <BookOpen size={20} color={g.courseType === 'English' ? '#818cf8' : '#22d3ee'} />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#f8fafc', letterSpacing: '-0.02em', wordBreak: 'break-word', lineHeight: '1.2' }}>{g.name}</h3>
                </div>

                {/* Stacked Info Blocks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* Teacher Info Micro-layout */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div className="teacher-avatar-ring" style={{ width: '40px', height: '40px' }}>
                      {g.teacher?.avatar ? (
                        <img
                          src={g.teacher.avatar.startsWith('http') ? g.teacher.avatar : `http://localhost:3000${g.teacher.avatar}`}
                          alt="Teacher"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div style={{
                        width: '100%', height: '100%', display: g.teacher?.avatar ? 'none' : 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.03)', color: '#64748b', fontSize: '0.75rem', fontWeight: 900
                      }}>
                        {g.teacher?.name ? g.teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O'qituvchi</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e2e8f0' }}>{g.teacher?.name || "Biriktirilmagan"}</div>
                    </div>
                  </div>

                  {/* Days Info Micro-layout */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarDays size={18} color="#94a3b8" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dars Kunlari</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e2e8f0' }}>{g.days || "Belgilanmagan"}</div>
                    </div>
                  </div>
                </div>

                <div style={{ flexGrow: 1 }} /> {/* Spacer */}

                {/* Footer Stats & Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>O'quvchilar</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', color: '#f1f5f9', fontWeight: 900 }}>
                        <Users size={14} color="#64748b" /> {g._count?.students || 0}
                      </span>
                    </div>
                  </div>

                  <button
                    className="pro-details-btn"
                    onClick={() => setSelectedGroup(g)}
                  >
                    Tafsilotlar <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Modal for Course Details */}
      <AnimatePresence>
        {selectedGroup && (
          <React.Fragment>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGroup(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(3, 7, 18, 0.75)',
                backdropFilter: 'blur(16px)',
                zIndex: 9999
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, y: '-40%', x: '-50%' }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                zIndex: 10000,
                width: '100%', maxWidth: '550px',
                padding: '1.5rem', boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  background: '#0f172a',
                  borderRadius: '2rem',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.02) inset',
                  position: 'relative'
                }}
              >
                {/* Modal close button */}
                <button
                  onClick={() => setSelectedGroup(null)}
                  style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', color: '#94a3b8', cursor: 'pointer', zIndex: 10,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <X size={18} strokeWidth={3} />
                </button>

                {/* Cover graphic */}
                <div style={{
                  height: '140px',
                  background: selectedGroup.courseType === 'English' ? 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)' : 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(14,165,233,0.1) 100%)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <div style={{ position: 'absolute', bottom: '-20px', right: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
                    <GraduationCap size={140} color="#fff" />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '0 2rem 2.5rem 2rem', position: 'relative', marginTop: '-40px' }}>

                  {/* Badge & Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '1.5rem',
                      background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                      color: selectedGroup.courseType === 'English' ? '#818cf8' : '#22d3ee'
                    }}>
                      <BookOpen size={36} strokeWidth={2.5} />
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem', borderRadius: '0.5rem',
                        fontSize: '0.7rem', fontWeight: 800,
                        background: selectedGroup.courseType === 'English' ? '#4f46e5' : '#0284c7',
                        color: '#fff',
                        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem'
                      }}>
                        {selectedGroup.courseType}
                      </span>
                      <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.2' }}>{selectedGroup.name}</h2>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCircle size={20} color="#818cf8" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Ustoz</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9' }}>{selectedGroup.teacher?.name || 'Biriktirilmagan'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <DollarSign size={20} color="#34d399" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>To'lov</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#34d399' }}>{formatPrice(selectedGroup.price)}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Clock size={20} color="#fbbf24" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Kunlar</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fbbf24' }}>{selectedGroup.days || 'Kiritilmagan'}</div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Description Box */}
                  <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <Info size={16} color="#94a3b8" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Guruh haqida</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 500, margin: 0 }}>
                      {selectedGroup.description || "Ushbu kurs uslubiy jihatdan ilg'or va zamonaviy o'quv standartlariga javob beradi. Muntazam tarzda darslarda qatnashib borish tavsiya etiladi."}
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .title-gradient { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .group-card-premium { 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(12px);
          cursor: pointer;
        }
        .group-card-premium:hover { 
          transform: translateY(-8px); 
          border-color: rgba(255,255,255,0.15); 
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          background: rgba(255,255,255,0.03);
        }
        
        .group-card-premium:hover .top-corner-icon { opacity: 1 !important; transform: scale(1.1) rotate(5deg); }
        
        .pro-details-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f8fafc;
          padding: 0.6rem 1.15rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pro-details-btn:hover {
          background: #fff;
          color: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(255,255,255,0.5);
        }
        
        .skeleton-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 1.5rem; }
        .skeleton-shine {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          animation: shine 1.5s infinite;
        }
        @keyframes shine { to { left: 200%; } }
      `}</style>
    </motion.div>
  );
}
