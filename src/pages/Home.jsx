import { Button, Typography, Layout, Row, Col, Card, Space, Divider, List, Avatar } from 'antd';
import { 
  DashboardOutlined, 
  CheckCircleOutlined, 
  FileSearchOutlined, 
  BarChartOutlined, 
  CalendarOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const features = [
  {
    icon: <FileSearchOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    title: 'Track Applications',
    description: 'Keep track of all your job applications in one place. Never lose track of where you applied again.'
  },
  {
    icon: <CalendarOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
    title: 'Manage Interviews',
    description: 'Track interview dates, preparation notes, and follow-ups to stay organized during your job search.'
  },
  {
    icon: <BarChartOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
    title: 'Visualize Progress',
    description: 'See statistics and visualizations of your job search progress to identify what\'s working and what\'s not.'
  },
  {
    icon: <CheckCircleOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
    title: 'Stay Organized',
    description: 'Keep all your job search materials organized and easily accessible when you need them.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    content: 'JTrack helped me land my dream job! I was able to keep track of all my applications and never missed a follow-up.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'UX Designer',
    content: 'The visualization features helped me understand which job boards were working best for me. Highly recommend!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    content: 'JTrack made my job search so much more organized. I could easily see which applications needed follow-up.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { darkMode } = useThemeContext();
  
  return (
    <Content>
      {/* Hero Section */}
      <div style={{ 
        background: darkMode 
          ? 'linear-gradient(135deg, #001529 0%, #20124d 100%)' 
          : 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        padding: '80px 24px',
        textAlign: 'center',
        color: 'white',
        boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease'
      }}>
        <Row justify="center">
          <Col xs={24} md={16} lg={12}>
            <Title style={{ color: 'white', fontSize: '48px', marginBottom: '24px' }}>
              Track Your Job Applications with Ease
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px', marginBottom: '32px' }}>
              JTrack helps you organize your job search, track applications, and land your dream job faster.
            </Paragraph>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                icon={<DashboardOutlined />}
                onClick={() => navigate('/dashboard')}
                style={{ 
                  height: '48px', 
                  padding: '0 32px',
                  fontSize: '16px',
                  background: darkMode ? '#141414' : 'white',
                  color: '#1890ff',
                  borderColor: darkMode ? '#141414' : 'white'
                }}
              >
                Go to Dashboard
              </Button>
              <Button 
                type="default" 
                size="large"
                ghost
                onClick={() => navigate('/add')}
                style={{ 
                  height: '48px', 
                  padding: '0 32px',
                  fontSize: '16px',
                  borderColor: 'white',
                  color: 'white'
                }}
              >
                Add New Job
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      
      {/* Features Section */}
      <div style={{ 
        padding: '80px 24px', 
        background: darkMode ? '#141414' : '#f5f5f5',
        transition: 'background-color 0.3s ease'
      }}>
        <Row justify="center" style={{ marginBottom: '48px' }}>
          <Col xs={24} md={16}>
            <Title level={2} style={{ 
              textAlign: 'center', 
              marginBottom: '16px',
              color: darkMode ? 'rgba(255, 255, 255, 0.85)' : undefined
            }}>
              Features to Supercharge Your Job Search
            </Title>
            <Paragraph style={{ 
              textAlign: 'center', 
              fontSize: '16px', 
              color: darkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
            }}>
              JTrack provides all the tools you need to organize and optimize your job search process
            </Paragraph>
          </Col>
        </Row>
        
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  backgroundColor: darkMode ? '#1f1f1f' : '#fff'
                }}
                styles={{ body: { padding: '32px 24px' } }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {feature.icon}
                  <Title level={4} style={{ color: darkMode ? 'rgba(255, 255, 255, 0.85)' : undefined }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: darkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)' }}>
                    {feature.description}
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      
      {/* Call to Action */}
      <div style={{ 
        padding: '80px 24px', 
        textAlign: 'center',
        background: darkMode ? '#141414' : '#fff',
        transition: 'background-color 0.3s ease'
      }}>
        <Row justify="center">
          <Col xs={24} md={16} lg={12}>
            <Title level={2} style={{ 
              marginBottom: '24px',
              color: darkMode ? 'rgba(255, 255, 255, 0.85)' : undefined
            }}>
              Ready to Organize Your Job Search?
            </Title>
            <Paragraph style={{ 
              fontSize: '16px', 
              color: darkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)', 
              marginBottom: '32px' 
            }}>
              Start tracking your job applications today and increase your chances of landing your dream job.
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/dashboard')}
              style={{ 
                height: '48px', 
                padding: '0 32px',
                fontSize: '16px'
              }}
            >
              Get Started Now <RightOutlined />
            </Button>
          </Col>
        </Row>
      </div>
      
      {/* Testimonials */}
      <div style={{ 
        padding: '80px 24px', 
        background: darkMode ? '#141414' : '#f5f5f5',
        transition: 'background-color 0.3s ease'
      }}>
        <Row justify="center" style={{ marginBottom: '48px' }}>
          <Col xs={24} md={16}>
            <Title level={2} style={{ 
              textAlign: 'center', 
              marginBottom: '16px',
              color: darkMode ? 'rgba(255, 255, 255, 0.85)' : undefined
            }}>
              What Our Users Say
            </Title>
          </Col>
        </Row>
        
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={18} lg={16}>
            <List
              grid={{
                gutter: 32,
                xs: 1,
                sm: 1,
                md: 3,
                lg: 3,
                xl: 3,
              }}
              dataSource={testimonials}
              renderItem={item => (
                <List.Item>
                  <Card 
                    hoverable 
                    style={{ 
                      height: '100%',
                      backgroundColor: darkMode ? '#1f1f1f' : '#fff'
                    }}
                    styles={{ body: { padding: '32px 24px' } }}
                  >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Paragraph style={{ 
                        fontSize: '16px', 
                        fontStyle: 'italic',
                        color: darkMode ? 'rgba(255, 255, 255, 0.85)' : undefined
                      }}>
                        "{item.content}"
                      </Paragraph>
                      <Space>
                        <Avatar src={item.avatar} size={48} />
                        <div>
                          <Text strong style={{ color: darkMode ? 'rgba(255, 255, 255, 0.85)' : undefined }}>
                            {item.name}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.45)' : undefined }}>
                            {item.role}
                          </Text>
                        </div>
                      </Space>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
      
      {/* Footer */}
      <div style={{ 
        padding: '24px', 
        textAlign: 'center', 
        background: darkMode ? '#001529' : '#001529', 
        color: 'rgba(255, 255, 255, 0.65)',
        boxShadow: darkMode ? '0 -2px 8px rgba(0, 0, 0, 0.3)' : '0 -1px 4px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
      }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          {new Date().getFullYear()} JTrack - Your Job Application Tracker
        </Text>
      </div>
    </Content>
  );
};

export default Home;
