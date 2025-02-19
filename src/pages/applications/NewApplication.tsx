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
import { FiBriefcase, FiChevronRight } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import ApplicationForm from '../../components/applications/ApplicationForm'
import { useApplications } from '../../hooks/useApplications'

export default function NewApplication() {
  const { addApplication } = useApplications()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
            <BreadcrumbLink>New Application</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <HStack spacing={3} justify="center" mb={3}>
            <Icon as={FiBriefcase} boxSize={6} color="blue.500" />
            <Heading size="lg">Add New Application</Heading>
          </HStack>
          <Text color="gray.600">
            Track your job application details and keep everything organized
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
          <ApplicationForm onSubmit={addApplication} />
        </Box>
      </VStack>
    </Container>
  )
}