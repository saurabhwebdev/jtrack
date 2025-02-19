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
import { FiUserPlus, FiChevronRight } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ReferralForm from '../../components/referrals/ReferralForm'
import { useReferralStore } from '../../store/referralStore'

export default function NewReferral() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const { addReferral } = useReferralStore()
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
            <BreadcrumbLink>New Referral</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <HStack spacing={3} justify="center" mb={3}>
            <Icon as={FiUserPlus} boxSize={6} color="blue.500" />
            <Heading size="lg">Add New Referral</Heading>
          </HStack>
          <Text color="gray.600">
            Add details about your referral contact
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
          <ReferralForm onSubmit={addReferral} applicationId={applicationId} />
        </Box>
      </VStack>
    </Container>
  )
} 