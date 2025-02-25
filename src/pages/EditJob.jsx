import { Container, Heading, Box, useToast, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import JobForm from '../components/JobForm';

const EditJob = () => {
  const { jobId } = useParams();
  const { jobs } = useJobContext();
  const navigate = useNavigate();
  const toast = useToast();
  
  const job = jobs.find(j => j.id === jobId);

  const handleSuccess = () => {
    toast({
      title: 'Success',
      description: 'Job application updated successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/dashboard');
  };

  if (!job) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          Job application not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl">Edit Job Application</Heading>
      </Box>
      
      <JobForm jobId={jobId} onSuccess={handleSuccess} />
    </Container>
  );
};

export default EditJob;
