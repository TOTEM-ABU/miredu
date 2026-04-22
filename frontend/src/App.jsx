import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import DashboardLayout from './layouts/DashboardLayout';
import AdminSetup from './pages/AdminSetup';
import Teachers from './pages/Teachers';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Groups from './pages/Groups';
import Payments from './pages/Payments';
import Students from './pages/Students';
import MyGroups from './pages/MyGroups';
import MyAttendances from './pages/MyAttendances';
import MyPayments from './pages/MyPayments';

// ── Protected Route ──────────────────────────────────────────────────────────
// Reads only from localStorage('user') which always stores { ...userData, role }
// after login. Redirects unauthenticated users to /login, and users whose role
// doesn't match allowedRoles to their correct home page.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const user  = JSON.parse(localStorage.getItem('user') || 'null');

  // Not logged in at all
  if (!token || !user) return <Navigate to="/login" replace />;

  const role = user.role; // always set at login

  // Logged in but wrong role for this route
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'STUDENT') return <Navigate to="/student-dashboard" replace />;
    if (role === 'ADMIN' || role === 'TEACHER') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)' } }} />
      <Routes>
        {/* Public routes */}
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/admin-setup" element={<AdminSetup />} />

        {/* Admin / Teacher dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <DashboardLayout>
                <Teachers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <DashboardLayout>
                <Groups />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <DashboardLayout>
                <Attendance />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <DashboardLayout>
                <Payments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <DashboardLayout>
                <Students />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Student dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-groups"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout>
                <MyGroups />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-attendances"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout>
                <MyAttendances />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-payments"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout>
                <MyPayments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
