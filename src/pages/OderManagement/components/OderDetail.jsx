import { Descriptions, Table } from 'antd';

export default function OrderDetail({ data }) {
  if (!data) return null;

  const columns = [
    { title: 'Sản phẩm', dataIndex: 'productName' },
    { title: 'Số lượng', dataIndex: 'quantity' },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: v => v.toLocaleString() + ' ₫',
    },
    {
      title: 'Thành tiền',
      render: (_, r) =>
        (r.quantity * r.price).toLocaleString() + ' ₫',
    },
  ];

  return (
    <>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Mã đơn">
          {data.id}
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {data.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {data.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {data.address}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {data.status}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {data.createdAt}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {data.totalAmount.toLocaleString()} ₫
        </Descriptions.Item>
      </Descriptions>

      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={data.products}
        rowKey={(r, i) => i}
        pagination={false}
      />
    </>
  );
}
