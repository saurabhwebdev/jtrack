import { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Form, Input, Button, message, Divider, Space, Upload, Modal } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase/config';

const { Title, Text } = Typography;

const Profile = () => {
  const { currentUser, updateEmail, updatePassword, reauthenticate } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [reAuthForm] = Form.useForm();
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || null);
  const [isReAuthModalVisible, setIsReAuthModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      profileForm.setFieldsValue({
        displayName: currentUser.displayName || '',
      });
      emailForm.setFieldsValue({
        email: currentUser.email || '',
      });
      setPhotoURL(currentUser.photoURL || null);
    }
  }, [currentUser, navigate, profileForm, emailForm]);

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: values.displayName,
      });
      message.success('Profile updated successfully');
    } catch (error) {
      message.error(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (values) => {
    setPendingAction(() => async () => {
      setLoading(true);
      try {
        await updateEmail(values.email);
        message.success('Email updated successfully');
        setIsReAuthModalVisible(false);
      } catch (error) {
        message.error(`Failed to update email: ${error.message}`);
      } finally {
        setLoading(false);
      }
    });
    setIsReAuthModalVisible(true);
  };

  const handlePasswordUpdate = async (values) => {
    setPendingAction(() => async () => {
      setLoading(true);
      try {
        await updatePassword(values.password);
        message.success('Password updated successfully');
        passwordForm.resetFields();
        setIsReAuthModalVisible(false);
      } catch (error) {
        message.error(`Failed to update password: ${error.message}`);
      } finally {
        setLoading(false);
      }
    });
    setIsReAuthModalVisible(true);
  };

  const handlePhotoUpload = async (file) => {
    setLoading(true);
    try {
      const fileRef = ref(storage, `profile-photos/${currentUser.uid}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });
      
      setPhotoURL(downloadURL);
      message.success('Profile photo updated successfully');
    } catch (error) {
      message.error(`Failed to upload photo: ${error.message}`);
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleReAuthenticate = async (values) => {
    setLoading(true);
    try {
      await reauthenticate(values.password);
      if (pendingAction) {
        await pendingAction();
      }
    } catch (error) {
      message.error(`Authentication failed: ${error.message}`);
      setIsReAuthModalVisible(false);
    } finally {
      setLoading(false);
      reAuthForm.resetFields();
    }
  };

  const handleReAuthCancel = () => {
    setIsReAuthModalVisible(false);
    setPendingAction(null);
    reAuthForm.resetFields();
  };

  return (
    <div style={{ width: '100%', padding: '24px' }}>
      <Title level={2}>User Profile</Title>
      
      <Card style={{ marginBottom: 24, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          {photoURL ? (
            <Avatar 
              size={80} 
              src={photoURL}
              style={{ marginRight: 24, backgroundColor: '#1890ff' }}
            />
          ) : (
            <Avatar 
              size={80} 
              style={{ marginRight: 24, backgroundColor: '#1890ff' }}
            >
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          )}
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {currentUser?.displayName || 'User'}
            </Title>
            <Text type="secondary">{currentUser?.email}</Text>
            <div style={{ marginTop: 12 }}>
              <Upload 
                beforeUpload={handlePhotoUpload}
                showUploadList={false}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={loading}
                >
                  Change Photo
                </Button>
              </Upload>
            </div>
          </div>
        </div>
        
        <Divider />
        
        <Title level={4}>Update Profile</Title>
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          style={{ maxWidth: '100%' }}
        >
          <Form.Item
            name="displayName"
            label="Display Name"
            rules={[{ required: true, message: 'Please enter your display name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Display Name" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card style={{ width: '100%' }}>
          <Title level={4}>Update Email</Title>
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleEmailUpdate}
            style={{ maxWidth: '100%' }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Email
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        <Card style={{ width: '100%' }}>
          <Title level={4}>Change Password</Title>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordUpdate}
            style={{ maxWidth: '100%' }}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>

      {/* Re-authentication Modal */}
      <Modal
        title="Confirm Your Identity"
        open={isReAuthModalVisible}
        onCancel={handleReAuthCancel}
        footer={null}
      >
        <p>For security reasons, please enter your current password to continue.</p>
        <Form
          form={reAuthForm}
          layout="vertical"
          onFinish={handleReAuthenticate}
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Current Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Confirm
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReAuthCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
