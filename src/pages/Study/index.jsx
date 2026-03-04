import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Progress,
  Typography,
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tag,
  message,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Study() {
  const currentMonth = dayjs().format('MM/YYYY');

  const [subjects, setSubjects] = useState(
    JSON.parse(localStorage.getItem('subjects')) || [
      'Toán',
      'Văn',
      'Anh',
      'Khoa học',
      'Công nghệ',
    ]
  );
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const [monthlyGoals, setMonthlyGoals] = useState(
    JSON.parse(localStorage.getItem('monthlyGoals')) || {
        Toán: 0,
        Văn: 0,
        Anh: 0,
        'Khoa học': 0,
        'Công nghệ': 0,
    }
    );


  const [logs, setLogs] = useState(
    JSON.parse(localStorage.getItem('logs')) || []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    const savedGoals = localStorage.getItem('monthlyGoals');
    if (savedGoals) {
        setMonthlyGoals(JSON.parse(savedGoals));
  }
}, []);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  // Tính tổng giờ học theo môn
  const getTotalHours = (subject) => {
    return logs
      .filter((log) => log.subject === subject)
      .reduce((sum, log) => sum + Number(log.duration), 0);
  };

  const handleAddLog = (values) => {
    const newLog = {
      ...values,
      date: values.date.format('DD/MM/YYYY'),
    };

    setLogs([...logs, newLog]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('Thêm lịch học thành công!');
  };

  const handleDeleteLog = (index) => {
    const newLogs = [...logs];
    newLogs.splice(index, 1);
    setLogs(newLogs);
  };

  const handleAddSubject = () => {
    if (!newSubject) return;
    setSubjects([...subjects, newSubject]);
    setNewSubject('');
  };

  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'subject',
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
    },
    {
      title: 'Thời lượng (giờ)',
      dataIndex: 'duration',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
    },
    {
      title: 'Thao tác',
      render: (_, __, index) => (
        <Button danger onClick={() => handleDeleteLog(index)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* MỤC TIÊU THÁNG */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Title level={4}>🎯 Mục tiêu tháng {currentMonth}</Title>
          <Button onClick={() => setIsGoalModalOpen(true)}>
            ⚙ Thiết lập
          </Button>
        </Row>

        <Row gutter={[16, 16]}>
          {subjects.map((subject) => {
            const total = getTotalHours(subject);
            const goal =monthlyGoals[subject] || 0;

            const percent =
            goal > 0 ? Math.min((total / goal) * 100, 100) : 0;

            return (
              <Col span={6} key={subject}>
                <Card size="small">
                  <Title level={5}>{subject}</Title>
                  <Text type="secondary">Đang thực hiện</Text>
                  <Progress percent={percent} />
                  <Text>Đã học: {total}h</Text>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* NHẬT KÝ HỌC */}
      <Card
        title="📘 Nhật ký & Tiến độ học tập"
        extra={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            + Thêm lịch học
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={columns}
          dataSource={logs}
          locale={{ emptyText: 'No data' }}
          rowKey={(record, index) => index}
        />
      </Card>

      {/* DANH MỤC MÔN HỌC */}
      <Card title="Danh mục Môn học">
        <Input
          placeholder="Nhập tên môn học mới..."
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          style={{ width: 300, marginRight: 10 }}
        />
        <Button type="primary" onClick={handleAddSubject}>
          + Thêm môn
        </Button>

        <div style={{ marginTop: 16 }}>
          {subjects.map((subject, index) => (
            <Tag
              key={index}
              closable
              onClose={() =>
                setSubjects(subjects.filter((s) => s !== subject))
              }
            >
              {subject}
            </Tag>
          ))}
        </div>
      </Card>

      {/* MODAL THÊM LỊCH */}
      <Modal
        title="Ghi chú buổi học mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
       >
       <Form
            form={form}
            layout="vertical"
            onFinish={handleAddLog}
       >
        {/* MÔN HỌC */}
        <Form.Item
        name="subject"
        label="Môn học"
        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
        <Select placeholder="Chọn môn học">
            {subjects.map((subject) => (
            <Select.Option key={subject} value={subject}>
                {subject}
            </Select.Option>
            ))}
        </Select>
        </Form.Item>

        {/* NGÀY + THỜI LƯỢNG */}
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item
            name="date"
            label="Ngày học"
            rules={[{ required: true, message: 'Chọn ngày học' }]}
            >
            <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
            />
            </Form.Item>
        </Col>

        <Col span={12}>
            <Form.Item
            name="duration"
            label="Thời lượng (giờ)"
            rules={[{ required: true, message: 'Nhập thời lượng' }]}
            >
            <Input type="number" placeholder="1.0" />
            </Form.Item>
        </Col>
        </Row>

        {/* NỘI DUNG */}
        <Form.Item
        name="content"
        label="Nội dung đã học"
        rules={[{ required: true, message: 'Nhập nội dung học' }]}
        >
        <Input.TextArea
            rows={3}
            placeholder="Ví dụ: Giải bài tập chương 1, Học từ vựng Unit 5..."
        />
        </Form.Item>

        {/* GHI CHÚ */}
        <Form.Item
        name="note"
        label="Ghi chú thêm"
        >
        <Input.TextArea
            rows={2}
            placeholder="Khó khăn gặp phải, kiến thức cần ôn lại..."
        />
        </Form.Item>

        {/* BUTTONS */}
        <div style={{ textAlign: 'right' }}>
        <Button
            style={{ marginRight: 8 }}
            onClick={() => setIsModalOpen(false)}
        >
            Hủy
        </Button>

        <Button type="primary" htmlType="submit">
            Lưu thông tin
        </Button>
        </div>
        </Form>
        </Modal>

    <Modal
  title="Thiết lập mục tiêu học tập hàng tháng (Giờ)"
  open={isGoalModalOpen}
  onCancel={() => setIsGoalModalOpen(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsGoalModalOpen(false)}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => {
        localStorage.setItem(
          'monthlyGoals',
          JSON.stringify(monthlyGoals)
        );
        message.success(
          'Đã cập nhật mục tiêu học tập tháng này'
        );
        setIsGoalModalOpen(false);
      }}
    >
      Cập nhật mục tiêu
    </Button>,
  ]}
>
  {subjects.map((subject) => (
    <div
      key={subject}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <div style={{ width: 100 }}>{subject}</div>

      <InputNumber
        min={0}
        value={monthlyGoals[subject] || 0}
        onChange={(value) =>
          setMonthlyGoals({
            ...monthlyGoals,
            [subject]: value,
          })
        }
      />

      <span style={{ marginLeft: 8 }}>giờ/tháng</span>
    </div>
  ))}
</Modal>
        
    </div>
  );
}
