import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Card, Row, Col, Space, Typography, Breadcrumb } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, HomeOutlined, ReadOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface Post {
  id: number;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  tags: number[];
  viewCount: number;
  createdAt: string;
}

interface Tag {
  id: number;
  name: string;
}

const PostsManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form] = Form.useForm();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetch all posts including drafts
      const response = await axios.get('/api/blog/posts', { params: { limit: 1000 } });
      setPosts(response.data.data);
    } catch (error) {
      message.error('Lỗi khi tải bài viết');
    }
    setLoading(false);
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/blog/tags');
      setTags(response.data);
    } catch (error) {
      message.error('Lỗi khi tải thẻ');
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  }, [posts, searchText, statusFilter]);

  const handleAdd = () => {
    setEditingPost(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    form.setFieldsValue({
      ...post,
      tags: post.tags,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/blog/posts/${id}`);
      message.success('Xóa bài viết thành công');
      fetchPosts();
    } catch (error) {
      message.error('Lỗi khi xóa bài viết');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingPost) {
        await axios.put(`/api/blog/posts/${editingPost.id}`, values);
        message.success('Cập nhật bài viết thành công');
      } else {
        await axios.post('/api/blog/posts', values);
        message.success('Thêm bài viết thành công');
      }
      setModalVisible(false);
      fetchPosts();
    } catch (error) {
      message.error('Lỗi khi lưu bài viết');
    }
  };

  const getTagNames = (tagIds: number[]) => {
    return tagIds.map(id => tags.find(t => t.id === id)?.name).filter(Boolean);
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: number[]) => (
        <div>
          {getTagNames(tags).map(tagName => (
            <Tag key={tagName}>{tagName}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Post) => (
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
            title="Bạn có chắc muốn xóa bài viết này?"
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
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
            <span>Trang chủ</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog">
            <ReadOutlined />
            <span>Blog</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <SettingOutlined />
            <span>Quản lý bài viết</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
            📝 Quản lý bài viết
          </Title>
          <Text type="secondary">
            Quản lý tất cả bài viết trên blog của bạn
          </Text>
        </div>

        {/* Filters and Search */}
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Lọc theo trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="published">Đã đăng</Option>
                <Option value="draft">Nháp</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={10} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                size="large"
                style={{ borderRadius: '8px' }}
              >
                Thêm bài viết mới
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
              <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                {posts.length}
              </Title>
              <Text type="secondary">Tổng bài viết</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
              <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                {posts.filter(p => p.status === 'published').length}
              </Title>
              <Text type="secondary">Đã đăng</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
              <Title level={3} style={{ color: '#faad14', margin: 0 }}>
                {posts.filter(p => p.status === 'draft').length}
              </Title>
              <Text type="secondary">Nháp</Text>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card style={{ borderRadius: '12px' }}>
          <Table
            columns={columns}
            dataSource={filteredPosts}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Modal */}
        <Modal
          title={
            <div style={{ fontSize: '18px', fontWeight: '600' }}>
              {editingPost ? '✏️ Sửa bài viết' : '➕ Thêm bài viết mới'}
            </div>
          }
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={900}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: 'draft',
              tags: [],
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                  <Input placeholder="Nhập tiêu đề bài viết" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                >
                  <Input placeholder="nhap-tieu-de-bai-viet" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="summary"
              label="Tóm tắt"
              rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
            >
              <TextArea
                rows={3}
                placeholder="Mô tả ngắn gọn về nội dung bài viết..."
              />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung (Markdown)"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
              <TextArea
                rows={12}
                placeholder="# Tiêu đề chính

## Tiêu đề phụ

Nội dung bài viết...

\`\`\`javascript
console.log('Code example');
\`\`\`
"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="coverImage"
                  label="Ảnh đại diện (URL)"
                  rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
                >
                  <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="author"
                  label="Tác giả"
                  rules={[{ required: true, message: 'Vui lòng nhập tác giả' }]}
                >
                  <Input placeholder="Tên tác giả" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="tags"
                  label="Thẻ"
                >
                  <Select
                    mode="multiple"
                    placeholder="Chọn thẻ cho bài viết"
                    style={{ width: '100%' }}
                  >
                    {tags.map(tag => (
                      <Option key={tag.id} value={tag.id}>
                        {tag.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="draft">📝 Nháp</Option>
                    <Option value="published">🌐 Đã đăng</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingPost ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PostsManagement;