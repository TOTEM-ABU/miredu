import React, { useState, useEffect } from 'react';
import { Users, Users2, CreditCard, ArrowUpRight, Clock, UserPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalGroups: 0, monthlyRevenue: 0 });
  const [charts, setCharts] = useState({ attendance: [], payments: [] });
  const [recent, setRecent] = useState({ students: [], payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes, recentRes] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/dashboard/charts'),
          api.get('/api/dashboard/recent'),
        ]);
        setStats(statsRes.data);
        setCharts(chartsRes.data);
        setRecent(recentRes.data);
      } catch (error) {
        toast.error('Ma\'lumotlarni yuklashda xatolik!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <div className="fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Xush kelibsiz! 👋</h1>
        <p className="text-muted">MirEdu o'quv markazining bugungi holati va statistikasi</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card-new">
          <div className="stat-icon-box bg-indigo-500/10 text-indigo-400">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="stat-label">Jami Talabalar</p>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-icon-box bg-emerald-500/10 text-emerald-400">
            <Users2 className="w-7 h-7" />
          </div>
          <div>
            <p className="stat-label">Guruhlar soni</p>
            <p className="stat-value">{stats.totalGroups}</p>
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-icon-box bg-amber-500/10 text-amber-400">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <p className="stat-label">Oylik Tushum</p>
            <p className="stat-value">{stats.monthlyRevenue.toLocaleString()} sum</p>
          </div>
        </div>
      </div>

      <div className="charts-wrapper mb-8">
        <div className="chart-container">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ArrowUpRight className="text-primary w-5 h-5" /> Haftalik Davomat (%)
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={charts.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '1rem' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#8b5cf6" 
                  strokeWidth={4} 
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-actions">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Clock className="text-amber-500 w-5 h-5" /> Oxirgi To'lovlar
          </h3>
          <div className="flex flex-col">
            {recent.payments.map((p, idx) => (
              <div key={idx} className="action-item">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{p.student.firstName} {p.student.lastName}</p>
                  <p className="text-xs text-muted">{new Date(p.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-bold text-emerald-400">+{p.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <UserPlus className="text-indigo-400 w-5 h-5" /> Yangi Talabalar
        </h3>
        <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-4">
          {recent.students.map((s, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700">
                <img src={s.avatar} alt={s.firstName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{s.firstName} {s.lastName}</p>
                <p className="text-xs text-muted">{s.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
