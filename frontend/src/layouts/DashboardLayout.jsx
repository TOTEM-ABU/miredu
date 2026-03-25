import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserSquare2, CalendarCheck,
  Wallet, Settings, LogOut, Bell, Search, BookOpen, PieChart, User
} from 'lucide-react';

const ADMIN_MENU = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Guruhlar', icon: BookOpen, path: '#' },
  { name: 'Talabalar', icon: Users, path: '#' },
  { name: "O'qituvchilar", icon: UserSquare2, path: '#' },
  { name: 'Davomat', icon: CalendarCheck, path: '#' },
  { name: "To'lovlar", icon: Wallet, path: '#' },
  { name: 'Sozlamalar', icon: Settings, path: '#' },
];

const STUDENT_MENU = [
  { name: 'Profilim', icon: User, path: '/student-dashboard' },
  { name: 'Guruhlarim', icon: BookOpen, path: '#' },
  { name: 'Davomatlarim', icon: CalendarCheck, path: '#' },
  { name: "To'lovlarim", icon: Wallet, path: '#' },
  { name: 'Statistika', icon: PieChart, path: '#' },
  { name: 'Sozlamalar', icon: Settings, path: '#' },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'STUDENT';
  const isAdmin = role === 'ADMIN' || role === 'TEACHER';
  const menu = isAdmin ? ADMIN_MENU : STUDENT_MENU;

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">M</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#f1f5f9' }}>MirEdu</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--primary)', textTransform: 'uppercase' }}>
              {role}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="nav-item nav-item-danger"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <LogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dash-main">
        {/* Header */}
        <header className="dash-header">
          <div className="search-wrap">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Qidiruv..." className="search-input" />
          </div>

          <div className="header-right">
            <button className="notif-btn" style={{ border: 'none', fontFamily: 'inherit' }}>
              <Bell size={17} />
              <span className="notif-dot" />
            </button>

            <div className="user-chip">
              <div className="user-avatar">
                <img
                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.firstName || 'U') + '&background=6366f1&color=fff'}
                  alt="Avatar"
                />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#f1f5f9' }}>{user.firstName || 'User'}</div>
                <div style={{ fontWeight: 700, fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dash-content">
          {children}
        </div>
      </div>
    </div>
  );
}
