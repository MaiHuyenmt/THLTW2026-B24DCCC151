import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { } = Input;

interface Tag {
  id: number;
  name: string;
  postCount: number;
}

const TagsManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blog/tags');
      setTags(response.data);
    } catch (error) {
      message.error('Lỗi khi tải thẻ');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    form.setFieldsValue(tag);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/blog/tags/${id}`);
      message.success('Xóa thẻ thành công');
      fetchTags();
    } catch (error) {
      message.error('Lỗi khi xóa thẻ');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTag) {
        await axios.put(`/api/blog/tags/${editingTag.id}`, values);
        message.success('Cập nhật thẻ thành công');
      } else {
        await axios.post('/api/blog/tags', values);
        message.success('Thêm thẻ thành công');
      }
      setModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error('Lỗi khi lưu thẻ');
    }
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Tag) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: '8px' }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thẻ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>Quản lý thẻ</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm thẻ
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              {editingTag ? 'Cập nhật' : 'Thêm'}
            </Button>
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagsManagement;