import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'psychologist' | 'parent';
  email?: string;
  school_id?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

// Auto-login as default teacher
const DEFAULT_USER: User = {
  id: 'demo-teacher-001',
  username: 'XIAOCHENLAOSHI',
  full_name: '小陈老师',
  role: 'teacher',
  email: 'xiaochen@school.edu.cn',
  school_id: 'demo-school-001',
};

const stored = localStorage.getItem('sps_user');
const initialUser: User = stored ? JSON.parse(stored) : DEFAULT_USER;

if (!stored) {
  localStorage.setItem('sps_user', JSON.stringify(DEFAULT_USER));
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: 'demo-token',
  isAuthenticated: true,

  setUser: (user: User) => {
    localStorage.setItem('sps_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('sps_user');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
