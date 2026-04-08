import {
  Table, Button, Card, Modal, Form,
  Input, Select, DatePicker, TimePicker, Row, Col
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function Appointments() {

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : [];
  });

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(data));
  }, [data]);

  const submit = (values) => {

    const newData = {
      ...values,
      date: values.date.format("DD/MM/YYYY"),  
      time: values.time.format("HH:mm"),       
      status: "Chờ duyệt"
    };

    setData([...data, newData]);
    setOpen(false);
    form.resetFields();
  };

  return (
    <Card
      title="Danh sách lịch hẹn hệ thống"
      extra={
        <Button type="primary" onClick={() => {
          console.log("CLICK OK");
          setOpen(true);
        }}>
          + Đặt lịch mới
        </Button>
      }
    >

      <Table
        dataSource={data}
        rowKey={(r, i) => i}
        columns={[
          { title: "Khách hàng", dataIndex: "customer" },
          { title: "Dịch vụ", dataIndex: "service" },
          { title: "Nhân viên", dataIndex: "employee" },
          { title: "Ngày", dataIndex: "date" },
          { title: "Giờ", dataIndex: "time" },
          { title: "Trạng thái", dataIndex: "status" },
        ]}
      />

      <Modal
        title="Đặt lịch hẹn dịch vụ"
        visible={open}  
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="OK"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={submit}>

          {/* HÀNG 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customer" label="* Tên khách" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="phone" label="* Số điện thoại" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* DỊCH VỤ */}
          <Form.Item name="service" label="* Dịch vụ yêu cầu" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn dịch vụ"
              options={[
                { value: "Cắt tóc" },
                { value: "Spa" },
                { value: "Sửa chữa" }
              ]}
            />
          </Form.Item>

          {/* NHÂN VIÊN */}
          <Form.Item name="employee" label="* Nhân viên phục vụ" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn nhân viên"
              options={[
                { value: "Nguyễn Văn A" },
                { value: "Trần Thị B" }
              ]}
            />
          </Form.Item>

          {/* HÀNG 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="* Ngày hẹn" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="time" label="* Giờ hẹn" rules={[{ required: true }]}>
                <TimePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Modal>

    </Card>
  );
}
