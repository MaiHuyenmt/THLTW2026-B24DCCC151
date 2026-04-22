import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Pagination, Input, Tag, Spin, message, Skeleton, Breadcrumb, Typography } from 'antd';
import { SearchOutlined, HomeOutlined, ReadOutlined } from '@ant-design/icons';
import { history } from 'umi';
import axios from 'axios';
import moment from 'moment';
import { debounce } from 'lodash';

const { Meta } = Card;
const { Search } = Input;
const { Title, Paragraph } = Typography;

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  author: string;
  createdAt: string;
  tags: number[];
  viewCount: number;
}

interface Tag {
  id: number;
  name: string;
  postCount: number;
}

const BlogHome: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const pageSize = 9;

  const fetchPosts = async (page = 1, tag?: number, search?: string) => {
    setLoading(true);
    try {
      const params: any = { page, limit: pageSize };
      if (tag) params.tag = tag;
      if (search) params.search = search;
      const response = await axios.get('/api/blog/posts', { params });
      setPosts(response.data.data);
      setTotal(response.data.total);
      setCurrentPage(page);
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
    fetchTags();
    fetchPosts();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
      fetchPosts(1, selectedTag || undefined, query || undefined);
    }, 300),
    [selectedTag]
  );

  const handleTagClick = (tagId: number | null) => {
    setSelectedTag(tagId);
    fetchPosts(1, tagId || undefined, searchQuery || undefined);
  };

  const handlePageChange = (page: number) => {
    fetchPosts(page, selectedTag || undefined, searchQuery || undefined);
  };

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const getTagNames = (tagIds: number[]) => {
    return tagIds.map(id => tags.find(t => t.id === id)?.name).filter(Boolean);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
            <span>Trang chủ</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <ReadOutlined />
            <span>Blog</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{ marginBottom: '8px', color: '#1890ff' }}>
            Blog Cá Nhân
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Chia sẻ kiến thức, kinh nghiệm và những điều thú vị trong cuộc sống
          </Paragraph>
        </div>

        {/* Tìm kiếm */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Search
            placeholder="Tìm kiếm bài viết..."
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: '500px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            allowClear
          />
        </div>

        {/* Tags Filter */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            <Tag
              color={selectedTag === null ? 'blue' : undefined}
              style={{
                cursor: 'pointer',
                padding: '6px 12px',
                fontSize: '14px',
                borderRadius: '20px',
                transition: 'all 0.3s',
                border: selectedTag === null ? '2px solid #1890ff' : '1px solid #d9d9d9'
              }}
              onClick={() => handleTagClick(null)}
            >
              Tất cả
            </Tag>
            {tags.map(tag => (
              <Tag
                key={tag.id}
                color={selectedTag === tag.id ? 'blue' : undefined}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: '14px',
                  borderRadius: '20px',
                  transition: 'all 0.3s',
                  border: selectedTag === tag.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                }}
                onClick={() => handleTagClick(tag.id)}
              >
                {tag.name} ({tag.postCount})
              </Tag>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <Spin spinning={loading && posts.length === 0}>
          <Row gutter={[24, 24]}>
            {loading && posts.length === 0
              ? // Loading skeletons
                Array.from({ length: pageSize }).map((_, index) => (
                  <Col xs={24} sm={12} lg={8} key={index}>
                    <Card
                      style={{ borderRadius: '12px', overflow: 'hidden' }}
                      cover={
                        <Skeleton.Image
                          style={{ width: '100%', height: '200px' }}
                        />
                      }
                    >
                      <Skeleton active />
                    </Card>
                  </Col>
                ))
              : // Actual posts
                posts.map(post => (
                  <Col xs={24} sm={12} lg={8} key={post.id}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        height: '100%'
                      }}
                      cover={
                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                          <img
                            alt={post.title}
                            src={post.coverImage}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          />
                        </div>
                      }
                      onClick={() => history.push(`/blog/${post.slug}`)}
                    >
                      <Meta
                        title={
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '8px',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {post.title}
                          </div>
                        }
                        description={
                          <div>
                            <Paragraph
                              ellipsis={{ rows: 2, expandable: false }}
                              style={{ marginBottom: '12px', color: '#666' }}
                            >
                              {post.summary}
                            </Paragraph>
                            <div style={{ marginBottom: '12px' }}>
                              {getTagNames(post.tags).map(tagName => (
                                <Tag
                                  key={tagName}
                                  style={{
                                    marginRight: '6px',
                                    marginBottom: '4px',
                                    borderRadius: '12px',
                                    fontSize: '12px'
                                  }}
                                >
                                  {tagName}
                                </Tag>
                              ))}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#999',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span>{post.author}</span>
                              <span>{moment(post.createdAt).format('DD/MM/YYYY')}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                              👁️ {post.viewCount} lượt xem
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
          </Row>
        </Spin>

        {/* Pagination */}
        {total > pageSize && (
          <div style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '24px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} bài viết`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHome;