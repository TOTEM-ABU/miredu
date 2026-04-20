import React, { useState, useEffect } from 'react';
import {
  Plus, Search, MoreVertical, Loader2, Users, BookOpen,
  DollarSign, Mail, Lock, Phone, Camera, X, Edit, Trash2,
  ChevronRight, Filter, Info, UserPlus
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const COURSE_TYPES = ['English', 'Math'];

const KEYFRAMES = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
`;

export default function Groups() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN' || user.role === 'TEACHER';

  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningGroup, setAssigningGroup] = useState(null);

  const fetchGroups = async () => {
    try {
      const { data } = await api.get('/api/group/GetAllGroupsWithFilters', {
        params: { limit: 100 }
      });
      setGroups(data.data || []);
    } catch (err) {
      toast.error('Guruhlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get('/api/User/GetAllTeachersWithFilters', { params: { limit: 100 } });
      console.log('Fetched Teachers Data:', data);
      const list = data.data || [];
      setTeachers(list);
      if (list.length > 0) {
        console.log(`Successfully loaded ${list.length} teachers.`);
      }
    } catch (err) {
      console.error('Teachers fetch error:', err);
      toast.error('O\'qituvchilar ro\'yxatini olishda xatolik: ' + err.message);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatan ham ushbu guruhni o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/api/group/${id}`);
      toast.success('Guruh o\'chirildi');
      fetchGroups();
    } catch (err) {
      toast.error('O\'chirishda xatolik');
    }
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = typeFilter === 'All' || g.courseType === typeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>{KEYFRAMES}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Guruhlar <span style={{ color: 'var(--primary)' }}>Hubi</span> 📚
          </h1>
          <p style={{ color: '#64748b', fontWeight: 600 }}>O'quv markazidagi barcha faol va yangi guruhlar</p>
        </div>

        {isAdmin && (
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '0.8rem 1.75rem', gap: '0.6rem', borderRadius: '1rem' }}
            onClick={() => { setEditingGroup(null); setIsModalOpen(true); }}
          >
            <Plus size={20} strokeWidth={3} /> Yangi Guruh
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center',
        background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '1.25rem',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div className="search-wrap" style={{ flex: 1, minWidth: '200px' }}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Guruh nomi bo'yicha qidiruv..."
            className="search-input"
            style={{ width: '100%', background: 'transparent' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: '0.85rem' }}>
          {['All', ...COURSE_TYPES].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '0.6rem', border: 'none',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                background: typeFilter === type ? 'var(--primary)' : 'transparent',
                color: typeFilter === type ? '#fff' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              {type === 'All' ? 'Barchasi' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <Loader2 size={40} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div style={{
            height: '400px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#475569'
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '2rem',
              background: 'rgba(255,255,255,0.03)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
            }}>
              <BookOpen size={40} opacity={0.3} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#94a3b8' }}>Guruhlar topilmadi</h3>
            <p style={{ fontWeight: 600 }}>Qidiruv shartlarini o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', paddingBottom: '2rem' }}>
            {filteredGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                isAdmin={isAdmin}
                onEdit={() => { setEditingGroup(group); setIsModalOpen(true); }}
                onDelete={() => handleDelete(group.id)}
                onAssign={() => { setAssigningGroup(group); setIsAssignModalOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { fetchGroups(); setIsModalOpen(false); }}
        editingGroup={editingGroup}
        teachers={teachers}
      />

      <AssignStudentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => { fetchGroups(); setIsAssignModalOpen(false); }}
        group={assigningGroup}
      />
    </motion.div>
  );
}

// ── Card Component ─────────────────────────────────────────────────────────
function GroupCard({ group, isAdmin, onEdit, onDelete, onAssign }) {
  return (
    <motion.div
      layout
      className="content-card"
      style={{ padding: '1.5rem', position: 'relative', overflow: 'visible' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{
          padding: '0.4rem 0.8rem', borderRadius: '0.6rem',
          background: group.courseType === 'English' ? 'rgba(99,102,241,0.1)' : 'rgba(34,211,238,0.1)',
          color: group.courseType === 'English' ? '#818cf8' : '#22d3ee',
          fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {group.courseType}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(isAdmin || group.teacherId === JSON.parse(localStorage.getItem('user'))?.id) && (
            <button
              onClick={onAssign}
              title="O'quvchi qo'shish"
              style={{ background: 'rgba(52,211,153,0.08)', border: 'none', color: '#34d399', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <UserPlus size={16} />
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={onEdit}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={onDelete}
                style={{ background: 'rgba(239,68,68,0.08)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem', color: '#f1f5f9' }}>{group.name}</h3>
      <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginBottom: '1.5rem', lineHeight: '1.5' }}>
        {group.description || 'Ushbu guruh uchun tavsif mavjud emas.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.85rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Narxi</div>
          <div style={{ color: '#34d399', fontWeight: 900, fontSize: '1rem' }}>{group.price.toLocaleString()} so'm</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.85rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>O'quvchilar</div>
          <div style={{ color: '#f1f5f9', fontWeight: 900, fontSize: '1rem' }}>{group._count?.students || 0} ta</div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
          border: '2px solid rgba(99,102,241,0.3)',
          background: 'rgba(99,102,241,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          {group.teacher?.avatar ? (
            <img
              src={group.teacher.avatar.startsWith('http') ? group.teacher.avatar : `http://localhost:3000${group.teacher.avatar}`}
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
            display: group.teacher?.avatar ? 'none' : 'flex',
            width: '100%', height: '100%',
            alignItems: 'center', justifyContent: 'center',
            color: '#818cf8', fontSize: '0.85rem', fontWeight: 900,
            textTransform: 'uppercase'
          }}>
            {group.teacher?.name ? group.teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
          </div>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {group.teacher?.name || 'Biriktirilmagan'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>O'qituvchi</div>
        </div>
        <ChevronRight size={18} style={{ marginLeft: 'auto', color: '#334155', flexShrink: 0 }} />
      </div>
    </motion.div>
  );
}

// ── Assign Student Modal ───────────────────────────────────────────────────
function AssignStudentModal({ isOpen, onClose, onSuccess, group }) {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setStudents([]);
    }
  }, [isOpen]);

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length < 2) {
      setStudents([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await api.get('/api/User/GetAllStudentsWithFilters', {
        params: { firstName: val, limit: 5 }
      });
      setStudents(data.data || []);
    } catch (err) {
      console.error('Student search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async (studentId) => {
    if (!group) return;

    setLoading(true);

    try {
      await api.patch('/api/group/addStudentToGroup', {
        studentId,
        groupId: group.id
      });

      toast.success('O\'quvchi guruhga biriktirildi! ✅');
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Xatolik yuz berdi';
      toast.error(`Xatolik: ${msg}`);
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
              zIndex: 1001, width: '100%', maxWidth: '450px', padding: '1.5rem'
            }}
          >
            <div className="auth-card" style={{ padding: '2rem', position: 'relative' }}>
              <button
                onClick={onClose}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f1f5f9' }}>O'quvchi Qo'shish</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                  Guruh: <span style={{ color: 'var(--primary)' }}>{group?.name}</span>
                </p>
              </div>

              <div className="field-group" style={{ marginBottom: '1.5rem' }}>
                <label className="field-label">O'quvchini qidirish</label>
                <div className="field-wrap">
                  <Search className="field-icon" size={17} />
                  <input
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    className="field-input"
                    placeholder="Ism yoki familiya..."
                    autoFocus
                  />
                  {searching && <Loader2 size={16} className="field-icon" style={{ right: '1rem', left: 'auto', animation: 'spin 1s linear infinite' }} />}
                </div>
              </div>

              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {students.length > 0 ? (
                  students.map(student => (
                    <div
                      key={student.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '0.75rem', borderRadius: '0.85rem',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#818cf8', fontWeight: 800 }}>{student.firstName[0]}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9' }}>{student.firstName} {student.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{student.phoneNumber}</div>
                      </div>
                      <button
                        onClick={() => handleAssign(student.id)}
                        disabled={loading}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: '0.6rem', border: 'none',
                          background: 'var(--primary)', color: '#fff', fontSize: '0.75rem',
                          fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        Qo'shish
                      </button>
                    </div>
                  ))
                ) : search.length >= 2 && !searching ? (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '1rem', fontWeight: 600 }}>O'quvchi topilmadi</div>
                ) : search.length < 2 ? (
                  <div style={{ textAlign: 'center', color: '#475569', padding: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>Kamida 2 ta harf kiriting...</div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}

// ── Modal Component ────────────────────────────────────────────────────────
function GroupModal({ isOpen, onClose, onSuccess, editingGroup, teachers }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', courseType: 'English', price: '', description: '', teacherId: '', days: '1,3,5'
  });

  useEffect(() => {
    if (editingGroup) {
      setForm({
        name: editingGroup.name,
        courseType: editingGroup.courseType,
        price: editingGroup.price.toString(),
        description: editingGroup.description || '',
        teacherId: editingGroup.teacherId || '',
        days: editingGroup.days || '1,3,5'
      });
    } else {
      setForm({ name: '', courseType: 'English', price: '', description: '', teacherId: '', days: '1,3,5' });
    }
  }, [editingGroup, isOpen]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        teacherId: form.teacherId || undefined
      };
      if (editingGroup) {
        await api.patch(`/api/group/${editingGroup.id}`, payload);
        toast.success('Guruh yangilandi! ✅');
      } else {
        await api.post('/api/group', payload);
        toast.success('Yangi guruh yaratildi! ✅');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
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
              zIndex: 1001, width: '100%', maxWidth: '500px', padding: '1.5rem'
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
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f1f5f9' }}>
                  {editingGroup ? 'Guruhni Tahrirlash' : 'Yangi Guruh'}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Barcha maydonlarni to'ldiring</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="field-group">
                  <label className="field-label">Guruh Nomi</label>
                  <div className="field-wrap">
                    <BookOpen className="field-icon" size={17} />
                    <input name="name" value={form.name} onChange={onChange} required className="field-input" placeholder="Masalan: IELTS Morning 1" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="field-group">
                    <label className="field-label">Kurs Turi</label>
                    <div className="field-wrap">
                      <Filter className="field-icon" size={17} />
                      <select name="courseType" value={form.courseType} onChange={onChange} className="field-input" style={{ appearance: 'none' }}>
                        {COURSE_TYPES.map(t => <option key={t} value={t} style={{ background: '#0f172a' }}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Narxi (so'm)</label>
                    <div className="field-wrap">
                      <DollarSign className="field-icon" size={17} />
                      <input name="price" value={form.price} onChange={onChange} type="number" required className="field-input" placeholder="550000" />
                    </div>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">O'qituvchi</label>
                  <div className="field-wrap">
                    <Users className="field-icon" size={17} />
                    <select name="teacherId" value={form.teacherId} onChange={onChange} required className="field-input" style={{ appearance: 'none' }}>
                      <option value="" style={{ background: '#0f172a' }}>O'qituvchini tanlang</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id} style={{ background: '#0f172a' }}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Day Selector */}
                <div className="field-group">
                  <label className="field-label">Dars Kunlari</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                      { id: '1', label: 'Du' }, { id: '2', label: 'Se' },
                      { id: '3', label: 'Chor' }, { id: '4', label: 'Pay' },
                      { id: '5', label: 'Ju' }, { id: '6', label: 'Sha' },
                      { id: '0', label: 'Yak' }
                    ].map(day => {
                      const isActive = form.days.split(',').includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => {
                            const current = form.days ? form.days.split(',') : [];
                            const next = isActive ? current.filter(d => d !== day.id) : [...current, day.id];
                            setForm({ ...form, days: next.sort().join(',') });
                          }}
                          style={{
                            padding: '0.5rem 0.8rem', borderRadius: '0.6rem', border: '1px solid',
                            background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                            color: isActive ? '#fff' : '#64748b',
                            borderColor: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                            fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="field-group" style={{ marginBottom: '2rem' }}>
                  <label className="field-label">Tavsif (Optional)</label>
                  <div className="field-wrap">
                    <Info className="field-icon" size={17} style={{ top: '1rem', transform: 'none' }} />
                    <textarea
                      name="description" value={form.description} onChange={onChange}
                      className="field-input" placeholder="Guruh haqida qisqacha ma'lumot..."
                      style={{ height: '80px', paddingTop: '0.8rem', resize: 'none' }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ borderRadius: '1rem' }}>
                  {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : (editingGroup ? 'Saqlash' : 'Yaratish')}
                </button>
              </form>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
