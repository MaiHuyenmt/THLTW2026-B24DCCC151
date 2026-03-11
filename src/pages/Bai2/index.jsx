import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Tabs,
  Table,
  Button,
  Modal,
  Input,
  Select,
  Form,
  Tag,
} from "antd";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export default function Bai2() {
  const [activeTab, setActiveTab] = useState("questions");

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [exams, setExams] = useState([]);

  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [openAddBlock, setOpenAddBlock] = useState(false);
  const [openCreateExam, setOpenCreateExam] = useState(false);

  const [form] = Form.useForm();

  const addQuestion = (values) => {
    setQuestions([...questions, values]);
    setOpenAddQuestion(false);
    form.resetFields();
  };

  const addSubject = (values) => {
    setSubjects([...subjects, values]);
    setOpenAddSubject(false);
  };

  const addBlock = (values) => {
    setBlocks([...blocks, values]);
    setOpenAddBlock(false);
  };

  const createExam = (values) => {
    const exam = {
      id: exams.length + 1,
      name: values.name,
      subject: values.subject,
      size: values.size,
      date: new Date().toLocaleDateString(),
    };

    setExams([...exams, exam]);
    setOpenCreateExam(false);
  };

  const questionColumns = [
    { title: "Mã câu", dataIndex: "code" },
    { title: "Nội dung", dataIndex: "content" },
    {
      title: "Thông tin phân loại",
      render: (r) => `${r.subject} - ${r.block}`,
    },
    {
      title: "Mức độ",
      dataIndex: "level",
      render: (t) => {
        if (t === "Dễ") return <Tag color="green">Dễ</Tag>;
        if (t === "Trung bình") return <Tag color="orange">Trung bình</Tag>;
        if (t === "Khó") return <Tag color="red">Khó</Tag>;
      },
    },
  ];

  const examColumns = [
    { title: "Mã đề", dataIndex: "id" },
    { title: "Tên đề thi", dataIndex: "name" },
    { title: "Môn học", dataIndex: "subject" },
    { title: "Quy mô", dataIndex: "size" },
    { title: "Ngày tạo", dataIndex: "date" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý Ngân hàng Đề thi</h2>

      {/* DASHBOARD */}
      <Row gutter={20}>
        <Col span={6}>
          <Card>
            <h3>Kho câu hỏi</h3>
            <h2>{questions.length}</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <h3>Đề thi lưu trữ</h3>
            <h2>{exams.length}</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <h3>Môn học</h3>
            <h2>{subjects.length}</h2>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <h3>Khối kiến thức</h3>
            <h2>{blocks.length}</h2>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 30 }}>

        <Row justify="space-between" style={{ marginBottom: 20 }}>
          <h2>Ngân hàng Đề thi & Câu hỏi</h2>

          <div>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => setOpenAddBlock(true)}
            >
              Khối kiến thức
            </Button>

            <Button
              style={{ marginRight: 10 }}
              onClick={() => setOpenAddSubject(true)}
            >
              Môn học
            </Button>

            <Button
              type="primary"
              onClick={() => setOpenAddQuestion(true)}
            >
              Thêm câu hỏi
            </Button>
          </div>
        </Row>

        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
        >
          <TabPane tab="Ngân hàng câu hỏi" key="questions">

            <Table
              columns={questionColumns}
              dataSource={questions}
              rowKey={(r, i) => i}
              locale={{ emptyText: "No data" }}
            />

            {/* GENERATOR */}
            <Card
              style={{
                marginTop: 30,
                textAlign: "center",
                background: "#f5f6ff",
              }}
            >
              <h2>Trình tạo đề thi thông minh</h2>
              <p>
                Hệ thống sẽ tự động chọn câu hỏi dựa trên cấu trúc
              </p>

              <Button
                type="primary"
                size="large"
                onClick={() => setOpenCreateExam(true)}
              >
                Bắt đầu tạo đề ngay
              </Button>
            </Card>

          </TabPane>

          <TabPane tab="Đề thi đã lưu" key="exams">

            <Table
              columns={examColumns}
              dataSource={exams}
              rowKey="id"
              locale={{ emptyText: "No data" }}
            />

          </TabPane>
        </Tabs>
      </Card>

      {/* ADD QUESTION MODAL */}
      <Modal
        title="Thêm mới Câu hỏi"
        open={openAddQuestion}
        onCancel={() => setOpenAddQuestion(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={addQuestion} form={form}>

          <Form.Item name="code" label="Mã câu">
            <Input placeholder="VD: Q001" />
          </Form.Item>

          <Form.Item name="level" label="Mức độ">
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
            </Select>
          </Form.Item>

          <Form.Item name="subject" label="Thuộc môn">
            <Select>
              {subjects.map((s, i) => (
                <Option key={i} value={s.name}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="block" label="Khối kiến thức">
            <Select>
              {blocks.map((b, i) => (
                <Option key={i} value={b.name}>
                  {b.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <TextArea rows={4} />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form>
      </Modal>

      {/* ADD SUBJECT */}
      <Modal
        title="Thêm mới Môn học"
        open={openAddSubject}
        onCancel={() => setOpenAddSubject(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={addSubject}>
          <Form.Item name="code" label="Mã môn">
            <Input />
          </Form.Item>

          <Form.Item name="credit" label="Số tín chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Tên môn">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form>
      </Modal>

      {/* ADD BLOCK */}
      <Modal
        title="Thêm mới Khối kiến thức"
        open={openAddBlock}
        onCancel={() => setOpenAddBlock(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={addBlock}>
          <Form.Item name="name" label="Tên khối">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form>
      </Modal>

      {/* CREATE EXAM */}
      <Modal
        title="Thêm mới Trình tạo đề thi"
        open={openCreateExam}
        onCancel={() => setOpenCreateExam(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={createExam}>

          <Form.Item name="name" label="Tiêu đề đề thi">
            <Input />
          </Form.Item>

          <Form.Item name="subject" label="Áp dụng môn học">
            <Select>
              {subjects.map((s, i) => (
                <Option key={i} value={s.name}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="size" label="Số câu">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>

        </Form>
      </Modal>
    </div>
  );
}
