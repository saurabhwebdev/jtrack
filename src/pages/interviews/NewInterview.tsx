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
  BreadcrumbLink
} from '@chakra-ui/react'
import { FiCalendar, FiChevronRight } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import InterviewForm from '../../components/interviews/InterviewForm'
import { useInterviewStore } from '../../store/interviewStore'

export default function NewInterview() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const { addInterview } = useInterviewStore()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (!applicationId) {
    return <Box>Invalid application ID</Box>
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
            <BreadcrumbLink>New Interview</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <HStack spacing={3} justify="center" mb={3}>
            <Icon as={FiCalendar} boxSize={6} color="blue.500" />
            <Heading size="lg">Schedule New Interview</Heading>
          </HStack>
          <Text color="gray.600">
            Add details about your upcoming interview
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
          <InterviewForm onSubmit={addInterview} applicationId={applicationId} />
        </Box>
      </VStack>
    </Container>
  )
} 