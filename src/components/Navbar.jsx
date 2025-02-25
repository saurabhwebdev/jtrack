import { useState } from 'react';
import { Layout, Menu, Button, Drawer, Space, Typography, Avatar, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  DashboardOutlined, 
  PlusOutlined, 
  MenuOutlined,
  BulbOutlined,
  BulbFilled,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/add',
      icon: <PlusOutlined />,
      label: <Link to="/add">Add Job</Link>,
    },
  ];
  
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'theme',
      icon: darkMode ? <BulbFilled /> : <BulbOutlined />,
      label: `${darkMode ? 'Light' : 'Dark'} Mode`,
      onClick: toggleDarkMode,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];
  
  return (
    <Header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: darkMode ? '#141414' : '#fff',
        boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Logo */}
      <div className="logo" style={{ marginRight: '24px' }}>
        <Link to="/">
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            JTrack
          </Title>
        </Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="desktop-menu">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="menu-horizontal"
          style={{ 
            background: 'transparent'
          }}
          theme={darkMode ? 'dark' : 'light'}
        />
        
        <Space style={{ marginLeft: 16 }}>
          {currentUser ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              {currentUser.photoURL ? (
                <Avatar 
                  style={{ 
                    backgroundColor: '#1890ff', 
                    cursor: 'pointer',
                    marginLeft: 8
                  }}
                  src={currentUser.photoURL}
                />
              ) : (
                <Avatar 
                  style={{ 
                    backgroundColor: '#1890ff', 
                    cursor: 'pointer',
                    marginLeft: 8
                  }}
                >
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              )}
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              icon={<LoginOutlined />} 
              onClick={() => navigate('/login')}
              style={{ marginLeft: 8 }}
            >
              Login
            </Button>
          )}
        </Space>
      </div>
      
      {/* Mobile Menu Button */}
      <div className="mobile-menu">
        <Space>
          {currentUser ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              {currentUser.photoURL ? (
                <Avatar 
                  style={{ 
                    backgroundColor: '#1890ff', 
                    cursor: 'pointer',
                    marginLeft: 8,
                    marginRight: 8
                  }}
                  src={currentUser.photoURL}
                />
              ) : (
                <Avatar 
                  style={{ 
                    backgroundColor: '#1890ff', 
                    cursor: 'pointer',
                    marginLeft: 8,
                    marginRight: 8
                  }}
                >
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              )}
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              icon={<LoginOutlined />} 
              onClick={() => navigate('/login')}
              style={{ marginLeft: 8, marginRight: 8 }}
            >
              Login
            </Button>
          )}
          
          <Button 
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
          />
        </Space>
        
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          theme={darkMode ? 'dark' : 'light'}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={() => setMobileMenuOpen(false)}
            theme={darkMode ? 'dark' : 'light'}
          />
          
          {!currentUser && (
            <div style={{ marginTop: 16, padding: '0 16px' }}>
              <Button 
                type="primary" 
                icon={<LoginOutlined />} 
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                style={{ width: '100%' }}
              >
                Login
              </Button>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Theme Mode:</span>
                <Button 
                  type="text"
                  icon={darkMode ? <BulbFilled /> : <BulbOutlined />}
                  onClick={toggleDarkMode}
                >
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </Header>
  );
};

export default Navbar;
