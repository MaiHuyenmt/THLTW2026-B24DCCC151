import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Row,
  Col
} from "antd";
import { useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ToolOutlined
} from "@ant-design/icons";

export default function Employees() {
  // ================= STATE =================
  const [employees, setEmployees] = useState(() => {
    const data = localStorage.getItem("employees");
    return data ? JSON.parse(data) : [
    {
      id: 1,
      name: "Nguyễn Văn A",
      limit: "5",
      time: "08:00-17:00",
      days: "T2-T6"
    }
  ];
});

  const [services, setServices] = useState(() => {
    const data = localStorage.getItem("services");
    return data ? JSON.parse(data) : [
    {
      id: 1,
      name: "Cắt tóc",
      price: "100000",
      duration: "30"
    }
  ];
});

  const [openEmp, setOpenEmp] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [formEmp] = Form.useForm();
  const [formService] = Form.useForm();

  useEffect(() => {
  localStorage.setItem("employees", JSON.stringify(employees));
}, [employees]);

useEffect(() => {
  localStorage.setItem("services", JSON.stringify(services));
}, [services]);


  // ================= EMPLOYEE =================
  const submitEmployee = (values) => {
    if (editingEmp) {
      setEmployees(
        employees.map((e) =>
          e.id === editingEmp.id ? { ...e, ...values } : e
        )
      );
    } else {
      setEmployees([...employees, { id: Date.now(), ...values }]);
    }

    setOpenEmp(false);
    setEditingEmp(null);
    formEmp.resetFields();
  };

  const editEmployee = (record) => {
    setEditingEmp(record);
    formEmp.setFieldsValue(record);
    setOpenEmp(true);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  // ================= SERVICE =================
  const submitService = (values) => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id ? { ...s, ...values } : s
        )
      );
    } else {
      setServices([...services, { id: Date.now(), ...values }]);
    }

    setOpenService(false);
    setEditingService(null);
    formService.resetFields();
  };

  const editService = (record) => {
    setEditingService(record);
    formService.setFieldsValue(record);
    setOpenService(true);
  };

  const deleteService = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  // ================= COLUMNS =================
  const employeeColumns = [
    { title: "Nhân viên", dataIndex: "name" },
    { title: "Giới hạn/ngày", dataIndex: "limit" },
    { title: "Khung giờ", dataIndex: "time" },
    { title: "Ngày trực", dataIndex: "days" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => editEmployee(record)} />
          <Popconfirm
            title="Xóa nhân viên?"
            onConfirm={() => deleteEmployee(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const serviceColumns = [
    { title: "Dịch vụ", dataIndex: "name" },
    { title: "Giá (VND)", dataIndex: "price" },
    { title: "Thời lượng (phút)", dataIndex: "duration" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => editService(record)} />
          <Popconfirm
            title="Xóa dịch vụ?"
            onConfirm={() => deleteService(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Row gutter={16}>
        {/* ================= EMPLOYEE CARD ================= */}
        <Col span={12}>
          <Card
            title={
              <>
                <UserOutlined /> Danh sách nhân viên
              </>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpenEmp(true)}
              >
                Thêm nhân viên
              </Button>
            }
          >
            <Table
              dataSource={employees}
              columns={employeeColumns}
              rowKey="id"
            />
          </Card>
        </Col>

        {/* ================= SERVICE CARD ================= */}
        <Col span={12}>
          <Card
            title={
              <>
                <ToolOutlined /> Danh mục dịch vụ
              </>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpenService(true)}
              >
                Thêm dịch vụ
              </Button>
            }
          >
            <Table
              dataSource={services}
              columns={serviceColumns}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* ================= MODAL EMPLOYEE ================= */}
      <Modal
        title="Thêm nhân viên mới"
        visible={openEmp}
        onCancel={() => {
          setOpenEmp(false);
          setEditingEmp(null);
        }}
        onOk={() => formEmp.submit()}
      >
        <Form form={formEmp} onFinish={submitEmployee} layout="vertical">
          <Form.Item name="name" label="Họ tên nhân viên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="limit" label="Giới hạn khách/ngày" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="time" label="Khung giờ làm việc" rules={[{ required: true }]}>
            <Input placeholder="08:00-17:00" />
          </Form.Item>

          <Form.Item name="days" label="Ngày trực trong tuần" rules={[{ required: true }]}>
            <Input placeholder="T2-T6" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= MODAL SERVICE ================= */}
      <Modal
        title="Thêm dịch vụ mới"
        visible={openService}
        onCancel={() => {
          setOpenService(false);
          setEditingService(null);
        }}
        onOk={() => formService.submit()}
      >
        <Form form={formService} onFinish={submitService} layout="vertical">
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Giá niêm yết (VND)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
