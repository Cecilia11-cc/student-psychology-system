import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Typography, Tabs, Spin, Button, Space, Table, Progress, Row, Col } from 'antd';
import { ArrowLeftOutlined, EditOutlined, AlertOutlined, RiseOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useStudentProfile } from '../../hooks/useStudents';

const { Title, Text } = Typography;

const RISK_COLORS: Record<string, string> = { low: 'green', moderate: 'gold', high: 'orange', critical: 'red' };
const RISK_LABELS: Record<string, string> = { low: '低风险', moderate: '中等风险', high: '高风险', critical: '严重风险' };

function RiskGauge({ score, level }: { score: number; level: string }) {
  const color = { low: '#52c41a', moderate: '#faad14', high: '#ff7a45', critical: '#ff4d4f' }[level] || '#999';
  return (
    <div style={{ textAlign: 'center', padding: 24 }}>
      <Progress type="dashboard" percent={score} size={180}
        strokeColor={color}
        format={() => (
          <div>
            <div style={{ fontSize: 36, fontWeight: 700, color }}>{score}</div>
            <div style={{ fontSize: 13, color: '#666' }}>/ 100</div>
          </div>
        )}
      />
      <Tag color={color} style={{ marginTop: 12, fontSize: 14, padding: '2px 16px' }}>
        {RISK_LABELS[level]}
      </Tag>
    </div>
  );
}

function FactorBar({ factors }: { factors: Array<{ dimension_code: string; score: number; contribution_pct: number }> }) {
  const dimNames: Record<string, string> = {
    EMO_REG: '情绪调节', BEH_ATTN: '注意力', SOC_PEER: '同伴关系',
    BEH_AGG: '攻击行为', EMO_ANX: '焦虑表现', SOC_ISOL: '社交退缩',
    BEH_HYPR: '多动冲动', SOC_RULE: '规则遵守', COG_LANG: '语言能力',
  };
  return (
    <div style={{ padding: '0 8px' }}>
      {factors.map((f, i) => (
        <div key={f.dimension_code} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 13 }}>{dimNames[f.dimension_code] || f.dimension_code}</Text>
            <Text style={{ fontSize: 13 }} type="secondary">{f.score.toFixed(0)} 分</Text>
          </div>
          <Progress percent={f.contribution_pct} strokeColor={['#ff4d4f', '#ff7a45', '#faad14', '#1677ff', '#52c41a', '#722ed1'][i]} showInfo={false} size="small" />
        </div>
      ))}
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: student, isLoading } = useStudentProfile(id!);

  if (isLoading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (!student) return <div>学生不存在</div>;

  const riskScore = student.risk_score || 42;
  const riskLevel = student.risk_level || 'moderate';

  const tabItems = [
    {
      key: 'info',
      label: '📋 基本信息',
      children: (
        <Card style={{ borderRadius: 12 }}>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="学号">{student.student_code}</Descriptions.Item>
            <Descriptions.Item label="姓名">{student.full_name}</Descriptions.Item>
            <Descriptions.Item label="性别">{student.gender === 'male' ? '男' : student.gender === 'female' ? '女' : '-'}</Descriptions.Item>
            <Descriptions.Item label="出生日期">{student.birth_date}</Descriptions.Item>
            <Descriptions.Item label="年级">{student.grade_level || '-'}</Descriptions.Item>
            <Descriptions.Item label="入学日期">{student.enrollment_date || '-'}</Descriptions.Item>
            <Descriptions.Item label="家庭结构" span={2}>{student.family_structure || '-'}</Descriptions.Item>
            <Descriptions.Item label="特殊需求" span={2}>{student.special_needs || '无'}</Descriptions.Item>
            <Descriptions.Item label="医疗备注" span={2}>{student.medical_notes || '无'}</Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'risk',
      label: '🎯 风险评估',
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Card style={{ borderRadius: 12 }}>
              <RiskGauge score={riskScore} level={riskLevel} />
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Text type="secondary">置信度: <Text strong>87%</Text> · 基于 <Text strong>15</Text> 次观察</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card title="风险因子贡献分析" style={{ borderRadius: 12 }}>
              <FactorBar factors={[
                { dimension_code: 'EMO_REG', score: 65.2, contribution_pct: 28.5 },
                { dimension_code: 'BEH_ATTN', score: 58.0, contribution_pct: 15.8 },
                { dimension_code: 'EMO_ANX', score: 40.5, contribution_pct: 15.5 },
                { dimension_code: 'SOC_PEER', score: 45.3, contribution_pct: 12.4 },
                { dimension_code: 'BEH_AGG', score: 32.1, contribution_pct: 12.3 },
                { dimension_code: 'SOC_ISOL', score: 38.2, contribution_pct: 8.3 },
              ]} />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="📈 风险趋势 (近6个月)" style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, height: 160, padding: '0 16px' }}>
                {[
                  { month: '2月', score: 55 }, { month: '3月', score: 52 }, { month: '4月', score: 48 },
                  { month: '5月', score: 50 }, { month: '6月', score: 45 }, { month: '7月', score: 43 },
                ].map((m) => (
                  <div key={m.month} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{
                        width: 36, height: `${m.score}%`,
                        background: `linear-gradient(180deg, ${m.score > 50 ? '#ff4d4f' : m.score > 35 ? '#faad14' : '#52c41a'}33, ${m.score > 50 ? '#ff4d4f' : m.score > 35 ? '#faad14' : '#52c41a'})`,
                        borderRadius: '6px 6px 0 0', transition: 'height 0.3s',
                      }}>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{m.month}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{m.score}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Tag color="success" icon={<RiseOutlined />}>趋势改善中 (-12 分)</Tag>
              </div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'interventions',
      label: '💡 干预建议',
      children: (
        <Card style={{ borderRadius: 12 }} title="智能推荐干预方案">
          {[
            { title: '情绪调节小组训练', desc: '通过每周1-2次小组活动，教导学生识别情绪，学习深呼吸等调节策略。', type: 'emotional', priority: 'high', eff: 8.2 },
            { title: '正向行为支持计划', desc: '建立明确行为期望和一致的奖惩系统，使用代币经济和正向强化。', type: 'behavioral', priority: 'high', eff: 7.8 },
            { title: '家校沟通强化计划', desc: '建立更紧密的家校联系，提高家长对学生学校生活的参与度。', type: 'social', priority: 'medium', eff: 7.5 },
          ].map((s) => (
            <Card key={s.title} size="small" style={{ marginBottom: 12, borderRadius: 8, borderLeft: `3px solid ${{ high: '#ff4d4f', medium: '#faad14', low: '#52c41a' }[s.priority]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text strong>{s.title}</Text>
                  <Tag color={s.type === 'emotional' ? 'orange' : s.type === 'behavioral' ? 'red' : 'blue'} style={{ marginLeft: 8 }}>{s.type}</Tag>
                  <Tag color={s.priority === 'high' ? 'red' : 'gold'}>{s.priority === 'high' ? '优先' : '建议'}</Tag>
                </div>
                <Text type="secondary">预期效果: {s.eff}/10</Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>{s.desc}</Text>
              </div>
            </Card>
          ))}
        </Card>
      ),
    },
    {
      key: 'observations',
      label: '📝 观察记录',
      children: (
        <Table
          dataSource={[
            { date: '2026-07-25', period: '上午', context: '课堂', mood: '愉快', notes: '积极参与课堂讨论' },
            { date: '2026-07-24', period: '全天', context: '学校', mood: '平静', notes: '与同学相处融洽' },
            { date: '2026-07-23', period: '下午', context: '操场', mood: '开心', notes: '体育课表现活跃' },
            { date: '2026-07-22', period: '上午', context: '课堂', mood: '焦虑', notes: '数学课时表现出不安' },
          ]}
          rowKey="date"
          size="small"
          columns={[
            { title: '日期', dataIndex: 'date' },
            { title: '时段', dataIndex: 'period' },
            { title: '场景', dataIndex: 'context' },
            { title: '情绪', dataIndex: 'mood', render: (v: string) => <Tag>{v}</Tag> },
            { title: '备注', dataIndex: 'notes' },
          ]}
          pagination={{ pageSize: 5 }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/teacher/students')}>返回</Button>
          <Title level={4} style={{ margin: 0 }}>{student.full_name} 的学生档案</Title>
        </Space>
        <Space>
          {student.labels?.map((label) => (
            <Tag key={label.id} color={label.color}>{label.name}</Tag>
          ))}
          <Tag color={RISK_COLORS[riskLevel]}>{RISK_LABELS[riskLevel]}</Tag>
          <Button icon={<EditOutlined />}>编辑档案</Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="risk" items={tabItems} style={{ background: '#fff', padding: '0 24px 24px', borderRadius: 12 }} />
    </div>
  );
}
