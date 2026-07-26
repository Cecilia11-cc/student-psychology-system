import { Card, Typography, Table, Tag, Button, Form, Select, Input, Modal, message, Space } from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const INCIDENTS = [
  { id: '1', student: '陈小强', date: '2026-07-25', type: '攻击行为', severity: '严重', desc: '课间与同学发生肢体冲突', status: '处理中' },
  { id: '2', student: '李小红', date: '2026-07-24', type: '破坏课堂', severity: '中等', desc: '课堂上大声喧哗并拒绝回座', status: '已解决' },
  { id: '3', student: '王大力', date: '2026-07-22', type: '情绪爆发', severity: '轻微', desc: '因未能回答问题而哭泣', status: '已解决' },
];

export default function IncidentReportPage() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>🚨 事件报告</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>报告事件</Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={INCIDENTS}
          rowKey="id"
          columns={[
            { title: '日期', dataIndex: 'date', width: 100 },
            { title: '学生', dataIndex: 'student', width: 80 },
            { title: '类型', dataIndex: 'type', width: 100, render: (v: string) => <Tag color="red">{v}</Tag> },
            { title: '严重程度', dataIndex: 'severity', width: 90,
              render: (v: string) => <Tag color={v === '严重' ? 'red' : v === '中等' ? 'orange' : 'blue'}>{v}</Tag> },
            { title: '描述', dataIndex: 'desc' },
            { title: '状态', dataIndex: 'status', width: 80,
              render: (v: string) => <Tag color={v === '已解决' ? 'green' : 'gold'}>{v}</Tag> },
          ]}
        />
      </Card>

      <Modal title="报告新事件" open={open} onCancel={() => setOpen(false)} onOk={() => { message.success('事件已报告（演示模式）'); setOpen(false); }}>
        <Form layout="vertical">
          <Form.Item label="学生"><Select options={['张小明', '李小红', '王大力', '赵小美', '陈小强', '刘小花'].map((n) => ({ value: n, label: n }))} /></Form.Item>
          <Form.Item label="事件类型"><Select options={['攻击行为', '破坏课堂', '情绪爆发', '自伤行为', '同伴冲突', '其他'].map((t) => ({ value: t, label: t }))} /></Form.Item>
          <Form.Item label="严重程度"><Select options={['轻微', '中等', '严重', '危急'].map((s) => ({ value: s, label: s }))} /></Form.Item>
          <Form.Item label="事件描述"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
