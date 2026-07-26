import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { Suspense, lazy } from 'react';
import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';

// Lazy pages
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const MyStudentsPage = lazy(() => import('./pages/teacher/MyStudentsPage'));
const StudentDetailPage = lazy(() => import('./pages/teacher/StudentDetailPage'));
const PsychDashboard = lazy(() => import('./pages/psychologist/PsychDashboard'));
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

function RoleRedirect() {
  const role = useAuthStore((s) => s.user?.role || 'teacher');
  const map: Record<string, string> = { admin: '/admin', teacher: '/teacher', psychologist: '/psych', parent: '/parent' };
  return <Navigate to={map[role] || '/teacher'} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auto-login: redirect / to the role-appropriate dashboard */}
        <Route path="/" element={<RoleRedirect />} />

        {/* All routes go through AppLayout (no auth guard) */}
        <Route element={<AppLayout />}>
          {/* Teacher */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/students" element={<MyStudentsPage />} />
          <Route path="/teacher/students/:id" element={<StudentDetailPage />} />

          {/* Psychologist */}
          <Route path="/psych" element={<PsychDashboard />} />

          {/* Parent */}
          <Route path="/parent" element={<ParentDashboard />} />

          {/* Admin uses teacher dashboard for now */}
          <Route path="/admin" element={<TeacherDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
