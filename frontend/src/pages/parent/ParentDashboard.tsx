import { Card, Row, Col, Typography, Tag } from 'antd';
import { HeartOutlined, FileTextOutlined, ExperimentOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ParentDashboard() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>孩子总览</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>👦</div>
              <Title level={5}>张小明</Title>
              <Tag color="green">低风险</Tag>
              <p style={{ marginTop: 8, color: '#666' }}>三年级(2)班</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="📊 近期概况">
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <HeartOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <p>情绪状态: 良好</p>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <FileTextOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                  <p>最近报告: 2026-07-15</p>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <ExperimentOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                  <p>干预方案: 0 项进行中</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
