import React from 'react';
import { Card, Row, Col, Statistic, Progress, Button, Typography } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Title } = Typography;

interface Props {
  onAddTask: () => void;
}

export default ({ onAddTask }: Props) => {
  const { tasks, getStats } = useModel('kanban');
  const stats = getStats();
  const completedRate = tasks.length ? Math.round((stats.completed / tasks.length) * 100) : 0;
  const priorityCounts = {
    high: tasks.filter((task) => task.priority === 'high').length,
    medium: tasks.filter((task) => task.priority === 'medium').length,
    low: tasks.filter((task) => task.priority === 'low').length,
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng công việc" value={stats.total} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quá hạn"
              value={stats.overdue}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tiến độ"
              value={`${completedRate}%`}
              prefix={<FieldTimeOutlined />}
            />
            <Progress percent={completedRate} size="small" style={{ marginTop: 16 }} />
          </Card>
        </Col>
      </Row>
      <Card title="Phân tích độ ưu tiên" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Progress type="dashboard" percent={priorityCounts.high ? 100 : 0} format={() => priorityCounts.high} strokeColor="#ff4d4f" />
              <Title level={5} style={{ marginTop: 8 }}>Cao</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Progress type="dashboard" percent={priorityCounts.medium ? 100 : 0} format={() => priorityCounts.medium} strokeColor="#faad14" />
              <Title level={5} style={{ marginTop: 8 }}>Trung bình</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Progress type="dashboard" percent={priorityCounts.low ? 100 : 0} format={() => priorityCounts.low} strokeColor="#52c41a" />
              <Title level={5} style={{ marginTop: 8 }}>Thấp</Title>
            </Card>
          </Col>
        </Row>
      </Card>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
        Tạo task mới
      </Button>
    </div>
  );
};