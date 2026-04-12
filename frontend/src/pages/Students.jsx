import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Trash2, 
  Loader2, Mail, Phone, Lock, X, Edit
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ firstName: '', phoneNumber: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/User/GetAllStudentsWithFilters', {
        params: { ...filters, limit: 50, sortOrder: 'desc' }
      });
      setStudents(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error("Talabalarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Haqiqatdan ham ${name} ismli o'quvchini tizimdan o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!`)) return;
    try {
      await api.delete(`/api/User/STUDENT/${id}`);
      toast.success('Talaba muvaffaqiyatli o\'chirildi');
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="students-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', marginBottom: '0.4rem' }}>Talabalar ({total})</h1>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Markazdagi barcha mavjud talabalar ro'yxati</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.25rem', height: 'fit-content' }}>
            <Plus size={18} /> Yangi Talaba
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="content-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div className="field-wrap">
            <Search className="field-icon" size={17} />
            <input 
              placeholder="Ism bo'yicha qidiruv..." 
              className="field-input" 
              value={filters.firstName}
              onChange={e => setFilters({...filters, firstName: e.target.value})}
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div className="field-wrap">
            <Phone className="field-icon" size={17} />
            <input 
              placeholder="Telefon raqami..." 
              className="field-input" 
              value={filters.phoneNumber}
              onChange={e => setFilters({...filters, phoneNumber: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Talaba (F.I.SH)</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Aloqa (Email / Raqam)</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Ota-onasi (Raqam)</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Ro'yxatdan o'tgan</th>
                {isAdmin && <th style={{ padding: '1.25rem 1.5rem', width: '50px' }}></th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="spin" size={32} color="var(--primary)" /></td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>Hech qanday talabalar topilmadi</td></tr>
              ) : students.map((s, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  key={s.id} 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.2s' }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontWeight: 900, fontSize: '1rem', overflow: 'hidden', flexShrink: 0 }}>
                        {s.avatar ? (
                           <img 
                             src={s.avatar.startsWith('http') ? s.avatar : `http://localhost:3000${s.avatar}`}
                             alt="Avatar"
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                             onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                           />
                        ) : null}
                        <span style={{ display: s.avatar ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                          {s.firstName?.[0]?.toUpperCase() || ''}{s.lastName?.[0]?.toUpperCase() || ''}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '1rem' }}>{s.firstName} {s.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>{s.phoneNumber}</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>{s.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 700 }}>
                      {s.parentsPhoneNumber || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                    {new Date(s.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button className="btn-icon" style={{ color: '#6366f1' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(s.id, s.firstName)} className="btn-icon" style={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddStudentModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={() => { setShowAddModal(false); fetchStudents(); }}
      />
      
      <style>{`
        .table-row-hover:hover { background: rgba(255,255,255,0.015); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}

// ── Add Student Modal ────────────────────────────────────────────────────────
function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', 
    phoneNumber: '', parentsPhoneNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/User/registerStudent', form);
      toast.success('Talaba muvaffaqiyatli saqlandi! ✅');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ro\'yxatdan o\'tkazishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              zIndex: 1001, width: '100%', maxWidth: '550px', padding: '1.5rem'
            }}
          >
            <div className="auth-card" style={{ padding: '2.5rem', position: 'relative' }}>
              <button 
                onClick={onClose} 
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f1f5f9' }}>Yangi Talaba Qo'shish</h2>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Tizimga o'quvchi ma'lumotlarini kiriting</p>
              </div>

              <form onSubmit={onSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label">Ism</label>
                    <div className="field-wrap">
                      <Users className="field-icon" size={17} />
                      <input required name="firstName" value={form.firstName} onChange={onChange} className="field-input" placeholder="Aziz" />
                    </div>
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label">Familiya</label>
                    <div className="field-wrap">
                      <Users className="field-icon" size={17} />
                      <input required name="lastName" value={form.lastName} onChange={onChange} className="field-input" placeholder="Azizov" />
                    </div>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Email manzil</label>
                  <div className="field-wrap">
                    <Mail className="field-icon" size={17} />
                    <input required type="email" name="email" value={form.email} onChange={onChange} className="field-input" placeholder="misol@mail.com" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label">Telefon raqam</label>
                    <div className="field-wrap">
                      <Phone className="field-icon" size={17} />
                      <input required name="phoneNumber" value={form.phoneNumber} onChange={onChange} className="field-input" placeholder="+998901234567" />
                    </div>
                  </div>
                  <div className="field-group" style={{ marginBottom: 0 }}>
                    <label className="field-label">Ota-onasi raqami</label>
                    <div className="field-wrap">
                      <Phone className="field-icon" size={17} />
                      <input required name="parentsPhoneNumber" value={form.parentsPhoneNumber} onChange={onChange} className="field-input" placeholder="+998901234567" />
                    </div>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Vaqtinchalik Parol</label>
                  <div className="field-wrap">
                    <Lock className="field-icon" size={17} />
                    <input required name="password" minLength={6} maxLength={8} value={form.password} onChange={onChange} className="field-input" placeholder="123456" />
                  </div>
                </div>

                <button disabled={loading} type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                  {loading ? <Loader2 className="spin" size={20} /> : 'Talabani Saqlash'}
                </button>
              </form>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
