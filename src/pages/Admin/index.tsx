import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Upload, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DollarOutlined, RiseOutlined, EyeOutlined } from '@ant-design/icons';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '@/services/trip';
import { Destination } from '@/models/trip';
import Chart from 'react-apexcharts';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

const Admin: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await getDestinations();
      const validData = Array.isArray(data) ? data : [];
      setDestinations(validData);
    } catch (error) {
      setDestinations([]);
      message.error('Failed to load destinations');
    }
  };

  const handleAdd = () => {
    setEditingDestination(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Destination) => {
    setEditingDestination(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDestination(id);
      setDestinations(destinations.filter(d => d.id !== id));
      message.success('Destination deleted successfully');
    } catch (error) {
      message.error('Failed to delete destination');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingDestination) {
        const updated = await updateDestination(editingDestination.id, values);
        setDestinations(destinations.map(d => d.id === editingDestination.id ? updated : d));
        message.success('Destination updated successfully');
      } else {
        const createdValues = {
          ...values,
          rating: Number(values.rating) || 0,
          costs: values.costs || { food: 0, accommodation: 0, transportation: 0 },
        };
        const created = await createDestination(createdValues);
        setDestinations([...destinations, created]);
        message.success('Destination created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save destination');
    }
  };

  const columns = [
    {
      title: 'Điểm đến',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Destination) => (
        <div className={styles.destinationCell}>
          <img src={record.image} alt={record.name} className={styles.thumb} />
          <div>
            <div className={styles.destinationName}>{record.name}</div>
            <div className={styles.destinationLocation}>{record.location}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const map: Record<string, string> = { beach: 'Biển', mountain: 'Núi', city: 'Thành phố', other: 'Khác' };
        return map[type] || type;
      },
    },
    {
      title: 'Chi phí',
      dataIndex: 'costs',
      key: 'costs',
      render: (costs: any, record: Destination) => {
        const effectiveCosts = costs || record.costs || { food: 0, accommodation: 0, transportation: 0 };
        const food = Number(effectiveCosts.food || 0);
        const accommodation = Number(effectiveCosts.accommodation || 0);
        const transportation = Number(effectiveCosts.transportation || 0);
        return formatCurrency(food + accommodation + transportation);
      },
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: any) => {
        const validRating = Number(rating) || 0;
        return `${validRating.toFixed(1)} ⭐`;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Destination) => (
        <div className={styles.actionButtons}>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  const stats = [
    { title: 'Tổng địa điểm', value: destinations.length, icon: <RiseOutlined /> },
    { title: 'Lịch trình đã tạo', value: 128, icon: <DollarOutlined /> },
    { title: 'Lượt xem tháng này', value: 2450, icon: <EyeOutlined /> },
    { title: 'Doanh thu ước tính', value: formatCurrency(45800000), icon: <DollarOutlined /> },
  ];

  const chartOptions = {
    chart: { type: 'bar' as const },
    xaxis: { categories: ['Đà Nẵng', 'Hà Nội', 'Sài Gòn', 'Đà Lạt'] },
  };

  const chartSeries = [
    { name: 'Số chuyến', data: [450, 380, 320, 100] },
  ];

  return (
    <div className={styles.admin}>
      <Row gutter={[24, 24]} className={styles.statsRow}>
        {stats.map(item => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card className={styles.statCard} bordered={false}>
              <div className={styles.statInner}>
                <div className={styles.statIcon}>{item.icon}</div>
                <div>
                  <div className={styles.statLabel}>{item.title}</div>
                  <div className={styles.statValue}>{item.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className={styles.tableCard} title="Quản lý điểm đến" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button>}>
        <Table columns={columns} dataSource={destinations} rowKey="id" pagination={false} />
      </Card>

      <Card className={styles.chartCard} title="Điểm đến phổ biến" style={{ marginTop: 24 }}>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={320} />
      </Card>

      <Modal
        title={editingDestination ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select>
              <Option value="beach">Biển</Option>
              <Option value="mountain">Núi</Option>
              <Option value="city">Thành phố</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="visitDuration" label="Thời gian tham quan (giờ)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Chi phí">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={[ 'costs', 'food' ]} label="Ăn uống" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={[ 'costs', 'accommodation' ]} label="Lưu trú" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={[ 'costs', 'transportation' ]} label="Di chuyển" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="image" label="Hình ảnh">
            <Upload>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingDestination ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
