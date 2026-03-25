import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion } from 'framer-motion';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (!email) { toast.error("Email topilmadi"); navigate('/register'); }
    else refs.current[0]?.focus();
  }, []);

  const onChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onSubmit = async e => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return toast.error('6 ta raqamni kiriting');
    setLoading(true);
    try {
      await api.post('/api/User/verify-otp', { email, otp: code });
      toast.success('Email tasdiqlandi! ✅');
      navigate('/login');
    } catch {
      toast.error("Noto'g'ri kod!");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      await api.post('/api/User/resend-otp', { email });
      toast.success('Kod qayta yuborildi!');
    } catch {
      toast.error('Xatolik yuz berdi');
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        style={{ width: '100%', maxWidth: '460px' }}
      >
        <div className="auth-card" style={{ textAlign: 'center' }}>
          {/* Icon */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', borderRadius: '1.5rem',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 0 30px rgba(99,102,241,0.15)',
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={34} color="var(--primary)" />
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Tasdiqlash Kodi
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem' }}>
            Pochtangizga yuborilgan 6 xonali kodni kiriting
          </p>

          {/* Email Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '2rem', padding: '0.5rem 1rem',
            marginBottom: '2.5rem'
          }}>
            <Mail size={14} color="var(--secondary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>{email}</span>
          </div>

          <form onSubmit={onSubmit}>
            {/* OTP Boxes */}
            <div className="otp-row" style={{ marginBottom: '2.5rem' }}>
              {otp.map((digit, i) => (
                <React.Fragment key={i}>
                  <input
                    ref={el => refs.current[i] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    className="otp-box"
                    onChange={e => onChange(i, e.target.value)}
                    onKeyDown={e => onKey(i, e)}
                  />
                  {i === 2 && <div className="otp-dash" />}
                </React.Fragment>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginBottom: '1.5rem' }}>
              {loading
                ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                : <><ShieldCheck size={18} /> Kodni Tasdiqlash</>
              }
            </button>
          </form>

          <button onClick={onResend} className="btn-ghost" style={{ margin: '0 auto' }}>
            <RefreshCw size={14} /> Kodni qayta yuborish
          </button>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
