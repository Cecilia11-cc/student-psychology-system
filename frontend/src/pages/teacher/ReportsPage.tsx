import { Card, Typography, Table, Tag, Button, Space, Select, message } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const REPORTS = [
  { id: '1', title: '班级月度行为报告 - 2026年7月', type: '班级', student: '-', date: '2026-07-25', format: 'PDF' },
  { id: '2', title: '陈小强 - 风险评估报告', type: '个人', student: '陈小强', date: '2026-07-24', format: 'PDF' },
  { id: '3', title: '李小红 - 行为分析报告', type: '个人', student: '李小红', date: '2026-07-20', format: 'HTML' },
  { id: '4', title: '班级学期总结报告', type: '班级', student: '-', date: '2026-07-01', format: 'PDF' },
];

export default function ReportsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>📄 报告中心</Title>
        <Space>
          <Select defaultValue="individual" style={{ width: 120 }} options={[
            { value: 'individual', label: '个人报告' }, { value: 'class', label: '班级报告' },
          ]} />
          <Button type="primary" icon={<FileTextOutlined />} onClick={() => message.success('报告生成已提交（演示模式）')}>
            生成报告
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={REPORTS}
          rowKey="id"
          columns={[
            { title: '报告名称', dataIndex: 'title' },
            { title: '类型', dataIndex: 'type', width: 70, render: (v: string) => <Tag color={v === '个人' ? 'blue' : 'purple'}>{v}</Tag> },
            { title: '关联学生', dataIndex: 'student', width: 90 },
            { title: '生成日期', dataIndex: 'date', width: 110 },
            { title: '格式', dataIndex: 'format', width: 70, render: (v: string) => <Tag>{v}</Tag> },
            {
              title: '操作', width: 80,
              render: () => <Button size="small" icon={<DownloadOutlined />} onClick={() => message.info('下载功能演示')}>下载</Button>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
