import { Card, Typography, Table, Tag, Progress, Row, Col } from 'antd';

const { Title } = Typography;

const INTERVENTIONS = [
  { id: '1', student: '陈小强', plan: '正向行为支持计划', type: '行为', start: '2026-07-10', progress: 65, status: '进行中', effectiveness: null },
  { id: '2', student: '李小红', plan: '注意力提升干预', type: '行为', start: '2026-07-05', progress: 80, status: '进行中', effectiveness: null },
  { id: '3', student: '王大力', plan: '社交技能训练', type: '社交', start: '2026-06-20', progress: 100, status: '已完成', effectiveness: 8.5 },
  { id: '4', student: '赵小美', plan: '情绪调节小组', type: '情绪', start: '2026-06-15', progress: 100, status: '已完成', effectiveness: 9.0 },
];

export default function InterventionListPage() {
  return (
    <div>
      <Title level={4}>🔬 干预跟踪</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {[
          { label: '进行中', value: 2, color: '#1677ff' },
          { label: '已完成', value: 2, color: '#52c41a' },
          { label: '平均有效率', value: '87%', color: '#722ed1' },
        ].map((s) => (
          <Col xs={8} key={s.label}>
            <Card size="small" style={{ textAlign: 'center', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{s.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={INTERVENTIONS}
          rowKey="id"
          columns={[
            { title: '学生', dataIndex: 'student', width: 80 },
            { title: '干预方案', dataIndex: 'plan' },
            { title: '类型', dataIndex: 'type', width: 70, render: (v: string) => <Tag>{v}</Tag> },
            { title: '开始日期', dataIndex: 'start', width: 100 },
            {
              title: '进度', dataIndex: 'progress', width: 120,
              render: (v: number) => <Progress percent={v} size="small" strokeColor={v === 100 ? '#52c41a' : '#1677ff'} />,
            },
            {
              title: '状态', dataIndex: 'status', width: 80,
              render: (v: string) => <Tag color={v === '已完成' ? 'green' : 'blue'}>{v}</Tag>,
            },
            {
              title: '效果', dataIndex: 'effectiveness', width: 70,
              render: (v: number | null) => v ? <span style={{ color: '#52c41a', fontWeight: 600 }}>{v}/10</span> : '-',
            },
          ]}
        />
      </Card>
    </div>
  );
}
