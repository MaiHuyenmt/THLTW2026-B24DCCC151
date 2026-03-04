import { Form, Input, InputNumber, Select } from 'antd';

const ProductForm = ({ form }) => (
  <>
    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
      <Select>
        <Select.Option value="Laptop">Laptop</Select.Option>
        <Select.Option value="Điện thoại">Điện thoại</Select.Option>
        <Select.Option value="Máy tính bảng">Máy tính bảng</Select.Option>
        <Select.Option value="Phụ kiện">Phụ kiện</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item name="price" label="Giá" rules={[{ required: true, min: 1 }]}>
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item name="quantity" label="Số lượng tồn kho" rules={[{ required: true, min: 0 }]}>
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>
  </>
);

export default ProductForm;
