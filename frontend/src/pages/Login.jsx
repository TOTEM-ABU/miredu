import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/api/user/login', formData);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success(`Xush kelibsiz, ${data.user.firstName}!`);
      navigate('/dashboard'); 
    } catch (error) {
      toast.error(error.message || 'Login yoki parol xato');
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
      <div className="card-premium">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 mb-4 border border-indigo-500/20">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold title-gradient mb-2">MirEdu Portal</h1>
          <p className="text-muted">Tizimga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label className="input-label-new">Email Manzil</label>
            <div className="input-wrapper">
              <Mail className="input-icon w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                className="input-main"
                placeholder="misol@mail.com"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-container">
            <label className="input-label-new">Parol</label>
            <div className="input-wrapper">
              <Lock className="input-icon w-5 h-5" />
              <input
                type="password"
                name="password"
                required
                className="input-main"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="hidden" />
              <div className="w-4 h-4 rounded border border-slate-800 bg-slate-900 focus-within:border-primary"></div>
              <span className="text-xs text-muted font-medium">Eslab qolish</span>
            </label>
            <Link to="#" className="link-alt text-xs">Parolni unutdingizmi?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-glow w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Tizimga Kirish <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-muted">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="link-alt">Ro'yxatdan o'tish</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
