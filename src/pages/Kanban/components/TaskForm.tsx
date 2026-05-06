import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

export default () => {
  const { visible, setVisible, currentTask, isEdit, addTask, updateTask } = useModel('kanban');
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && currentTask) {
      form.setFieldsValue({
        ...currentTask,
        deadline: moment(currentTask.deadline),
        tags: currentTask.tags.join(', '),
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ status: 'todo' });
    }
  }, [visible, currentTask, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const taskData = {
        ...values,
        deadline: values.deadline.toISOString(),
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
      };
      if (isEdit && currentTask) {
        updateTask({ ...currentTask, ...taskData });
      } else {
        addTask(taskData);
      }
      setVisible(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa task' : 'Tạo task mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={640}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên task"
          rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả task' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
        >
          <Select>
            <Option value="high">Cao</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="low">Thấp</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
          <Select>
            <Option value="todo">Cần làm</Option>
            <Option value="inprogress">Đang làm</Option>
            <Option value="done">Hoàn thành</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tags" label="Tags (ngăn cách bằng dấu phẩy)">
          <Input placeholder="Frontend, Testing, UI/UX" />
        </Form.Item>
      </Form>
    </Modal>
  );
};