import { useModel } from 'umi';
import { Table, Select, Button, Modal } from 'antd';
import { useState } from 'react';
import OrderForm from './components/OrderForm';
import OrderDetail from './components/OrderDetail';

export default () => {
  const { order, setOrder } = useModel('order');
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName' },
    { title: 'Tổng tiền', dataIndex: 'totalAmount' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (v, r) => (
        <Select
          value={v}
          onChange={(value) => {
            r.status = value;
            setOrder([...order]);
          }}
        >
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy">Đã hủy</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      render: (_, r) => (
        <Button onClick={() => setDetail(r)}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>Tạo đơn hàng</Button>

      <Table columns={columns} dataSource={order} rowKey="id" />

      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <OrderForm close={() => setOpen(false)} />
      </Modal>

      <Modal open={!!detail} onCancel={() => setDetail(null)} footer={null}>
        <OrderDetail data={detail} />
      </Modal>
    </>
  );
};
