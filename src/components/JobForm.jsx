import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Divider, 
  Card, 
  message,
  Layout,
  Steps,
  Tooltip
} from 'antd';
import { 
  SaveOutlined, 
  CloseOutlined, 
  EnvironmentOutlined,
  DollarOutlined,
  LinkOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;
const { Step } = Steps;

const JobForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { jobs, addJob, updateJob, loading } = useJobContext();
  const isEditing = !!id;
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize form with job data if editing
  useEffect(() => {
    if (isEditing) {
      const job = jobs.find(j => j.id === id);
      if (job) {
        // Format dates with dayjs
        const formattedJob = {
          ...job,
          dateApplied: job.dateApplied ? dayjs(job.dateApplied) : null,
          interviewDate: job.interviewDate ? dayjs(job.interviewDate) : null,
        };
        form.setFieldsValue(formattedJob);
      }
    }
  }, [isEditing, id, jobs, form]);
  
  const onFinish = (values) => {
    // Convert date objects to ISO strings
    const formattedValues = {
      ...values,
      dateApplied: values.dateApplied ? values.dateApplied.toISOString() : null,
      interviewDate: values.interviewDate ? values.interviewDate.toISOString() : null,
    };
    
    try {
      if (isEditing) {
        updateJob(id, formattedValues);
        message.success('Job application updated successfully!');
      } else {
        addJob(formattedValues);
        message.success('Job application added successfully!');
      }
      
      navigate('/dashboard');
    } catch (error) {
      message.error('There was an error processing your request.');
      console.error(error);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };

  const steps = [
    {
      title: 'Basic Info',
      content: (
        <>
          <Paragraph>
            Enter the basic information about the job position.
          </Paragraph>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please enter the position' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="e.g. Frontend Developer" 
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="company"
                label="Company"
                rules={[{ required: true, message: 'Please enter the company name' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="e.g. Acme Corporation" 
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="location"
                label="Location"
              >
                <Input 
                  prefix={<EnvironmentOutlined />} 
                  placeholder="e.g. San Francisco, CA (Remote)" 
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="salary"
                label="Salary Range"
              >
                <Input 
                  prefix={<DollarOutlined />} 
                  placeholder="e.g. $80,000 - $100,000" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: 'Application Details',
      content: (
        <>
          <Paragraph>
            Enter details about your application status and timeline.
          </Paragraph>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Application Status"
                rules={[{ required: true, message: 'Please select the status' }]}
              >
                <Select size="large">
                  <Option value="applied">Applied</Option>
                  <Option value="interviewing">Interviewing</Option>
                  <Option value="offered">Offered</Option>
                  <Option value="rejected">Rejected</Option>
                  <Option value="accepted">Accepted</Option>
                  <Option value="declined">Declined</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="dateApplied"
                label="Date Applied"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  size="large" 
                  format="YYYY-MM-DD"
                  placeholder="Select date"
                  prefix={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="jobUrl"
                label="Job URL"
              >
                <Input 
                  prefix={<LinkOutlined />} 
                  placeholder="e.g. https://example.com/job-posting" 
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="isReferral"
                label="Referral"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Yes" 
                  unCheckedChildren="No" 
                  size="default"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: 'Additional Info',
      content: (
        <>
          <Paragraph>
            Add any additional information or notes about the job.
          </Paragraph>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Job Description"
              >
                <TextArea 
                  rows={6} 
                  placeholder="Copy and paste the job description here" 
                  showCount 
                  maxLength={5000}
                />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name="notes"
                label="Notes"
              >
                <TextArea 
                  rows={6} 
                  placeholder="Add any personal notes about this application" 
                  showCount 
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };
  
  return (
    <Content style={{ padding: '24px' }}>
      <Card>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
            {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
          </Title>
          
          <Steps current={currentStep} style={{ marginBottom: '32px' }}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              status: 'applied',
              isReferral: false,
              company: '',
              position: '',
              location: '',
              salary: '',
              dateApplied: null,
              interviewDate: null,
              jobUrl: '',
              description: '',
              notes: '',
            }}
          >
            <div style={{ minHeight: '300px' }}>
              {steps[currentStep].content}
            </div>
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Space>
                {currentStep > 0 && (
                  <Button size="large" onClick={prev}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" size="large" onClick={next}>
                    Next
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={loading}
                  >
                    {isEditing ? 'Update Job' : 'Save Job'}
                  </Button>
                )}
              </Space>
              
              <Button
                onClick={handleCancel}
                icon={<CloseOutlined />}
                size="large"
                danger
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </Content>
  );
};

export default JobForm;
