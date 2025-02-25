import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const { login, loginWithGoogle, error, resetPassword } = useAuth();
  const { darkMode } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetEmail(form.getFieldValue('email') || '');
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
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
            Welcome Back
          </Title>
          <Text type="secondary" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.45)' : undefined }}>
            Log in to your JTrack account
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

        {resetSent && (
          <Alert
            message="Password Reset Email Sent"
            description="Check your email for instructions to reset your password."
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {resetEmail && !resetSent && (
          <Form
            layout="vertical"
            onFinish={handleResetPassword}
            style={{ marginBottom: 24 }}
          >
            <Form.Item
              name="resetEmail"
              rules={[{ required: true, message: 'Please enter your email' }]}
              initialValue={resetEmail}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
                size="large" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              loading={loading}
            >
              Send Reset Link
            </Button>
            <Button 
              type="link" 
              block 
              onClick={() => setResetEmail('')}
              style={{ marginTop: 8 }}
            >
              Back to Login
            </Button>
          </Form>
        )}

        {!resetEmail && (
          <>
            <Form
              form={form}
              name="login"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Email" 
                  size="large" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
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
                  Log in
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Button type="link" onClick={() => setResetEmail(form.getFieldValue('email') || '')}>
                Forgot password?
              </Button>
            </div>

            <Divider plain>
              <Text type="secondary" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.45)' : undefined }}>
                Or
              </Text>
            </Divider>

            <Button 
              icon={<GoogleOutlined />} 
              block 
              size="large" 
              onClick={handleGoogleLogin}
              style={{ marginBottom: 24 }}
              loading={loading}
            >
              Continue with Google
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: darkMode ? 'rgba(255, 255, 255, 0.65)' : undefined }}>
                Don't have an account?{' '}
                <Link to="/signup">Sign up</Link>
              </Text>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Login;
