import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Sparkles, Loader2, ArrowRight, Camera, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    parentsPhoneNumber: '',
    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
      const { data } = await api.post('/api/file', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, avatar: data.url });
      toast.success('Avatar yuklandi!');
    } catch (error) {
      toast.error('Rasmni yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/user/register/student', formData);
      toast.success('Ro\'yxatdan o\'tdingiz! Tasdiqlash kodini kiring.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full"
    >
      <div className="card-premium">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 mb-4 border border-indigo-500/20">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold title-gradient mb-2">MirEdu Registration</h1>
          <p className="text-muted">Kurslarga qo'shilish uchun hisob yarating</p>
        </div>

        <div className="avatar-upload-wrapper">
          <div className="avatar-preview-container" onClick={handleAvatarClick}>
            <div className="avatar-preview-inner">
              <img src={formData.avatar} alt="Preview" className="avatar-image" />
              <div className="avatar-overlay">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {uploading && (
                <div className="upload-spinner">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">Avatar yuklash</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md-grid-cols-2 gap-6">
          <div className="input-container">
            <label className="input-label-new">Ism</label>
            <div className="input-wrapper">
              <User className="input-icon w-5 h-5" />
              <input
                type="text"
                name="firstName"
                required
                className="input-main"
                placeholder="Aziz"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-container">
            <label className="input-label-new">Familiya</label>
            <div className="input-wrapper">
              <User className="input-icon w-5 h-5" />
              <input
                type="text"
                name="lastName"
                required
                className="input-main"
                placeholder="Azizov"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-container">
            <label className="input-label-new">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                className="input-main"
                placeholder="aziz@mail.com"
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

          <div className="input-container">
            <label className="input-label-new">Sizning tel raqamingiz</label>
            <div className="input-wrapper">
              <Phone className="input-icon w-5 h-5" />
              <input
                type="tel"
                name="phoneNumber"
                required
                className="input-main"
                placeholder="+998"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-container">
            <label className="input-label-new">Ota-ona tel raqami</label>
            <div className="input-wrapper">
              <Phone className="input-icon w-5 h-5" />
              <input
                type="tel"
                name="parentsPhoneNumber"
                required
                className="input-main"
                placeholder="+998"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="md-col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className={`btn-glow w-full ${(loading || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Ro'yxatdan o'tish <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-10">
          <p className="text-sm text-muted">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="link-alt">Kirish</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
