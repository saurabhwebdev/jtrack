import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import JobForm from './components/JobForm';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { JobProvider } from './context/JobContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JobProvider>
          <Layout style={{ minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
            <Navbar />
            <Layout.Content style={{ width: '100%', maxWidth: '100%' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/job/:id" 
                  element={
                    <ProtectedRoute>
                      <JobDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add" 
                  element={
                    <ProtectedRoute>
                      <JobForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit/:id" 
                  element={
                    <ProtectedRoute>
                      <JobForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout.Content>
          </Layout>
        </JobProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
