import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Alert } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';

const { Title, Text } = Typography;

const Signup = () => {
  const { signup, loginWithGoogle, error } = useAuth();
  const { darkMode } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      return;
    }
    
    setLoading(true);
    try {
      await signup(values.email, values.password, values.name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 64px)',
      padding: '24px',
      background: darkMode ? '#141414' : '#f5f5f5'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          background: darkMode ? '#1f1f1f' : '#fff'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: darkMode ? 'rgba(255, 255, 255, 0.85)' : undefined }}>
            Create Account
          </Title>
          <Text type="secondary" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.45)' : undefined }}>
            Sign up to start tracking your job applications
          </Text>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          name="signup"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Full Name" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              loading={loading}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.45)' : undefined }}>
            Or
          </Text>
        </Divider>

        <Button 
          icon={<GoogleOutlined />} 
          block 
          size="large" 
          onClick={handleGoogleSignup}
          style={{ marginBottom: 24 }}
          loading={loading}
        >
          Continue with Google
        </Button>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: darkMode ? 'rgba(255, 255, 255, 0.65)' : undefined }}>
            Already have an account?{' '}
            <Link to="/login">Log in</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
