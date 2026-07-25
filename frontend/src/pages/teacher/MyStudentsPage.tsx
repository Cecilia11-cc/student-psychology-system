import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Input,
  Select,
  Tag,
  Typography,
  Space,
  Button,
  Card,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useStudentList } from '../../hooks/useStudents';
import type { Student } from '../../types/student';

const { Title } = Typography;

const RISK_COLORS: Record<string, string> = {
  low: 'green',
  moderate: 'gold',
  high: 'orange',
  critical: 'red',
};

const RISK_LABELS: Record<string, string> = {
  low: '低风险',
  moderate: '中等风险',
  high: '高风险',
  critical: '严重风险',
};

export default function MyStudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useStudentList({
    page,
    page_size: 20,
    grade_level: gradeFilter,
    search: search || undefined,
  });

  const columns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'student_code',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'full_name',
      render: (name: string, record: Student) => (
        <a onClick={() => navigate(`/teacher/students/${record.id}`)}>
          <UserOutlined style={{ marginRight: 8 }} />
          {name}
        </a>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 60,
      render: (g: string) => (g === 'male' ? '男' : g === 'female' ? '女' : '-'),
    },
    {
      title: '年级',
      dataIndex: 'grade_level',
      width: 100,
    },
    {
      title: '出生日期',
      dataIndex: 'birth_date',
      width: 120,
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      width: 100,
      render: (level: string) =>
        level ? (
          <Tag color={RISK_COLORS[level] || 'default'}>
            {RISK_LABELS[level] || level}
          </Tag>
        ) : (
          <Tag>未评估</Tag>
        ),
    },
    {
      title: '标签数',
      dataIndex: 'label_count',
      width: 80,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          我的学生
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          添加学生
        </Button>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }} size="middle" wrap>
          <Input
            placeholder="搜索学生姓名..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="筛选年级"
            value={gradeFilter}
            onChange={setGradeFilter}
            allowClear
            style={{ width: 150 }}
            options={[
              { value: 'K1', label: '小班' },
              { value: 'K2', label: '中班' },
              { value: 'K3', label: '大班' },
              { value: 'G1', label: '一年级' },
              { value: 'G2', label: '二年级' },
              { value: 'G3', label: '三年级' },
            ]}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: 20,
            total: data?.pagination?.total || 0,
            onChange: setPage,
            showTotal: (total) => `共 ${total} 名学生`,
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/teacher/students/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>
    </div>
  );
}
