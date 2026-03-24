import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion } from 'framer-motion';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      toast.error('Gumonli hodisa! Ro\'yxatdan o\'ting.');
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error('Iltimos, 6 ta raqamni ham kiriting');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/user/verify-otp', { email, otp: otpCode });
      toast.success('Email tasdiqlandi! ✅');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Noto\'g\'ri kod!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full"
    >
      <div className="card-premium text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-indigo-500/10 mb-8 border border-indigo-500/20">
          <ShieldCheck className="w-12 h-12 text-indigo-400" />
        </div>

        <h1 className="text-3xl font-bold title-gradient mb-4">Kod Tasdiqlash</h1>
        <div className="flex items-center justify-center gap-2 text-muted mb-10">
          <Mail className="w-4 h-4" />
          <span className="text-xs font-semibold">{email}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-10">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={digit}
                className="w-12 h-16 text-center text-2xl font-extrabold rounded-2xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)] outline-none transition-all text-white"
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-glow w-full mb-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tasdiqlash'}
          </button>
        </form>

        <button
          onClick={() => api.post('/api/user/resend-otp', { email })}
          className="flex items-center justify-center gap-2 mx-auto text-muted hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-widest outline-none"
        >
          <RefreshCw className="w-3 h-3" /> Kodni qayta yuborish
        </button>
      </div>
    </motion.div>
  );
};

export default VerifyOtp;
