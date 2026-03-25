import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion } from 'framer-motion';

/* ── Phone formatter ────────────────────────────────────────────────────── */
// Formats raw digits to: +998 XX XXX XX XX  (max 9 digits after 998)
function formatUzPhone(raw) {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, '');
  // Always start with 998
  const local = digits.startsWith('998') ? digits.slice(3) : digits;
  const d = local.slice(0, 9); // max 9 local digits

  let out = '+998';
  if (d.length > 0) out += ' ' + d.slice(0, 2);
  if (d.length > 2) out += ' ' + d.slice(2, 5);
  if (d.length > 5) out += ' ' + d.slice(5, 7);
  if (d.length > 7) out += ' ' + d.slice(7, 9);
  return out;
}

/* ── Default avatar ─────────────────────────────────────────────────────── */
const DEFAULT_AVATAR = null; // null = show camera icon (no placeholder image)

const KEYFRAMES = `
  @keyframes spin       { to { transform: rotate(360deg); } }
  @keyframes ringRotate { to { transform: rotate(360deg); } }
  @keyframes popIn {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.3); }
    100% { transform: scale(1);   opacity: 1; }
  }
`;

export default function Register() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [loading,    setLoading]    = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [preview,    setPreview]    = useState(null);   // object URL for instant preview
  const [avatarUrl,  setAvatarUrl]  = useState('');      // real server URL after upload

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phoneNumber: '+998', parentsPhoneNumber: '+998',
  });

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* Phone input handler */
  const onPhoneChange = (field, e) => {
    const formatted = formatUzPhone(e.target.value);
    setForm(f => ({ ...f, [field]: formatted }));
  };

  /* Avatar file handler */
  const onFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant local preview
    const local = URL.createObjectURL(file);
    setPreview(local);
    setIsUploaded(false);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/api/file', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatarUrl(data.url);
      setIsUploaded(true);
      toast.success('Avatar yuklandi! ✓');
    } catch {
      toast.error('Rasmni yuklashda xatolik');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/User/registerStudent', {
        ...form,
        // Strip spaces so backend gets +998901234567 format
        phoneNumber: form.phoneNumber.replace(/\s/g, ''),
        parentsPhoneNumber: form.parentsPhoneNumber.replace(/\s/g, ''),
        avatar: avatarUrl || undefined,
      });
      toast.success("Ro'yxatdan o'tdingiz! Kodni kiriting.");
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  /* Derived avatar ring style */
  const ringBg   = uploading  ? 'conic-gradient(#6366f1 0% 70%, rgba(255,255,255,0.07) 70%)'
                 : isUploaded ? '#34d399'
                              : 'linear-gradient(135deg, #6366f1, #22d3ee)';
  const ringGlow = uploading  ? '0 0 28px rgba(99,102,241,0.5)'
                 : isUploaded ? '0 0 28px rgba(52,211,153,0.5)'
                              : '0 0 16px rgba(99,102,241,0.25)';

  return (
    <div className="auth-page" style={{ overflowY: 'auto', alignItems: 'flex-start', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <style>{KEYFRAMES}</style>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}
      >
        <div className="auth-card">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.4rem' }}>
              <span className="title-gradient">MirEdu</span> Registration
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
              O'quv jarayonini biz bilan boshlang
            </p>
          </div>

          {/* ── Avatar Ring ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>

            {/* Ring wrapper */}
            <div
              onClick={() => fileRef.current?.click()}
              title="Rasm yuklash"
              style={{
                position: 'relative',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: ringBg,
                boxShadow: ringGlow,
                cursor: 'pointer',
                animation: uploading ? 'ringRotate 1.2s linear infinite' : 'none',
                transition: 'box-shadow 0.4s',
                flexShrink: 0,
              }}
            >
              {/* Inner circle — clips the photo */}
              <div style={{
                position: 'absolute',
                top: 4, left: 4, right: 4, bottom: 4,
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {preview ? (
                  /* Photo preview */
                  <img
                    src={preview}
                    alt="avatar preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: uploading ? 'brightness(0.4)' : 'brightness(1)',
                      transition: 'filter 0.3s',
                    }}
                  />
                ) : (
                  /* Default — camera icon */
                  <Camera size={34} color="#334155" />
                )}

                {/* Spinner overlay while uploading */}
                {uploading && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.45)', borderRadius: '50%',
                  }}>
                    <Loader2 size={28} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>

              {/* Success checkmark badge */}
              {isUploaded && !uploading && (
                <div style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#34d399', border: '3px solid #030712',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 900, color: '#fff',
                  animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
                }}>✓</div>
              )}
            </div>

            <span style={{
              fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', marginTop: '0.75rem', transition: 'color 0.3s',
              color: uploading ? '#6366f1' : isUploaded ? '#34d399' : '#475569',
            }}>
              {uploading ? 'Yuklanmoqda...' : isUploaded ? 'Avatar yuklandi ✓' : 'Rasm yuklash (ixtiyoriy)'}
            </span>

            <input type="file" ref={fileRef} accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
          </div>

          {/* ── Form ────────────────────────────────────────────────────── */}
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>

              <div className="field-group">
                <label className="field-label">Ism</label>
                <div className="field-wrap">
                  <User className="field-icon" size={17} />
                  <input name="firstName" type="text" required className="field-input" placeholder="Azizbek" onChange={onChange} />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Familiya</label>
                <div className="field-wrap">
                  <User className="field-icon" size={17} />
                  <input name="lastName" type="text" required className="field-input" placeholder="Abdullaev" onChange={onChange} />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <Mail className="field-icon" size={17} />
                  <input name="email" type="email" required className="field-input" placeholder="aziz@mail.com" onChange={onChange} />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Parol</label>
                <div className="field-wrap">
                  <Lock className="field-icon" size={17} />
                  <input name="password" type="password" required className="field-input" placeholder="••••••••" onChange={onChange} />
                </div>
              </div>

              {/* ── Uzbek phone inputs ─────────────────────────────────── */}
              <div className="field-group">
                <label className="field-label">Tel Raqam</label>
                <div className="field-wrap">
                  {/* Uzbek flag */}
                  <span style={{ position: 'absolute', left: '1rem', fontSize: '1.1rem', zIndex: 2 }}>🇺🇿</span>
                  <input
                    name="phoneNumber"
                    type="tel"
                    required
                    className="field-input"
                    style={{ paddingLeft: '3rem' }}
                    value={form.phoneNumber}
                    placeholder="+998 90 123 45 67"
                    onChange={e => onPhoneChange('phoneNumber', e)}
                    maxLength={17}
                  />
                </div>
              </div>

              <div className="field-group" style={{ marginBottom: '2rem' }}>
                <label className="field-label">Ota-ona Tel Raqami</label>
                <div className="field-wrap">
                  <span style={{ position: 'absolute', left: '1rem', fontSize: '1.1rem', zIndex: 2 }}>🇺🇿</span>
                  <input
                    name="parentsPhoneNumber"
                    type="tel"
                    required
                    className="field-input"
                    style={{ paddingLeft: '3rem' }}
                    value={form.parentsPhoneNumber}
                    placeholder="+998 90 123 45 67"
                    onChange={e => onPhoneChange('parentsPhoneNumber', e)}
                    maxLength={17}
                  />
                </div>
              </div>

            </div>

            <button type="submit" disabled={loading || uploading} className="btn-primary">
              {loading
                ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                : <><ArrowRight size={18} /> Hisob yaratish</>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: '#475569', fontWeight: 600 }}>
            Hisobingiz bormi?{' '}
            <Link to="/login" className="link-primary" style={{ marginLeft: '0.25rem' }}>Kirish</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
