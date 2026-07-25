import { Layout, Dropdown, Avatar, Space, Tag, Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { ROLE_LABELS, ROLE_COLORS } from '../../config/permissions';
import type { Role } from '../../config/permissions';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const dropdownItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'password',
      icon: <KeyOutlined />,
      label: '修改密码',
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      window.location.href = '/login';
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
      <div>
        <Text strong style={{ fontSize: 16 }}>
          学生行为心理学分析系统
        </Text>
      </div>

      <Space size="middle">
        <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
        <Dropdown menu={{ items: dropdownItems, onClick: handleMenuClick }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 14 }}>{user.full_name}</div>
              <Tag
                color={ROLE_COLORS[user.role as Role]}
                style={{ fontSize: 11, lineHeight: '16px', margin: 0 }}
              >
                {ROLE_LABELS[user.role as Role]}
              </Tag>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
