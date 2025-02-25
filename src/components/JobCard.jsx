import { Card, Typography, Tag, Space, Button, Dropdown, Menu, Modal } from 'antd';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useJobContext } from '../context/JobContext';

const { Title, Text } = Typography;

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { deleteJob } = useJobContext();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  console.log("JobCard received job:", job);
  
  // Guard against undefined job prop
  if (!job) {
    console.error("JobCard received undefined job");
    return null;
  }
  
  // Log the job properties to help debug
  console.log("Job properties:", {
    id: job.id,
    company: job.company,
    position: job.position,
    status: job.status,
    dateApplied: job.dateApplied
  });
  
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
  
  const formatDate = (dateValue) => {
    if (!dateValue) return 'No date';
    
    try {
      // For Firestore timestamps that come as objects with seconds and nanoseconds
      if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        return dayjs(new Date(dateValue.seconds * 1000)).format('MMM D, YYYY');
      }
      
      // For regular date strings
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return dayjs(date).format('MMM D, YYYY');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };
  
  // Capitalize first letter of status
  const capitalizeStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${job.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsDeleteModalVisible(true);
  };
  
  const confirmDelete = async () => {
    try {
      console.log("Deleting job with ID:", job.id);
      await deleteJob(job.id);
      console.log("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsDeleteModalVisible(false);
    }
  };
  
  const cancelDelete = (e) => {
    if (e) e.stopPropagation();
    setIsDeleteModalVisible(false);
  };

  const actionItems = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: handleEdit
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete
    }
  ];

  return (
    <>
      <Card 
        hoverable
        onClick={() => navigate(`/job/${job.id}`)}
        style={{ height: '100%' }}
        extra={
          <Dropdown 
            menu={{ items: actionItems }} 
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<EllipsisOutlined />} 
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        }
        actions={[
          <Button 
            type="link" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/job/${job.id}`);
            }}
          >
            View Details <RightOutlined />
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={4} style={{ margin: 0 }}>{job.position || 'Unknown Position'}</Title>
            {job.status && <Tag color={getStatusColor(job.status)}>{capitalizeStatus(job.status)}</Tag>}
          </div>
          
          <Text strong>{job.company || 'Unknown Company'}</Text>
          
          {job.location && (
            <Text type="secondary">
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              {job.location}
            </Text>
          )}
          
          <Text type="secondary">
            <CalendarOutlined style={{ marginRight: 8 }} />
            Applied: {formatDate(job.dateApplied)}
          </Text>
        </Space>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Job Application"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        maskClosable={false}
      >
        <p>Are you sure you want to delete this job application? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default JobCard;
