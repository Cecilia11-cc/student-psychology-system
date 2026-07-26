import { Card, Typography, Form, Select, DatePicker, Input, Button, Row, Col, Slider, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const DIMS = [
  { code: 'EMO_REG', name: '情绪调节', cat: '情绪情感' },
  { code: 'EMO_ANX', name: '焦虑表现', cat: '情绪情感' },
  { code: 'BEH_ATTN', name: '注意力集中', cat: '行为表现' },
  { code: 'BEH_AGG', name: '攻击行为', cat: '行为表现' },
  { code: 'SOC_PEER', name: '同伴关系', cat: '社会交往' },
  { code: 'SOC_RULE', name: '规则遵守', cat: '社会交往' },
];

const STUDENTS = [
  { id: 'demo-stu-001', name: '张小明' }, { id: 'demo-stu-002', name: '李小红' },
  { id: 'demo-stu-003', name: '王大力' }, { id: 'demo-stu-004', name: '赵小美' },
  { id: 'demo-stu-005', name: '陈小强' }, { id: 'demo-stu-006', name: '刘小花' },
];

export default function ObservationEntryPage() {
  const [form] = Form.useForm();

  const onFinish = () => {
    message.success('观察记录已保存（演示模式）');
  };

  return (
    <div>
      <Title level={4}>✏️ 日常观察录入</Title>
      <Card style={{ borderRadius: 12, maxWidth: 800 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ date: undefined }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="student" label="选择学生" rules={[{ required: true }]}>
                <Select placeholder="选择学生" showSearch
                  options={STUDENTS.map((s) => ({ value: s.id, label: s.name }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="period" label="观察时段" initialValue="morning">
                <Select options={[
                  { value: 'morning', label: '上午' }, { value: 'afternoon', label: '下午' },
                  { value: 'all_day', label: '全天' },
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="context" label="场景" initialValue="classroom">
            <Select options={[
              { value: 'classroom', label: '课堂教学' }, { value: 'playground', label: '操场活动' },
              { value: 'group_activity', label: '小组活动' }, { value: 'lunch', label: '午餐时间' },
            ]} />
          </Form.Item>

          <Card title="行为维度评分 (1-5)" size="small" style={{ marginBottom: 16 }}>
            {DIMS.map((dim) => (
              <Form.Item key={dim.code} name={dim.code} label={`${dim.name} (${dim.cat})`} initialValue={3}>
                <Slider min={1} max={5} marks={{ 1: '差', 3: '中', 5: '优' }} />
              </Form.Item>
            ))}
          </Card>

          <Form.Item name="notes" label="观察备注">
            <Input.TextArea rows={3} placeholder="记录观察到的情况..." />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large">提交观察记录</Button>
        </Form>
      </Card>
    </div>
  );
}
