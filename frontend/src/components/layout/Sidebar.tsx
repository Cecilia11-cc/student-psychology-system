import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  EditOutlined,
  FormOutlined,
  AlertOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  SettingOutlined,
  AuditOutlined,
  TagsOutlined,
  SafetyOutlined,
  HomeOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../config/permissions';

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: Role[];
}

const allMenuItems: MenuItem[] = [
  // Teacher
  { key: 'teacher-dashboard', icon: <DashboardOutlined />, label: '班级仪表盘', path: '/teacher', roles: ['teacher'] },
  { key: 'teacher-students', icon: <TeamOutlined />, label: '我的学生', path: '/teacher/students', roles: ['teacher'] },
  { key: 'teacher-obs', icon: <EditOutlined />, label: '日常观察', path: '/teacher/observations/new', roles: ['teacher'] },
  { key: 'teacher-batch', icon: <FormOutlined />, label: '批量录入', path: '/teacher/observations/batch', roles: ['teacher'] },
  { key: 'teacher-incidents', icon: <AlertOutlined />, label: '事件报告', path: '/teacher/incidents', roles: ['teacher'] },
  { key: 'teacher-interventions', icon: <ExperimentOutlined />, label: '干预跟踪', path: '/teacher/interventions', roles: ['teacher'] },
  { key: 'teacher-reports', icon: <FileTextOutlined />, label: '报告中心', path: '/teacher/reports', roles: ['teacher'] },

  // Psychologist
  { key: 'psych-dashboard', icon: <DashboardOutlined />, label: '风险总览', path: '/psych', roles: ['psychologist'] },
  { key: 'psych-students', icon: <TeamOutlined />, label: '学生列表', path: '/psych/students', roles: ['psychologist'] },
  { key: 'psych-risk', icon: <SafetyOutlined />, label: '风险分析', path: '/psych/risk-analysis', roles: ['psychologist'] },
  { key: 'psych-patterns', icon: <ClockCircleOutlined />, label: '模式探索', path: '/psych/patterns', roles: ['psychologist'] },
  { key: 'psych-interventions', icon: <ExperimentOutlined />, label: '干预设计', path: '/psych/interventions/design', roles: ['psychologist'] },
  { key: 'psych-effectiveness', icon: <AuditOutlined />, label: '效果追踪', path: '/psych/effectiveness', roles: ['psychologist'] },
  { key: 'psych-reports', icon: <FileTextOutlined />, label: '报告生成', path: '/psych/reports', roles: ['psychologist'] },
  { key: 'psych-labels', icon: <TagsOutlined />, label: '标签管理', path: '/psych/labels', roles: ['psychologist'] },

  // Parent
  { key: 'parent-dashboard', icon: <DashboardOutlined />, label: '孩子总览', path: '/parent', roles: ['parent'] },
  { key: 'parent-timeline', icon: <ClockCircleOutlined />, label: '成长时间线', path: '/parent/timeline', roles: ['parent'] },
  { key: 'parent-reports', icon: <FileTextOutlined />, label: '报告查看', path: '/parent/reports', roles: ['parent'] },
  { key: 'parent-interventions', icon: <ExperimentOutlined />, label: '干预方案', path: '/parent/interventions', roles: ['parent'] },

  // Admin
  { key: 'admin-dashboard', icon: <DashboardOutlined />, label: '系统总览', path: '/admin', roles: ['admin'] },
  { key: 'admin-users', icon: <TeamOutlined />, label: '用户管理', path: '/admin/users', roles: ['admin'] },
  { key: 'admin-schools', icon: <HomeOutlined />, label: '学校班级', path: '/admin/schools', roles: ['admin'] },
  { key: 'admin-dimensions', icon: <SettingOutlined />, label: '维度配置', path: '/admin/dimensions', roles: ['admin'] },
  { key: 'admin-audit', icon: <AuditOutlined />, label: '审计日志', path: '/admin/audit', roles: ['admin'] },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  if (!user) return null;

  const role = user.role as Role;
  const visibleItems = allMenuItems.filter((item) => item.roles.includes(role));

  const selectedKey = visibleItems.find((item) =>
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  )?.key || visibleItems[0]?.key;

  const menuItems = visibleItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  return (
    <Sider width={200} style={{ background: '#001529' }}>
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>🧠 SPS</span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => {
          const item = visibleItems.find((i) => i.key === key);
          if (item) navigate(item.path);
        }}
      />
    </Sider>
  );
}
