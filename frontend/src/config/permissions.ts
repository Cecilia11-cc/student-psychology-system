export type Role = 'admin' | 'teacher' | 'psychologist' | 'parent';

export const ROLE_LABELS: Record<Role, string> = {
  admin: '系统管理员',
  teacher: '教师',
  psychologist: '心理老师',
  parent: '家长',
};

export const ROLE_COLORS: Record<Role, string> = {
  admin: '#ff4d4f',
  teacher: '#1677ff',
  psychologist: '#722ed1',
  parent: '#52c41a',
};

export const ROLE_HOME: Record<Role, string> = {
  admin: '/admin',
  teacher: '/teacher',
  psychologist: '/psych',
  parent: '/parent',
};
