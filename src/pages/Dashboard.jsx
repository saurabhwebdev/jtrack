import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { 
  Layout, 
  Typography, 
  Button, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Select, 
  Input, 
  Empty, 
  Spin, 
  Divider, 
  Table, 
  Tag, 
  Switch, 
  Tooltip,
  Dropdown,
  Modal,
  App
} from 'antd';
import { 
  PlusOutlined, 
  FileSearchOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  AppstoreOutlined,
  UnorderedListOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import { useJobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';

const { Title } = Typography;
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    jobs, 
    loading, 
    error,
    createTestJob,
    deleteJob
  } = useJobContext();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState(() => {
    // Get saved preference from localStorage or default to 'list'
    return localStorage.getItem('jobTrackerViewMode') || 'list';
  });
  
  // For delete confirmation modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  
  // Save view mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('jobTrackerViewMode', viewMode);
  }, [viewMode]);
  
  useEffect(() => {
    let result = [...jobs];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(job => 
        job.status && job.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job => 
        (job.company && job.company.toLowerCase().includes(query)) || 
        (job.position && job.position.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query))
      );
    }
    
    // Sort by date applied (most recent first)
    result.sort((a, b) => {
      // Handle Firestore timestamp objects
      let dateA, dateB;
      
      if (a.dateApplied) {
        if (typeof a.dateApplied === 'object' && a.dateApplied.seconds) {
          dateA = new Date(a.dateApplied.seconds * 1000);
        } else {
          dateA = new Date(a.dateApplied);
        }
      } else {
        dateA = new Date(0);
      }
      
      if (b.dateApplied) {
        if (typeof b.dateApplied === 'object' && b.dateApplied.seconds) {
          dateB = new Date(b.dateApplied.seconds * 1000);
        } else {
          dateB = new Date(b.dateApplied);
        }
      } else {
        dateB = new Date(0);
      }
      
      return dateB - dateA;
    });
    
    setFilteredJobs(result);
  }, [jobs, statusFilter, searchQuery]);
  
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };
  
  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  
  const getStatusCounts = () => {
    const counts = {
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
      accepted: 0,
      declined: 0
    };
    
    jobs.forEach(job => {
      if (job.status && counts.hasOwnProperty(job.status.toLowerCase())) {
        counts[job.status.toLowerCase()]++;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();
  
  // Handle job actions
  const handleEdit = (jobId) => {
    navigate(`/edit/${jobId}`);
  };

  const handleDelete = (jobId) => {
    setJobToDelete(jobId);
    setIsDeleteModalVisible(true);
  };
  
  const confirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      console.log("Deleting job with ID:", jobToDelete);
      await deleteJob(jobToDelete);
      console.log("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsDeleteModalVisible(false);
      setJobToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setJobToDelete(null);
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <App>
      <Content style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2}>Job Applications</Title>
          <div>
            <Button type="primary" onClick={() => navigate('/add')}>
              <PlusOutlined /> Add New Job
            </Button>
            <Button onClick={createTestJob} style={{ marginLeft: 8 }}>
              Create 10 Indian Jobs
            </Button>
            <Tooltip title={viewMode === 'card' ? 'Switch to List View' : 'Switch to Card View'}>
              <Button 
                icon={viewMode === 'card' ? <UnorderedListOutlined /> : <AppstoreOutlined />} 
                onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
                style={{ marginLeft: 8 }}
              />
            </Tooltip>
          </div>
        </div>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Total Applications" 
                value={jobs.length} 
                prefix={<FileSearchOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Active Interviews" 
                value={statusCounts.interviewing} 
                prefix={<FileSearchOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Offers" 
                value={statusCounts.offered + statusCounts.accepted} 
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Rejections" 
                value={statusCounts.rejected} 
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <div style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Search 
                placeholder="Search by company, position, or location" 
                onSearch={handleSearch}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Filter by status"
                onChange={handleStatusFilterChange}
                value={statusFilter}
              >
                <Option value="all">All Statuses</Option>
                <Option value="applied">Applied</Option>
                <Option value="interviewing">Interviewing</Option>
                <Option value="offered">Offered</Option>
                <Option value="rejected">Rejected</Option>
                <Option value="accepted">Accepted</Option>
                <Option value="declined">Declined</Option>
              </Select>
            </Col>
          </Row>
        </div>
        
        {filteredJobs.length > 0 ? (
          viewMode === 'card' ? (
            <Row gutter={[16, 16]}>
              {filteredJobs.map(job => (
                <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                  <JobCard job={job} />
                </Col>
              ))}
            </Row>
          ) : (
            <Table 
              dataSource={filteredJobs}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              onRow={(record) => ({
                onClick: () => navigate(`/job/${record.id}`),
                style: { cursor: 'pointer' }
              })}
              columns={[
                {
                  title: 'Position',
                  dataIndex: 'position',
                  key: 'position',
                  render: (text, record) => (
                    <Typography.Link onClick={() => navigate(`/job/${record.id}`)}>
                      {text || 'Unknown Position'}
                    </Typography.Link>
                  ),
                  sorter: (a, b) => {
                    const posA = a.position || '';
                    const posB = b.position || '';
                    return posA.localeCompare(posB);
                  }
                },
                {
                  title: 'Company',
                  dataIndex: 'company',
                  key: 'company',
                  render: (text) => text || 'Unknown Company'
                },
                {
                  title: 'Location',
                  dataIndex: 'location',
                  key: 'location',
                  render: (text) => text || 'N/A'
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    if (!status) return <Tag>Unknown</Tag>;
                    
                    const statusColors = {
                      applied: 'blue',
                      interviewing: 'orange',
                      offered: 'green',
                      rejected: 'red',
                      accepted: 'green',
                      declined: 'gray'
                    };
                    
                    const color = statusColors[status.toLowerCase()] || 'default';
                    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
                    
                    return <Tag color={color}>{displayStatus}</Tag>;
                  },
                  filters: [
                    { text: 'Applied', value: 'applied' },
                    { text: 'Interviewing', value: 'interviewing' },
                    { text: 'Offered', value: 'offered' },
                    { text: 'Rejected', value: 'rejected' },
                    { text: 'Accepted', value: 'accepted' },
                    { text: 'Declined', value: 'declined' }
                  ],
                  onFilter: (value, record) => record.status === value
                },
                {
                  title: 'Date Applied',
                  dataIndex: 'dateApplied',
                  key: 'dateApplied',
                  render: (date) => {
                    if (!date) return 'N/A';
                    
                    try {
                      // For Firestore timestamps
                      if (date && typeof date === 'object' && date.seconds) {
                        return dayjs(new Date(date.seconds * 1000)).format('MMM D, YYYY');
                      }
                      
                      // For ISO strings
                      return dayjs(date).format('MMM D, YYYY');
                    } catch (error) {
                      console.error("Error formatting date:", error);
                      return 'Invalid date';
                    }
                  },
                  sorter: (a, b) => {
                    // Handle missing dates
                    if (!a.dateApplied) return 1;
                    if (!b.dateApplied) return -1;
                    
                    // Handle Firestore timestamps
                    const dateA = a.dateApplied && typeof a.dateApplied === 'object' && a.dateApplied.seconds
                      ? new Date(a.dateApplied.seconds * 1000)
                      : new Date(a.dateApplied);
                      
                    const dateB = b.dateApplied && typeof b.dateApplied === 'object' && b.dateApplied.seconds
                      ? new Date(b.dateApplied.seconds * 1000)
                      : new Date(b.dateApplied);
                    
                    return dateA - dateB;
                  },
                  defaultSortOrder: 'descend'
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  width: 120,
                  render: (_, record) => (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: 'edit',
                              label: 'Edit',
                              icon: <EditOutlined />,
                              onClick: () => handleEdit(record.id)
                            },
                            {
                              key: 'delete',
                              label: 'Delete',
                              icon: <DeleteOutlined />,
                              danger: true,
                              onClick: () => handleDelete(record.id)
                            }
                          ]
                        }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button 
                          type="text" 
                          icon={<EllipsisOutlined />} 
                        />
                      </Dropdown>
                    </div>
                  )
                }
              ]}
            />
          )
        ) : (
          <Empty 
            description={
              <span>
                {jobs.length === 0 
                  ? "You haven't added any job applications yet" 
                  : "No jobs match your filters"}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            {jobs.length === 0 && (
              <Button 
                type="primary" 
                onClick={() => navigate('/add')}
              >
                Add Your First Job Application
              </Button>
            )}
          </Empty>
        )}
        
        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Job Application"
          open={isDeleteModalVisible}
          onOk={confirmDelete}
          onCancel={cancelDelete}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this job application? This action cannot be undone.</p>
        </Modal>
      </Content>
    </App>
  );
};

export default Dashboard;
