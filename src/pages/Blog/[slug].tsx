import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Spin, message, Row, Col, Breadcrumb, Typography, Avatar, Divider } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, ReadOutlined, UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { history, useParams } from 'umi';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  author: string;
  createdAt: string;
  tags: number[];
  viewCount: number;
}

interface Tag {
  id: number;
  name: string;
}

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blog/posts/slug/${slug}`);
      setPost(response.data);
      // Fetch related posts (same tags, exclude current)
      const relatedResponse = await axios.get('/api/blog/posts', {
        params: { tag: response.data.tags[0], limit: 3 }
      });
      setRelatedPosts(relatedResponse.data.data.filter((p: Post) => p.id !== response.data.id));
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
    if (slug) {
      fetchPost();
      fetchTags();
    }
  }, [slug]);

  const getTagNames = (tagIds: number[]) => {
    return tagIds.map(id => tags.find(t => t.id === id)?.name).filter(Boolean);
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!post) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Bài viết không tồn tại</div>;
  }

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
          <Breadcrumb.Item>{post?.title || 'Bài viết'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push('/blog')}
          style={{ marginBottom: '16px' }}
          type="primary"
          ghost
        >
          Quay lại danh sách
        </Button>

        {loading ? (
          <Card style={{ borderRadius: '12px' }}>
            <Spin size="large" />
          </Card>
        ) : post ? (
          <>
            {/* Article Header */}
            <Card
              style={{
                borderRadius: '12px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              cover={
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                  <img
                    alt={post.title}
                    src={post.coverImage}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              }
            >
              <Title level={1} style={{ marginBottom: '16px', textAlign: 'center' }}>
                {post.title}
              </Title>

              {/* Article Meta */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px',
                padding: '16px',
                background: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>{post.author}</Text>
                </div>
                <Divider type="vertical" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarOutlined />
                  <Text>{moment(post.createdAt).format('DD/MM/YYYY')}</Text>
                </div>
                <Divider type="vertical" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EyeOutlined />
                  <Text>{post.viewCount} lượt xem</Text>
                </div>
              </div>

              {/* Tags */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {getTagNames(post.tags).map(tagName => (
                  <Tag
                    key={tagName}
                    style={{
                      margin: '4px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px'
                    }}
                    color="blue"
                  >
                    {tagName}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Article Content */}
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginBottom: '24px'
              }}
            >
              <div style={{
                lineHeight: '1.8',
                fontSize: '16px',
                color: '#333'
              }}>
                <ReactMarkdown remarkPlugins={[remarkGfm as any]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </Card>
          </>
        ) : (
          <Card style={{ borderRadius: '12px', textAlign: 'center', padding: '48px' }}>
            <Title level={3}>Bài viết không tồn tại</Title>
            <Paragraph>Bài viết bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.</Paragraph>
          </Card>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                📚 Bài viết liên quan
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Row gutter={[16, 16]}>
              {relatedPosts.map(relatedPost => (
                <Col xs={24} sm={12} md={8} key={relatedPost.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '100%'
                    }}
                    cover={
                      <img
                        alt={relatedPost.title}
                        src={relatedPost.coverImage}
                        style={{
                          height: '150px',
                          objectFit: 'cover'
                        }}
                      />
                    }
                    onClick={() => history.push(`/blog/${relatedPost.slug}`)}
                  >
                    <Card.Meta
                      title={
                        <Text
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {relatedPost.title}
                        </Text>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {moment(relatedPost.createdAt).format('DD/MM/YYYY')}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            👁️ {relatedPost.viewCount} lượt xem
                          </Text>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;