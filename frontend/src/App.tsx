import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { Suspense, lazy } from 'react';

import AppLayout from './components/layout/AppLayout';
import RoleGuard from './components/layout/RoleGuard';
import LoginPage from './pages/auth/LoginPage';

// Lazy-loaded pages
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const MyStudentsPage = lazy(() => import('./pages/teacher/MyStudentsPage'));
const StudentDetailPage = lazy(() => import('./pages/teacher/StudentDetailPage'));
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<RoleGuard allowedRoles={['admin', 'teacher', 'psychologist', 'parent']} />}>
          <Route element={<AppLayout />}>
            {/* Default redirect based on role */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* Teacher routes */}
            <Route element={<RoleGuard allowedRoles={['teacher']} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<MyStudentsPage />} />
              <Route path="/teacher/students/:id" element={<StudentDetailPage />} />
            </Route>

            {/* Psychologist routes */}
            <Route element={<RoleGuard allowedRoles={['psychologist']} />}>
              <Route path="/psych" element={<TeacherDashboard />} />
            </Route>

            {/* Parent routes */}
            <Route element={<RoleGuard allowedRoles={['parent']} />}>
              <Route path="/parent" element={<ParentDashboard />} />
            </Route>

            {/* Admin routes */}
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route path="/admin" element={<TeacherDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function RoleBasedRedirect() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(userStr);
    const roleMap: Record<string, string> = {
      admin: '/admin',
      teacher: '/teacher',
      psychologist: '/psych',
      parent: '/parent',
    };
    return <Navigate to={roleMap[user.role] || '/login'} replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
