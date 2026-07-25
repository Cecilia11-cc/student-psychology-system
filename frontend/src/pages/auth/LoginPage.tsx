import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Space, Card } from 'antd';
import { UserOutlined, LockOutlined, HeartOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

const DEMOS = [
  { role: '👩‍🏫 小陈老师', username: 'XIAOCHENLAOSHI', password: 'XIAOCHENLAOSHI123', color: '#1677ff' },
  { role: '👨‍🏫 小明老师', username: 'XIAOMINGLAOSHI', password: 'XIAOMINGLAOSHI123', color: '#1890ff' },
  { role: '👨‍👩‍👧 家长', username: 'parent1', password: 'parent123', color: '#52c41a' },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const result = await authService.login(values);
      login(result.user, result.access_token, result.refresh_token);
      message.success('欢迎回来！');
      const home: Record<string, string> = { admin: '/admin', teacher: '/teacher', psychologist: '/psych', parent: '/parent' };
      navigate(home[result.user.role] || '/teacher', { replace: true });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      message.error(err?.response?.data?.detail || '登录失败');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 30%, #1a3a4a 60%, #0d2137 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,119,255,0.15), transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(114,46,209,0.12), transparent 70%)' }} />
      <div style={{ position: 'absolute', top: '40%', right: '25%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(82,196,26,0.08), transparent 70%)' }} />

      {/* Left hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 60, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 16, textAlign: 'center' }}>🧠</div>
          <Title style={{ color: '#fff', textAlign: 'center', fontSize: 36, marginBottom: 8, fontWeight: 700 }}>
            学生行为心理学分析系统
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, display: 'block', textAlign: 'center', marginBottom: 40 }}>
            Student Psychology Analysis System
          </Text>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            {[
              { icon: <SafetyOutlined />, label: '风险识别', desc: '多因素评分预警' },
              { icon: <HeartOutlined />, label: '行为分析', desc: '模式挖掘与趋势' },
              { icon: <UserOutlined />, label: '个性干预', desc: '智能推荐方案' },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                <div style={{ fontSize: 28, marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login card */}
      <div style={{ width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative', zIndex: 1 }}>
        <Card style={{ width: '100%', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.3)', background: 'rgba(255,255,255,0.97)' }} styles={{ body: { padding: '40px 32px' } }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 4 }}>登录系统</Title>
            <Text type="secondary">请使用您的账号登录</Text>
          </div>

          <Form size="large" onFinish={onFinish} initialValues={{ username: 'admin', password: 'admin123' }}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="用户名" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="密码" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading} block style={{ borderRadius: 8, height: 44, fontSize: 16 }}>
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12, textAlign: 'center' }}>
              演示账号快速登录
            </Text>
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              {DEMOS.map((acc) => (
                <Button key={acc.username} block onClick={() => onFinish({ username: acc.username, password: acc.password })}
                  style={{ borderRadius: 8, borderColor: acc.color, color: acc.color, height: 36 }}>
                  {acc.role} — {acc.username}
                </Button>
              ))}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}
