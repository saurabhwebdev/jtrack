import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Typography, 
  Card, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Divider, 
  Row, 
  Col,
  Popconfirm,
  Spin,
  Empty,
  Timeline
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined,
  LinkOutlined,
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import { useJobContext } from '../context/JobContext';
import { getJobById } from '../firebase/firebaseService';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, deleteJob, loading: jobsLoading } = useJobContext();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        // First try to find the job in the existing jobs array
        const foundJob = jobs.find(j => j.id === id);
        if (foundJob) {
          setJob(foundJob);
          setError(null);
        } else {
          // If not found in the array, fetch it directly from Firestore
          const fetchedJob = await getJobById(id);
          setJob(fetchedJob);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, jobs]);
  
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };
  
  const handleDelete = () => {
    deleteJob(id);
    navigate('/dashboard');
  };
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  // Status colors
  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    const statusMap = {
      applied: 'blue',
      interviewing: 'orange',
      offered: 'green',
      rejected: 'red',
      accepted: 'green',
      declined: 'gray'
    };
    return statusMap[status.toLowerCase()] || 'default';
  };
  
  const capitalizeStatus = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to safely format dates
  const safeFormatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    try {
      // For Firestore timestamps that come as objects with seconds and nanoseconds
      if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        return format(new Date(dateValue.seconds * 1000), 'MMM d, yyyy');
      }
      
      // For regular date strings
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Content style={{ padding: '24px', width: '100%' }}>
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Loading job details...</div>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Content style={{ padding: '24px', width: '100%' }}>
          <Button 
            type="primary" 
            onClick={handleBack} 
            style={{ marginBottom: '16px' }}
          >
            Back to Dashboard
          </Button>
          <Card>
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Title level={3}>{error}</Title>
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <Content style={{ padding: '24px', width: '100%' }}>
          <Button 
            type="primary" 
            onClick={handleBack} 
            style={{ marginBottom: '16px' }}
          >
            Back to Dashboard
          </Button>
          <Card>
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Title level={3}>Job not found</Title>
              <Paragraph>The job you're looking for doesn't exist or has been removed.</Paragraph>
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Content style={{ padding: '24px', width: '100%' }}>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack} 
          style={{ marginBottom: '16px' }}
        >
          Back
        </Button>
        
        <Card style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Space direction="vertical" size="small">
                <Space wrap>
                  {job.status && (
                    <Tag color={getStatusColor(job.status)} style={{ fontSize: '14px', padding: '4px 8px' }}>
                      {capitalizeStatus(job.status)}
                    </Tag>
                  )}
                  {job.isReferral && <Tag color="cyan">Referral</Tag>}
                </Space>
                
                <Title level={2} style={{ margin: '8px 0' }}>
                  {job.position}
                </Title>
                
                <Title level={4} style={{ margin: '0', fontWeight: 'normal' }}>
                  {job.company}
                </Title>
              </Space>
            </Col>
            
            <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete this job application?"
                  description="Are you sure you want to delete this job application? This action cannot be undone."
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </Col>
          </Row>
          
          <Divider />
          
          <Descriptions 
            title="Job Details" 
            bordered 
            column={{ xs: 1, sm: 2, md: 3 }}
            labelStyle={{ fontWeight: 'bold' }}
            style={{ marginTop: '24px' }}
          >
            {job.location && (
              <Descriptions.Item label={<Space><EnvironmentOutlined /> Location</Space>}>
                {job.location}
              </Descriptions.Item>
            )}
            
            {job.dateApplied && (
              <Descriptions.Item label={<Space><CalendarOutlined /> Date Applied</Space>}>
                {safeFormatDate(job.dateApplied)}
              </Descriptions.Item>
            )}
            
            {job.salary && (
              <Descriptions.Item label={<Space><DollarOutlined /> Salary</Space>}>
                {job.salary}
              </Descriptions.Item>
            )}
            
            {job.jobUrl && (
              <Descriptions.Item label={<Space><LinkOutlined /> Job URL</Space>}>
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                  View Job Posting
                </a>
              </Descriptions.Item>
            )}
            
            {job.referralName && (
              <Descriptions.Item label="Referral">
                {job.referralName}
              </Descriptions.Item>
            )}
          </Descriptions>
          
          {job.description && (
            <>
              <Title level={4}>Job Description</Title>
              <Card style={{ marginBottom: '24px' }}>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {job.description}
                </Paragraph>
              </Card>
            </>
          )}
          
          {job.notes && (
            <>
              <Title level={4}>Notes</Title>
              <Card style={{ marginBottom: '24px', backgroundColor: '#fffbe6' }}>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {job.notes}
                </Paragraph>
              </Card>
            </>
          )}
          
          <Title level={4}>Application Timeline</Title>
          <Timeline
            mode="left"
            items={[
              {
                label: safeFormatDate(job.createdAt),
                children: 'Application Created',
              },
              ...(job.dateApplied ? [{
                label: safeFormatDate(job.dateApplied),
                children: 'Applied',
                color: 'blue'
              }] : []),
              ...(job.interviewDate ? [{
                label: safeFormatDate(job.interviewDate),
                children: 'Interview Scheduled',
                color: 'purple'
              }] : []),
              ...(job.status === 'offered' ? [{
                label: 'Current',
                children: 'Received Offer',
                color: 'green'
              }] : []),
              ...(job.status === 'accepted' ? [{
                label: 'Current',
                children: 'Accepted Offer',
                color: 'teal'
              }] : []),
              ...(job.status === 'rejected' ? [{
                label: 'Current',
                children: 'Application Rejected',
                color: 'red'
              }] : []),
              ...(job.status === 'declined' ? [{
                label: 'Current',
                children: 'Declined Offer',
                color: 'orange'
              }] : []),
            ]}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default JobDetail;
