import { Card, Typography, Table, Select, Button, message } from 'antd';

const { Title } = Typography;

const STUDENTS = ['张小明', '李小红', '王大力', '赵小美', '陈小强', '刘小花'];
const DIMS = ['情绪调节', '注意力', '同伴关系', '规则遵守'];

export default function BatchObservationPage() {
  const dataSource = STUDENTS.map((name, i) => {
    const row: Record<string, unknown> = { key: i, name };
    DIMS.forEach((d) => { row[d] = <Select size="small" defaultValue={3} style={{ width: 70 }} options={[1, 2, 3, 4, 5].map((v) => ({ value: v, label: v }))} />; });
    return row;
  });

  return (
    <div>
      <Title level={4}>📋 批量观察录入</Title>
      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={dataSource}
          pagination={false}
          columns={[
            { title: '学生', dataIndex: 'name', width: 100, fixed: 'left' as const },
            ...DIMS.map((d) => ({ title: d, dataIndex: d, width: 90 })),
          ]}
          scroll={{ x: 500 }}
        />
        <Button type="primary" size="large" style={{ marginTop: 16 }} onClick={() => message.success('批量录入已保存（演示模式）')}>
          提交全部
        </Button>
      </Card>
    </div>
  );
}
