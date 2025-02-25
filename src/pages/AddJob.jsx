import { Container, Heading, Box, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';

const AddJob = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSuccess = () => {
    toast({
      title: 'Success',
      description: 'Job application added successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/dashboard');
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl">Add New Job Application</Heading>
      </Box>
      
      <JobForm onSuccess={handleSuccess} />
    </Container>
  );
};

export default AddJob;
