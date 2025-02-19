import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center
} from '@chakra-ui/react'
import { FiBriefcase, FiChevronRight } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ApplicationForm from '../../components/applications/ApplicationForm'
import { useApplicationStore } from '../../store/applicationStore'
import { useEffect } from 'react'
import { JobApplication } from '../../types/application.types'


export default function EditApplication() {
  const { id } = useParams<{ id: string }>()
  const { applications, loading, error, fetchApplications, updateApplication } = useApplicationStore()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  if (!id) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">Invalid application ID</Text>
      </Box>
    )
  }

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">{error}</Text>
      </Box>
    )
  }

  const application = applications.find(app => app.id === id)
  if (!application) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">Application not found</Text>
      </Box>
    )
  }

  const handleUpdate = async (formData: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Remove any undefined or null values
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value != null)
      )
      
      console.log('Submitting update with data:', cleanedData)
      await updateApplication(id, cleanedData)
    } catch (error) {
      console.error('Failed to update application:', error)
      throw error // Let the form handle the error display
    }
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Breadcrumb Navigation */}
        <Breadcrumb separator={<Icon as={FiChevronRight} color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/applications">
              Applications
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Edit Application</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <HStack spacing={3} justify="center" mb={3}>
            <Icon as={FiBriefcase} boxSize={6} color="blue.500" />
            <Heading size="lg">Edit Application</Heading>
          </HStack>
          <Text color="gray.600">
            Update your job application details
          </Text>
        </Box>

        {/* Form Card */}
        <Box
          bg={bgColor}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          p={{ base: 4, md: 8 }}
          shadow="sm"
          _hover={{ shadow: 'md' }}
          transition="all 0.2s"
        >
          <ApplicationForm
            initialData={application}
            onSubmit={handleUpdate}
            isEditing
          />
        </Box>
      </VStack>
    </Container>
  )
}