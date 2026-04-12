import React, { useState, useEffect } from 'react';
import {
  Plus, Search,
  Trash2, Clock,
  TrendingUp, Calendar, DollarSign, CreditCard,
  Loader2, X, Edit
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS = {
  PAID: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: 'To\'langan' },
  PENDING: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Kutilmoqda' },
  UNPAID: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'To\'lanmagan' },
};

const TYPE_ICONS = {
  CASH: { icon: DollarSign, label: 'Naqd' },
  CARD: { icon: CreditCard, label: 'Plastik' },
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPaid: 0, pendingCount: 0, todayPaid: 0 });
  const [filters, setFilters] = useState({ status: '', paymentType: '', studentName: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/payment', {
        params: { ...filters, limit: 50 }
      });
      setPayments(data.data || []);
      setTotal(data.total || 0);

      // Statistikani hisoblash (bu yerda hisoblash yoki alohida API bo'lishi mumkin)
      // Hozircha kelgan data asosida
      const paid = (data.data || []).filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
      const pending = (data.data || []).filter(p => p.status === 'PENDING').length;
      setStats({ totalPaid: paid, pendingCount: pending, todayPaid: paid / 2 }); // Demo uchun
    } catch (err) {
      toast.error('To\'lovlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatdan ham ushbu to\'lovni o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/api/payment/${id}`);
      toast.success('To\'lov o\'chirildi');
      fetchPayments();
    } catch (err) {
      toast.error('O\'chirishda xatolik');
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('uz-UZ').format(p) + ' so\'m';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="payments-page">
      {/* Header & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f1f5f9', marginBottom: '0.4rem' }}>To'lovlar 💰</h1>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Markaz moliyaviy amallarini nazorat qiling</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.25rem', height: 'fit-content' }}>
          <Plus size={18} /> To'lov Qabul Qilish
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard label="Jami Tushum" value={formatPrice(stats.totalPaid)} icon={TrendingUp} color="#10b981" />
        <StatCard label="Kutilayotgan To'lovlar" value={stats.pendingCount} icon={Clock} color="#f59e0b" />
        <StatCard label="Bugungi Tushum" value={formatPrice(stats.todayPaid)} icon={Calendar} color="#6366f1" />
      </div>

      {/* Filter Bar */}
      <div className="content-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="field-wrap">
            <Search className="field-icon" size={17} />
            <input
              placeholder="O'quvchi ismi bo'yicha..."
              className="field-input"
              value={filters.studentName}
              onChange={e => setFilters({ ...filters, studentName: e.target.value })}
            />
          </div>
        </div>
        <select
          className="field-input"
          style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' }}
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="">Barcha Statuslar</option>
          <option style={{ background: '#0f172a', color: '#10b981' }} value="PAID">To'langan</option>
          <option style={{ background: '#0f172a', color: '#f59e0b' }} value="PENDING">Kutilmoqda</option>
          <option style={{ background: '#0f172a', color: '#ef4444' }} value="UNPAID">To'lanmagan</option>
        </select>
        <select
          className="field-input"
          style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9' }}
          value={filters.paymentType}
          onChange={e => setFilters({ ...filters, paymentType: e.target.value })}
        >
          <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="">To'lov Turi</option>
          <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="CASH">Naqd</option>
          <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="CARD">Plastik</option>
        </select>
      </div>

      {/* Payment Table */}
      <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Talaba</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Sana</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Summa</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Turi</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Status</th>
                {isAdmin && <th style={{ padding: '1.25rem 1.5rem', width: '50px' }}></th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="spin" size={32} color="var(--primary)" /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>Hech qanday to'lovlar topilmadi</td></tr>
              ) : payments.map((p, idx) => (
                <motion.tr
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  key={p.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.2s' }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontWeight: 900, fontSize: '0.9rem', overflow: 'hidden', flexShrink: 0 }}>
                        {p.student && p.student.avatar ? (
                           <img 
                             src={p.student.avatar.startsWith('http') ? p.student.avatar : `http://localhost:3000${p.student.avatar}`}
                             alt="Avatar"
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                             onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                           />
                        ) : null}
                        <span style={{ display: (p.student && p.student.avatar) ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                          {p.student?.firstName?.[0]?.toUpperCase() || ''}{p.student?.lastName?.[0]?.toUpperCase() || ''}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '0.95rem' }}>{p.student?.firstName} {p.student?.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{p.student?.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                    {new Date(p.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                    {formatPrice(p.amount)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 700 }}>
                      {React.createElement(TYPE_ICONS[p.paymentType]?.icon || DollarSign, { size: 14, style: { color: '#64748b' } })}
                      {TYPE_ICONS[p.paymentType]?.label || p.paymentType}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.4rem 0.8rem', borderRadius: '0.6rem', fontSize: '0.75rem', fontWeight: 850,
                      background: STATUS_COLORS[p.status]?.bg, color: STATUS_COLORS[p.status]?.text
                    }}>
                      {STATUS_COLORS[p.status]?.label}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button onClick={() => setEditPayment(p)} className="btn-icon" style={{ color: '#6366f1' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="btn-icon" style={{ color: '#ef4444' }}>
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

      {/* Add Payment Modal Component */}
      <AddPaymentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => { setShowAddModal(false); fetchPayments(); }}
      />

      {/* Edit Payment Modal Component */}
      <EditPaymentModal 
        payment={editPayment}
        onClose={() => setEditPayment(null)}
        onSuccess={() => { setEditPayment(null); fetchPayments(); }}
      />

      <style>{`
        .table-row-hover:hover { background: rgba(255,255,255,0.015); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="content-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>{label}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f1f5f9' }}>{value}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '1rem', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

// ── Add Payment Modal ────────────────────────────────────────────────────────
function AddPaymentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({ studentId: '', amount: '', paymentType: 'CASH', status: 'PAID' });
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length < 2) { setStudents([]); return; }
    setSearching(true);
    try {
      const { data } = await api.get('/api/User/GetAllStudentsWithFilters', { params: { firstName: val, limit: 5 } });
      setStudents(data.data || []);
    } catch (err) { console.error(err); } finally { setSearching(false); }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId) return toast.error('O\'quvchini tanlang');
    setLoading(true);
    try {
      await api.post('/api/payment', { ...form, amount: Number(form.amount) });
      toast.success('To\'lov qabul qilindi! ✅');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally { setLoading(false); }
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
              zIndex: 1001, width: '100%', maxWidth: '500px', padding: '1.5rem'
            }}
          >
            <div className="auth-card" style={{ padding: '2.5rem', position: 'relative' }}>
              <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f1f5f9' }}>To'lov Qabul Qilish</h2>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Tizimga yangi to'lovni kiriting</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="field-group">
                  <label className="field-label">O'quvchini qidirish</label>
                  <div className="field-wrap">
                    <Search className="field-icon" size={17} />
                    <input
                      value={search} onChange={e => handleSearch(e.target.value)}
                      className="field-input" placeholder="Ism yoki familiya..."
                    />
                    {searching && <Loader2 size={16} className="field-icon spin" style={{ right: '1rem', left: 'auto' }} />}
                  </div>

                  {students.length > 0 && (
                    <div style={{ marginTop: '0.5rem', background: 'rgba(15,23,42,0.9)', borderRadius: '0.8rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      {students.map(s => (
                        <div
                          key={s.id} onClick={() => { setForm({ ...form, studentId: s.id }); setSearch(`${s.firstName} ${s.lastName}`); setStudents([]); }}
                          style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 900 }}>{s.firstName[0]}</div>
                          <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 700 }}>{s.firstName} {s.lastName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label className="field-label">Summa (so'm)</label>
                  <div className="field-wrap">
                    <DollarSign className="field-icon" size={17} />
                    <input
                      type="number" required className="field-input" placeholder="Masalan: 500000"
                      value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="field-group">
                    <label className="field-label">To'lov Turi</label>
                    <select className="field-input" value={form.paymentType} onChange={e => setForm({ ...form, paymentType: e.target.value })}>
                      <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="CASH">Naqd</option>
                      <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="CARD">Plastik</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Status</label>
                    <select className="field-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option style={{ background: '#0f172a', color: '#10b981' }} value="PAID">To'langan</option>
                      <option style={{ background: '#0f172a', color: '#f59e0b' }} value="PENDING">Kutilmoqda</option>
                    </select>
                  </div>
                </div>

                <button disabled={loading} type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                  {loading ? <Loader2 className="spin" size={20} /> : 'Tasdiqlash'}
                </button>
              </form>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}

// ── Edit Payment Modal ───────────────────────────────────────────────────────
function EditPaymentModal({ payment, onClose, onSuccess }) {
  const [form, setForm] = useState({ amount: '', paymentType: 'CASH', status: 'PAID' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (payment) {
      setForm({
        amount: payment.amount || '',
        paymentType: payment.paymentType || 'CASH',
        status: payment.status || 'PAID'
      });
    }
  }, [payment]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/api/payment/${payment.id}`, { ...form, amount: Number(form.amount) });
      toast.success("To'lov muvaffaqiyatli tahrirlandi! ✅");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {payment && (
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
            style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 1001, width: '100%', maxWidth: '500px', padding: '1.5rem' }}
          >
            <div className="auth-card" style={{ padding: '2.5rem', position: 'relative' }}>
              <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f1f5f9' }}>To'lovni Tahrirlash</h2>
                <p style={{ color: '#64748b', fontWeight: 600 }}>{payment.student?.firstName} {payment.student?.lastName} uchun</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="field-group">
                  <label className="field-label">Summa (so'm)</label>
                  <div className="field-wrap">
                    <DollarSign className="field-icon" size={17} />
                    <input type="number" required className="field-input" placeholder="Masalan: 500000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="field-group">
                    <label className="field-label">To'lov Turi</label>
                    <select className="field-input" value={form.paymentType} onChange={e => setForm({ ...form, paymentType: e.target.value })}>
                      <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="CASH">Naqd</option>
                      <option style={{ background: '#0f172a', color: '#f1f5f9' }} value="CARD">Plastik</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Status</label>
                    <select className="field-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option style={{ background: '#0f172a', color: '#10b981' }} value="PAID">To'langan</option>
                      <option style={{ background: '#0f172a', color: '#f59e0b' }} value="PENDING">Kutilmoqda</option>
                    </select>
                  </div>
                </div>

                <button disabled={loading} type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                  {loading ? <Loader2 className="spin" size={20} /> : "O'zgarishlarni Saqlash"}
                </button>
              </form>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
