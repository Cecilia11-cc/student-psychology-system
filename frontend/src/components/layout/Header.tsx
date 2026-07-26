import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Avatar, Space, Tag, Typography, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { ROLE_LABELS, ROLE_COLORS } from '../../config/permissions';
import type { Role } from '../../config/permissions';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const ROLE_OPTIONS: { value: Role; label: string; user: Parameters<typeof useAuthStore.getState>['0']['user'] }[] = [
  {
    value: 'teacher',
    label: '👩‍🏫 教师模式',
    user: { id: 't1', username: 'XIAOCHENLAOSHI', full_name: '小陈老师', role: 'teacher', email: 'xiaochen@school.edu.cn', school_id: 'demo-school-001' },
  },
  {
    value: 'psychologist',
    label: '🧠 心理老师模式',
    user: { id: 'p1', username: 'psych1', full_name: '李心理老师', role: 'psychologist', email: 'li@school.edu.cn', school_id: 'demo-school-001' },
  },
  {
    value: 'parent',
    label: '👨‍👩‍👧 家长模式',
    user: { id: 'pa1', username: 'parent1', full_name: '王妈妈', role: 'parent' },
  },
  {
    value: 'admin',
    label: '👑 管理员模式',
    user: { id: 'a1', username: 'admin', full_name: '系统管理员', role: 'admin' },
  },
];

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  if (!user) return null;

  const handleRoleChange = (role: Role) => {
    const option = ROLE_OPTIONS.find((o) => o.value === role);
    if (option?.user) {
      setUser(option.user);
      const map: Record<string, string> = { admin: '/admin', teacher: '/teacher', psychologist: '/psych', parent: '/parent' };
      navigate(map[role] || '/teacher', { replace: true });
      window.location.reload();
    }
  };

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        height: 56,
      }}
    >
      <Space>
        <Text strong style={{ fontSize: 16 }}>🧠 学生行为心理学分析系统</Text>
        <Text type="secondary" style={{ fontSize: 11 }}>Demo v2</Text>
      </Space>

      <Space size="middle">
        <Select
          size="small"
          value={user.role}
          onChange={handleRoleChange}
          style={{ width: 160 }}
          options={ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />

        <Space style={{ cursor: 'default' }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 14 }}>{user.full_name}</div>
            <Tag color={ROLE_COLORS[user.role as Role]} style={{ fontSize: 11, margin: 0 }}>
              {ROLE_LABELS[user.role as Role]}
            </Tag>
          </div>
        </Space>
      </Space>
    </AntHeader>
  );
}
