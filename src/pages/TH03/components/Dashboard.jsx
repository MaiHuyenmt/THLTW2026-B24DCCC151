import { Card, Row, Col } from "antd";

export default function Dashboard() {
  return (
    <div>

      {/* TOP METRIC */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>Tổng lịch hẹn<br /><h2>0</h2></Card>
        </Col>

        <Col span={6}>
          <Card>
            Đang chờ duyệt<br />
            <h2 style={{ color: "orange" }}>0</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card>Tổng nhân viên<br /><h2>2</h2></Card>
        </Col>

        <Col span={6}>
          <Card>Tổng dịch vụ<br /><h2>3</h2></Card>
        </Col>
      </Row>

      {/* ROW 2 */}
      <Row gutter={16} style={{ marginTop: 20 }}>

        <Col span={12}>
          <Card title="Báo cáo doanh thu tháng 03/2026">
            <h3 style={{ color: "green" }}>0 đ</h3>
            <p>Cắt tóc Nam - 0 đ</p>
            <p>Spa - 0 đ</p>
            <p>Sửa chữa - 0 đ</p>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Hiệu suất & Doanh thu nhân viên">
            <p>Nguyễn Văn A - 0 đ - ⭐ 0/5</p>
            <p>Trần Thị B - 0 đ - ⭐ 0/5</p>
          </Card>
        </Col>

      </Row>

      {/* THỐNG KÊ NGÀY */}
      <Card title="Thống kê lịch hẹn theo ngày" style={{ marginTop: 20 }}>
        <Row gutter={10}>
          {["12/03","13/03","14/03","15/03","16/03","17/03"].map((d) => (
            <Col span={4} key={d}>
              <Card style={{ textAlign: "center" }}>
                <div>{d}</div>
                <h3>0</h3>
                <small>LỊCH HẸN</small>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

    </div>
  );
}
