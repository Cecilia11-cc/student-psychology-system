import { Card, Row, Col, Statistic, Typography, Progress, Tag, Table, Space } from 'antd';
import {
  TeamOutlined, AlertOutlined, ExperimentOutlined, RiseOutlined, SafetyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PsychDashboard() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>🧠 心理老师工作台</Title>
        <Text type="secondary">全校学生行为心理总览 | 2026年7月26日</Text>
      </div>

      {/* KPI */}
      <Row gutter={[16, 16]}>
        {[
          { title: '全校学生', value: 1280, icon: <TeamOutlined />, color: '#1677ff', bg: '#e6f4ff' },
          { title: '高风险预警', value: 28, icon: <AlertOutlined />, color: '#ff4d4f', bg: '#fff1f0', extra: '+3 本月' },
          { title: '活跃干预', value: 45, icon: <ExperimentOutlined />, color: '#722ed1', bg: '#f9f0ff' },
          { title: '待评估', value: 12, icon: <SafetyOutlined />, color: '#faad14', bg: '#fffbe6' },
        ].map((kpi) => (
          <Col xs={24} sm={12} lg={6} key={kpi.title}>
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{kpi.title}</Text>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>{kpi.value}</div>
                  {kpi.extra && <Text style={{ fontSize: 12, color: '#ff4d4f' }}>{kpi.extra}</Text>}
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: kpi.color }}>{kpi.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Risk overview */}
        <Col xs={24} lg={12}>
          <Card title="🎯 全校风险分布" style={{ borderRadius: 12 }}>
            {[
              { level: '低风险', count: 1102, color: '#52c41a', pct: 86 },
              { level: '中等风险', count: 122, color: '#faad14', pct: 9.5 },
              { level: '高风险', count: 24, color: '#ff7a45', pct: 1.9 },
              { level: '严重风险', count: 4, color: '#ff4d4f', pct: 0.3 },
            ].map((r) => (
              <div key={r.level} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Tag color={r.color}>{r.level}</Tag>
                  <Text strong>{r.count} 人 ({r.pct}%)</Text>
                </div>
                <Progress percent={r.pct} strokeColor={r.color} showInfo={false} size="small" />
              </div>
            ))}
          </Card>
        </Col>

        {/* Recent flags */}
        <Col xs={24} lg={12}>
          <Card title="🚨 最近预警" style={{ borderRadius: 12 }}>
            <Table
              dataSource={[
                { student: '陈小强', grade: 'G2', risk: '严重', factor: '攻击行为+情绪调节', date: '07-25' },
                { student: '李小红', grade: 'G2', risk: '高', factor: '注意力+学习困难', date: '07-25' },
                { student: '周小军', grade: 'G1', risk: '高', factor: '社交退缩+焦虑', date: '07-24' },
                { student: '吴小丽', grade: 'G3', risk: '高', factor: '情绪不稳定', date: '07-24' },
              ]}
              rowKey="student"
              size="small"
              pagination={false}
              columns={[
                { title: '学生', dataIndex: 'student', width: 80 },
                { title: '年级', dataIndex: 'grade', width: 60 },
                {
                  title: '风险', dataIndex: 'risk', width: 70,
                  render: (v: string) => <Tag color={v === '严重' ? 'red' : 'orange'}>{v}</Tag>,
                },
                { title: '主要因子', dataIndex: 'factor' },
                { title: '日期', dataIndex: 'date', width: 70 },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Intervention effectiveness */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="📈 干预效果概览" style={{ borderRadius: 12 }}>
            <Row gutter={24}>
              {[
                { label: '行为干预', total: 20, effective: 15, color: '#ff4d4f' },
                { label: '情绪干预', total: 12, effective: 9, color: '#faad14' },
                { label: '社交干预', total: 8, effective: 6, color: '#1677ff' },
                { label: '学业干预', total: 5, effective: 3, color: '#52c41a' },
              ].map((s) => (
                <Col span={6} key={s.label}>
                  <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
                    <Text type="secondary">{s.label}</Text>
                    <Progress type="circle" percent={Math.round(s.effective / s.total * 100)} size={80} strokeColor={s.color} />
                    <div><Text strong>{s.effective}</Text><Text type="secondary">/{s.total} 有效</Text></div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
