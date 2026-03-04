import { Form, Input, Select, InputNumber, Button, message } from 'antd';
import { useModel } from 'umi';
import { useMemo } from 'react';
import dayjs from 'dayjs';

export default function OrderForm({ close }) {
  const [form] = Form.useForm();
  const { product, setProduct } = useModel('product');
  const { order, setOrder } = useModel('order');

  // Map productId -> product
  const productMap = useMemo(() => {
    const map = {};
    product.forEach(p => (map[p.id] = p));
    return map;
  }, [product]);

  const handleSubmit = (values) => {
    const items = values.items.map(i => {
      const p = productMap[i.productId];
      if (i.quantity > p.quantity) {
        message.error(`Số lượng ${p.name} vượt quá tồn kho`);
        throw new Error();
      }
      return {
        productId: p.id,
        productName: p.name,
        quantity: i.quantity,
        price: p.price,
      };
    });

    const totalAmount = items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );

    const newOrder = {
      id: `DH${Date.now()}`,
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: items,
      totalAmount,
      status: 'Chờ xử lý',
      createdAt: dayjs().format('YYYY-MM-DD'),
    };

    setOrder([...order, newOrder]);
    message.success('Tạo đơn hàng thành công');
    close();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Tên khách hàng"
        name="customerName"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true },
          { pattern: /^\d{10,11}$/, message: 'SĐT phải 10-11 số' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="address"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.List
        name="items"
        rules={[
          {
            validator: async (_, items) => {
              if (!items || items.length === 0) {
                return Promise.reject('Chọn ít nhất 1 sản phẩm');
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => (
              <div key={key} style={{ display: 'flex', gap: 8 }}>
                <Form.Item
                  name={[name, 'productId']}
                  rules={[{ required: true }]}
                  style={{ flex: 2 }}
                >
                  <Select placeholder="Sản phẩm">
                    {product.map(p => (
                      <Select.Option
                        key={p.id}
                        value={p.id}
                        disabled={p.quantity === 0}
                      >
                        {p.name} (Kho: {p.quantity})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name={[name, 'quantity']}
                  rules={[{ required: true, min: 1 }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber placeholder="SL" />
                </Form.Item>

                <Button danger onClick={() => remove(name)}>
                  X
                </Button>
              </div>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + Thêm sản phẩm
            </Button>
          </>
        )}
      </Form.List>

      <Button
        type="primary"
        htmlType="submit"
        style={{ marginTop: 16, width: '100%' }}
      >
        Tạo đơn hàng
      </Button>
    </Form>
  );
}
