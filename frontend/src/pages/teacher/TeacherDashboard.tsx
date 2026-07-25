import { Card, Row, Col, Statistic, Typography, Progress, Tag, Table, Space } from 'antd';
import {
  TeamOutlined, EditOutlined, AlertOutlined, CheckCircleOutlined,
  ExperimentOutlined, RiseOutlined, ArrowUpOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const RISK_DATA = [
  { level: '低风险', count: 32, color: '#52c41a', bgColor: '#f6ffed' },
  { level: '中等风险', count: 7, color: '#faad14', bgColor: '#fffbe6' },
  { level: '高风险', count: 2, color: '#ff7a45', bgColor: '#fff2e8' },
  { level: '严重风险', count: 1, color: '#ff4d4f', bgColor: '#fff1f0' },
];

const RECENT_OBS = [
  { time: '08:30', student: '张小明', emotion: 4, behavior: 4, social: 3, mood: '😊 愉快' },
  { time: '10:15', student: '李小红', emotion: 3, behavior: 2, social: 3, mood: '😐 一般' },
  { time: '11:00', student: '王大力', emotion: 4, behavior: 3, social: 4, mood: '😊 愉快' },
  { time: '14:30', student: '陈小强', emotion: 2, behavior: 1, social: 2, mood: '😟 低落' },
  { time: '15:45', student: '赵小美', emotion: 5, behavior: 5, social: 4, mood: '😄 开心' },
];

export default function TeacherDashboard() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>📊 班级概览 — 三年级(2)班</Title>
        <Text type="secondary">今日日期：2026年7月25日 ｜ 本学期第18周</Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        {[
          { title: '学生总数', value: 42, icon: <TeamOutlined />, color: '#1677ff', bg: '#e6f4ff' },
          { title: '今日已观察', value: 15, suffix: '/42', icon: <EditOutlined />, color: '#52c41a', bg: '#f6ffed' },
          { title: '风险预警', value: 3, icon: <AlertOutlined />, color: '#faad14', bg: '#fffbe6', extra: <ArrowUpOutlined style={{ color: '#ff4d4f', fontSize: 12 }} /> },
          { title: '活跃干预', value: 5, icon: <ExperimentOutlined />, color: '#722ed1', bg: '#f9f0ff' },
        ].map((kpi) => (
          <Col xs={24} sm={12} lg={6} key={kpi.title}>
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{kpi.title}</Text>
                  <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>
                    {kpi.value}
                    {kpi.suffix && <Text style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>{kpi.suffix}</Text>}
                  </div>
                  {kpi.extra && <span style={{ fontSize: 12 }}>{kpi.extra}</span>}
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: kpi.color }}>
                  {kpi.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Risk Distribution */}
        <Col xs={24} lg={8}>
          <Card title="🎯 班级风险分布" style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            {RISK_DATA.map((r) => (
              <div key={r.level} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Tag color={r.color}>{r.level}</Tag>
                  <Text strong>{r.count} 人</Text>
                </div>
                <Progress percent={Math.round(r.count / 42 * 100)} strokeColor={r.color} showInfo={false} size="small" />
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                风险评分覆盖率：<Text strong>100%</Text> ｜ 最近更新：今日 02:17
              </Text>
            </div>
          </Card>
        </Col>

        {/* Observation Completion */}
        <Col xs={24} lg={8}>
          <Card title="📝 今日观察进度" style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Progress type="circle" percent={36} size={140}
                strokeColor={{ '0%': '#1677ff', '100%': '#52c41a' }}
                format={() => <div><div style={{ fontSize: 28, fontWeight: 700 }}>15</div><div style={{ fontSize: 12, color: '#999' }}>/ 42</div></div>}
              />
            </div>
            <Row gutter={8}>
              {['上午', '中午', '下午'].map((t) => (
                <Col span={8} key={t}>
                  <div style={{ textAlign: 'center', padding: '8px', background: '#fafafa', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: '#999' }}>{t}</div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{Math.floor(Math.random() * 15)}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card title="⚡ 快速操作" style={{ borderRadius: 12 }} styles={{ body: { padding: '12px 24px' } }}>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {[
                { icon: '✏️', label: '录入今日观察', desc: '选择模板开始记录学生行为', color: '#1677ff' },
                { icon: '📋', label: '批量录入全班观察', desc: '一次性录入所有学生观察数据', color: '#52c41a' },
                { icon: '🚨', label: '报告行为事件', desc: '记录突发事件或行为问题', color: '#ff7a45' },
                { icon: '📊', label: '查看班级报告', desc: '生成并下载班级观察报告', color: '#722ed1' },
              ].map((action) => (
                <div key={action.label}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fafafa'; (e.currentTarget as HTMLElement).style.borderColor = action.color; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                >
                  <span style={{ fontSize: 22 }}>{action.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{action.label}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{action.desc}</Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent observations table */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="📋 今日最近观察" style={{ borderRadius: 12 }}>
            <Table
              dataSource={RECENT_OBS}
              rowKey="time"
              size="small"
              pagination={false}
              columns={[
                { title: '时间', dataIndex: 'time', width: 80 },
                { title: '学生', dataIndex: 'student', width: 100 },
                { title: '情绪状态', dataIndex: 'mood', width: 110, render: (v: string) => <Tag>{v}</Tag> },
                { title: '情绪调节', dataIndex: 'emotion', width: 80, render: (v: number) => '⭐'.repeat(v) },
                { title: '行为表现', dataIndex: 'behavior', width: 80, render: (v: number) => '⭐'.repeat(v) },
                { title: '社交互动', dataIndex: 'social', width: 80, render: (v: number) => '⭐'.repeat(v) },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
