import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Users2, CreditCard, LogOut, Sparkles, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Xayr, sog\' bo\'ling!');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 rounded-xl bg-primary">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold title-gradient">MirEdu</h2>
        </div>

        <nav className="flex-1">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard />
            Bosh Sahifa
          </NavLink>
          <NavLink to="/groups" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users2 />
            Guruhlar
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users />
            Talabalar
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Calendar />
            Davomat
          </NavLink>
          <NavLink to="/payments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CreditCard />
            To'lovlar
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary">
              {user.firstName?.[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user.firstName}</p>
              <p className="text-xs text-muted">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link w-full border-none bg-transparent cursor-pointer">
            <LogOut />
            Chiqish
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
