import React from 'react';
import { Card, Avatar, Row, Col, Tag, Breadcrumb, Typography } from 'antd';
import { UserOutlined, MailOutlined, GlobalOutlined, GithubOutlined, HomeOutlined, ReadOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
  const author = {
    name: 'Nguyễn Văn A',
    bio: 'Tôi là một lập trình viên full-stack với niềm đam mê về công nghệ web. Tôi thích chia sẻ kiến thức và kinh nghiệm qua blog cá nhân này.',
    avatar: 'https://via.placeholder.com/150',
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'Docker'],
    email: 'nguyenvana@example.com',
    website: 'https://nguyenvana.dev',
    github: 'https://github.com/nguyenvana',
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
          <Breadcrumb.Item href="/blog">
            <ReadOutlined />
            <span>Blog</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Giới thiệu</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{ marginBottom: '8px', color: '#1890ff' }}>
            Giới thiệu
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Tìm hiểu thêm về tác giả và hành trình của tôi
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Profile Card */}
          <Col xs={24} lg={12}>
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                height: '100%'
              }}
              cover={
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: '120px',
                  borderRadius: '16px 16px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Avatar
                    size={100}
                    src={author.avatar}
                    icon={<UserOutlined />}
                    style={{
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>
              }
            >
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <Title level={2} style={{ marginBottom: '8px' }}>
                  {author.name}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Full-Stack Developer & Tech Enthusiast
                </Text>
              </div>
            </Card>
          </Col>

          {/* Bio Card */}
          <Col xs={24} lg={12}>
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                height: '100%'
              }}
            >
              <Title level={3} style={{ color: '#1890ff', marginBottom: '16px' }}>
                Về tôi
              </Title>
              <Paragraph style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#333',
                marginBottom: '24px'
              }}>
                {author.bio}
              </Paragraph>

              <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
                Kỹ năng chuyên môn
              </Title>
              <div style={{ marginBottom: '24px' }}>
                {author.skills.map(skill => (
                  <Tag
                    key={skill}
                    color="blue"
                    style={{
                      margin: '4px 4px 4px 0',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>

          {/* Contact Card */}
          <Col xs={24}>
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
            >
              <Title level={3} style={{ color: '#1890ff', textAlign: 'center', marginBottom: '24px' }}>
                📬 Liên hệ
              </Title>

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    style={{
                      textAlign: 'center',
                      borderRadius: '12px',
                      border: '1px solid #e8e8e8'
                    }}
                    onClick={() => window.open(`mailto:${author.email}`, '_blank')}
                  >
                    <MailOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                    <div>
                      <Text strong>Email</Text>
                      <br />
                      <Text type="secondary">{author.email}</Text>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    style={{
                      textAlign: 'center',
                      borderRadius: '12px',
                      border: '1px solid #e8e8e8'
                    }}
                    onClick={() => window.open(author.website, '_blank')}
                  >
                    <GlobalOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                    <div>
                      <Text strong>Website</Text>
                      <br />
                      <Text type="secondary">{author.website}</Text>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    hoverable
                    style={{
                      textAlign: 'center',
                      borderRadius: '12px',
                      border: '1px solid #e8e8e8'
                    }}
                    onClick={() => window.open(author.github, '_blank')}
                  >
                    <GithubOutlined style={{ fontSize: '32px', color: '#333', marginBottom: '8px' }} />
                    <div>
                      <Text strong>GitHub</Text>
                      <br />
                      <Text type="secondary">github.com/nguyenvana</Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default About;