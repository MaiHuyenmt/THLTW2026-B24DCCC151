import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Select } from 'antd';

const initialProducts = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10, createdAt: new Date('2026-04-10').getTime() },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15, createdAt: new Date('2026-04-12').getTime() },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20, createdAt: new Date('2026-04-08').getTime() },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12, createdAt: new Date('2026-04-14').getTime() },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8, createdAt: new Date('2026-04-11').getTime() },
];

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSaveProduct = (values) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((item) =>
        item.id === editingProduct.id ? { ...item, ...values } : item
      ));
      message.success('Cập nhật sản phẩm thành công');
    } else {
      const newProduct = {
        id: Date.now(),
        createdAt: Date.now(),
        ...values,
      };
      setProducts((prev) => [...prev, newProduct]);
      message.success('Thêm sản phẩm thành công');
    }

    handleCancel();
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    setProducts(products.filter(item => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSortOptionChange = (value) => {
    setSortOption(value);
  };

  // Lọc theo tên
  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedProducts = [...filteredProducts];
  if (sortOption === 'latest') {
    sortedProducts.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortOption === 'totalDesc') {
    sortedProducts.sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity));
  }


  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price) => price.toLocaleString() + ' VNĐ',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      render: (_, record) => (record.price * record.quantity).toLocaleString() + ' VNĐ',
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý sản phẩm</h2>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên sản phẩm"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <Select
          placeholder="Sắp xếp"
          onChange={handleSortOptionChange}
          value={sortOption}
          style={{ width: 260 }}
          allowClear
          options={[
            { value: 'latest', label: 'Ngày mới nhất' },
            { value: 'totalDesc', label: 'Tổng tiền giảm dần' },
          ]}
        />

        <Button type="primary" onClick={handleAddProduct}>
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={sortedProducts}
        rowKey="id"
      />

      <Modal
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveProduct}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải là số dương' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương' },
            ]}
          >
            <InputNumber min={1} precision={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right'}}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type='primary' htmlType='submit'>
              {editingProduct ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
