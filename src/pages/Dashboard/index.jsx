import { Card, Statistic, Row, Col } from 'antd';
import { useModel } from 'umi';

export default () => {
  const { product } = useModel('product');
  const { order } = useModel('order');

  const revenue = order
    .filter(o => o.status === 'Hoàn thành')
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <Row gutter={16}>
      <Col span={6}><Card><Statistic title="Sản phẩm" value={product.length} /></Card></Col>
      <Col span={6}><Card><Statistic title="Đơn hàng" value={order.length} /></Card></Col>
      <Col span={6}><Card><Statistic title="Doanh thu" value={revenue} /></Card></Col>
    </Row>
  );
};
