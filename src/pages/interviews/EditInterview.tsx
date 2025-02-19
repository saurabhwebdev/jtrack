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
import { FiCalendar, FiChevronRight } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import InterviewForm from '../../components/interviews/InterviewForm'
import { useInterviewStore } from '../../store/interviewStore'
import { useEffect } from 'react'

export default function EditInterview() {
  const { applicationId, interviewId } = useParams<{ applicationId: string; interviewId: string }>()
  const { interviews, loading, error, fetchInterviews, updateInterview } = useInterviewStore()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    if (applicationId) {
      fetchInterviews(applicationId)
    }
  }, [applicationId, fetchInterviews])

  if (!applicationId || !interviewId) {
    return <Box>Invalid application or interview ID</Box>
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

  const interview = interviews.find(i => i.id === interviewId)
  if (!interview) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">Interview not found</Text>
      </Box>
    )
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
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/applications/${applicationId}`}>
              Application Details
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Edit Interview</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <HStack spacing={3} justify="center" mb={3}>
            <Icon as={FiCalendar} boxSize={6} color="blue.500" />
            <Heading size="lg">Edit Interview</Heading>
          </HStack>
          <Text color="gray.600">
            Update the interview details
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
          <InterviewForm
            initialData={interview}
            onSubmit={(data) => updateInterview(interviewId, data)}
            applicationId={applicationId}
            isEditing
          />
        </Box>
      </VStack>
    </Container>
  )
} 