import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  CalendarCheck,
  Wallet,
  Settings,
  LogOut,
  Bell,
  Search,
  BookOpen,
  PieChart,
  User,
} from "lucide-react";

const ADMIN_MENU = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Guruhlar", icon: BookOpen, path: "/groups" },
  { name: "Talabalar", icon: Users, path: "/students" },
  { name: "O'qituvchilar", icon: UserSquare2, path: "/teachers" },
  { name: "Davomat", icon: CalendarCheck, path: "/attendance" },
  { name: "To'lovlar", icon: Wallet, path: "/payments" },
  { name: "Sozlamalar", icon: Settings, path: "/profile" },
];

const STUDENT_MENU = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
  { name: "Guruhlarim", icon: BookOpen, path: "/my-groups" },
  { name: "Davomatlarim", icon: CalendarCheck, path: "/my-attendances" },
  { name: "To'lovlarim", icon: Wallet, path: "/my-payments" },
  { name: "Sozlamalar", icon: Settings, path: "/profile" },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "STUDENT";
  const isAdmin = role === "ADMIN" || role === "TEACHER";
  const menu = isAdmin ? ADMIN_MENU : STUDENT_MENU;

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu-container")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">M</div>
          <div>
            <div
              style={{ fontWeight: 900, fontSize: "1.1rem", color: "#f1f5f9" }}
            >
              MirEdu
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "var(--primary)",
                textTransform: "uppercase",
              }}
            >
              {role}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${pathname === item.path ? "active" : ""}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1rem",
            marginTop: "auto",
          }}
        >
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="nav-item nav-item-danger"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
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
            <input
              type="text"
              placeholder="Qidiruv..."
              className="search-input"
            />
          </div>

          <div className="header-right">
            <button
              className="notif-btn"
              style={{ border: "none", fontFamily: "inherit" }}
            >
              <Bell size={17} />
              <span className="notif-dot" />
            </button>

            {/* Profile Dropdown */}
            <div
              className="user-menu-container"
              style={{ position: "relative" }}
            >
              <div
                className="user-chip"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <div className="user-avatar">
                  <img
                    src={
                      user.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.firstName || user.name || "U") +
                      "&background=6366f1&color=fff"
                    }
                    alt="Avatar"
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "0.875rem",
                      color: "#f1f5f9",
                    }}
                  >
                    {user.firstName || user.name || "User"}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      color: "var(--primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {role}
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    width: "180px",
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "0.75rem",
                    padding: "0.5rem",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 0.75rem",
                      color: "#e2e8f0",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      Object.assign(e.currentTarget.style, {
                        background: "rgba(99,102,241,0.15)",
                        color: "var(--primary)",
                      })
                    }
                    onMouseLeave={(e) =>
                      Object.assign(e.currentTarget.style, {
                        background: "transparent",
                        color: "#e2e8f0",
                      })
                    }
                  >
                    <User size={16} /> Mening Profilim
                  </Link>
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(255,255,255,0.06)",
                      margin: "2px 0",
                    }}
                  />
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      localStorage.clear();
                      navigate("/login");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 0.75rem",
                      color: "#ef4444",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      fontFamily: "inherit",
                      width: "100%",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      Object.assign(e.currentTarget.style, {
                        background: "rgba(239,68,68,0.1)",
                      })
                    }
                    onMouseLeave={(e) =>
                      Object.assign(e.currentTarget.style, {
                        background: "transparent",
                      })
                    }
                  >
                    <LogOut size={16} /> Tizimdan chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
