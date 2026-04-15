import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, CloseCircleOutlined, ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

type OrderStatus = 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';

type Product = { id: string; name: string; price: number };
type Customer = { id: string; name: string; phone: string; email: string };
type OrderItem = { productId: string; name: string; quantity: number; unitPrice: number; totalPrice: number };
type Order = {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
};

const customers: Customer[] = [
  { id: 'c_1', name: 'Nguyễn Văn A', phone: '0912345678', email: 'a@example.com' },
  { id: 'c_2', name: 'Trần Thị B', phone: '0987654321', email: 'b@example.com' },
  { id: 'c_3', name: 'Lê Văn C', phone: '0909123456', email: 'c@example.com' },
];

const products: Product[] = [
  { id: 'p_1', name: 'Áo thun', price: 120000 },
  { id: 'p_2', name: 'Quần jean', price: 250000 },
  { id: 'p_3', name: 'Giày thể thao', price: 450000 },
  { id: 'p_4', name: 'Mũ lưỡi trai', price: 90000 },
  { id: 'p_5', name: 'Balo du lịch', price: 320000 },
];

const statusOptions: OrderStatus[] = ['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Hủy'];
const storageKey = 'orderManagementOrders';

function uid(prefix = 'o_') {
  return prefix + Math.random().toString(36).slice(2, 10);
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

const defaultOrders: Order[] = [
  {
    id: 'o_1',
    code: 'DH001',
    customerId: 'c_1',
    customerName: 'Nguyễn Văn A',
    orderDate: '2026-04-10',
    items: [
      { productId: 'p_1', name: 'Áo thun', quantity: 2, unitPrice: 120000, totalPrice: 240000 },
      { productId: 'p_3', name: 'Giày thể thao', quantity: 1, unitPrice: 450000, totalPrice: 450000 },
    ],
    totalAmount: 690000,
    status: 'Chờ xác nhận',
    notes: 'Giao trong ngày',
  },
  {
    id: 'o_2',
    code: 'DH002',
    customerId: 'c_2',
    customerName: 'Trần Thị B',
    orderDate: '2026-04-12',
    items: [
      { productId: 'p_2', name: 'Quần jean', quantity: 1, unitPrice: 250000, totalPrice: 250000 },
      { productId: 'p_4', name: 'Mũ lưỡi trai', quantity: 2, unitPrice: 90000, totalPrice: 180000 },
    ],
    totalAmount: 430000,
    status: 'Đang giao',
    notes: '',
  },
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useLocalStorage<Order[]>(storageKey, defaultOrders);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | OrderStatus>('Tất cả');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'Tất cả' && order.status !== statusFilter) {
        return false;
      }
      const query = searchText.trim().toLowerCase();
      if (!query) {
        return true;
      }
      return (
        order.code.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query)
      );
    });
  }, [orders, searchText, statusFilter]);

  useEffect(() => {
    if (!isModalVisible) {
      form.resetFields();
      return;
    }
    if (editingOrder) {
      form.setFieldsValue({
        code: editingOrder.code,
        customerId: editingOrder.customerId,
        orderDate: moment(editingOrder.orderDate),
        status: editingOrder.status,
        notes: editingOrder.notes,
        items: editingOrder.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    } else {
      form.setFieldsValue({
        status: 'Chờ xác nhận',
        orderDate: moment(),
        items: [{ productId: products[0].id, quantity: 1 }],
      });
    }
  }, [editingOrder, form, isModalVisible]);

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  const getStatusTag = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      'Chờ xác nhận': 'orange',
      'Đang giao': 'blue',
      'Hoàn thành': 'green',
      'Hủy': 'red',
    };
    return <Tag color={colors[status]}>{status}</Tag>;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const productsData = Array.isArray(values.items) ? values.items.filter(Boolean) : [];
      if (productsData.length === 0) {
        message.error('Đơn hàng cần ít nhất một sản phẩm.');
        return;
      }

      const items: OrderItem[] = productsData.map((item: any) => {
        const product = products.find((product) => product.id === item.productId);
        const quantity = Number(item.quantity || 1);
        return {
          productId: item.productId,
          name: product?.name || 'Sản phẩm',
          unitPrice: product?.price || 0,
          quantity,
          totalPrice: (product?.price || 0) * quantity,
        };
      });

      const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const customer = customers.find((c) => c.id === values.customerId);
      const existingCode = orders.find(
        (order) => order.code === values.code && order.id !== editingOrder?.id,
      );
      if (existingCode) {
        message.error('Mã đơn hàng đã tồn tại. Vui lòng nhập mã khác.');
        return;
      }

      const newOrder: Order = {
        id: editingOrder ? editingOrder.id : uid(),
        code: values.code,
        customerId: values.customerId,
        customerName: customer?.name || 'Khách hàng',
        orderDate: values.orderDate.format('YYYY-MM-DD'),
        status: values.status,
        notes: values.notes || '',
        items,
        totalAmount,
      };

      setOrders((prev) => {
        if (editingOrder) {
          return prev.map((order) => (order.id === editingOrder.id ? newOrder : order));
        }
        return [newOrder, ...prev];
      });

      message.success(editingOrder ? 'Cập nhật đơn hàng thành công.' : 'Thêm đơn hàng thành công.');
      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
    } catch (error) {
      // validation error handled by Ant Design
    }
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setIsModalVisible(true);
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };

  const handleCancelOrder = (order: Order) => {
    if (order.status !== 'Chờ xác nhận') {
      Modal.warning({
        title: 'Không thể hủy đơn',
        content: 'Chỉ có đơn ở trạng thái "Chờ xác nhận" mới được hủy.',
      });
      return;
    }

    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      onOk: () => {
        setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: 'Hủy' } : item)));
        message.success('Đơn hàng đã được hủy.');
      },
    });
  };

  const statusFilters = [
    { text: 'Tất cả', value: 'Tất cả' },
    ...statusOptions.map((status) => ({ text: status, value: status })),
  ];

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code',
      key: 'code',
      sorter: (a: Order, b: Order) => a.code.localeCompare(b.code),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a: Order, b: Order) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value: number) => formatCurrency(value),
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => getStatusTag(status),
      filters: statusFilters.slice(1),
      onFilter: (value: string | number | boolean, record: Order) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: Order) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger disabled={record.status !== 'Chờ xác nhận'} onClick={() => handleCancelOrder(record)}>
            Hủy
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.orderManagement}>
      <Card bordered={false} className={styles.headerCard}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <ShoppingCartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  Quản lý đơn hàng
                </Typography.Title>
              </div>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
              Thêm đơn hàng
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className={styles.filterCard} bordered={false}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm mã đơn hoặc khách hàng"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: '100%' }}
            >
              <Select.Option value="Tất cả">Tất cả trạng thái</Select.Option>
              {statusOptions.map((status) => (
                <Select.Option key={status} value={status}>{status}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Typography.Text type="secondary">
              Hiển thị {filteredOrders.length} đơn hàng
            </Typography.Text>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} className={styles.tableCard}>
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        width={760}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mã đơn hàng"
                name="code"
                rules={[{ required: true, message: 'Nhập mã đơn hàng' }]}
              >
                <Input placeholder="VD: DH001" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Khách hàng"
                name="customerId"
                rules={[{ required: true, message: 'Chọn khách hàng' }]}
              >
                <Select placeholder="Chọn khách hàng">
                  {customers.map((customer) => (
                    <Select.Option key={customer.id} value={customer.id}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Ngày đặt hàng"
                name="orderDate"
                rules={[{ required: true, message: 'Chọn ngày đặt hàng' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: 'Chọn trạng thái đơn hàng' }]}
              >
                <Select>
                  {statusOptions.map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Sản phẩm trong đơn" shouldUpdate>
            {() => (
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => {
                      const currentItem = form.getFieldValue(['items', field.name]) || {};
                      const product = products.find((item) => item.id === currentItem.productId);
                      const quantity = currentItem.quantity || 0;
                      const unitPrice = product?.price || 0;
                      return (
                        <Card key={field.key} className={styles.itemCard} size="small">
                          <Row gutter={16} align="middle">
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                label="Sản phẩm"
                                name={[field.name, 'productId']}
                                rules={[{ required: true, message: 'Chọn sản phẩm' }]}
                              >
                                <Select placeholder="Chọn sản phẩm">
                                  {products.map((productItem) => (
                                    <Select.Option key={productItem.id} value={productItem.id}>
                                      {productItem.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                label="Số lượng"
                                name={[field.name, 'quantity']}
                                rules={[{ required: true, message: 'Nhập số lượng' }]}
                              >
                                <InputNumber min={1} style={{ width: '100%' }} />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item label="Đơn giá">
                                <Input value={formatCurrency(unitPrice)} disabled />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item label="Thành tiền">
                                <Input value={formatCurrency(unitPrice * quantity)} disabled />
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Button
                                type="text"
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => remove(field.name)}
                                style={{ marginTop: 30 }}
                              />
                            </Col>
                          </Row>
                        </Card>
                      );
                    })}
                    <Form.Item>
                      <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add({ productId: products[0].id, quantity: 1 })}>
                        Thêm sản phẩm
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            )}
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm cho đơn hàng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagement;
