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
import { FiUserPlus, FiChevronRight } from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ReferralForm from '../../components/referrals/ReferralForm'
import { useReferralStore } from '../../store/referralStore'
import { useEffect } from 'react'

export default function EditReferral() {
  const { applicationId, referralId } = useParams<{ applicationId: string; referralId: string }>()
  const { referrals, loading, error, fetchReferrals, updateReferral } = useReferralStore()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    if (applicationId) {
      fetchReferrals(applicationId)
    }
  }, [applicationId, fetchReferrals])

  if (!applicationId || !referralId) {
    return <Box>Invalid application or referral ID</Box>
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

  const referral = referrals.find(r => r.id === referralId)
  if (!referral) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">Referral not found</Text>
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
            <BreadcrumbLink>Edit Referral</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <HStack spacing={3} justify="center" mb={3}>
            <Icon as={FiUserPlus} boxSize={6} color="blue.500" />
            <Heading size="lg">Edit Referral</Heading>
          </HStack>
          <Text color="gray.600">
            Update the referral details
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
          <ReferralForm
            initialData={referral}
            onSubmit={(data) => updateReferral(referralId, data)}
            applicationId={applicationId}
            isEditing
          />
        </Box>
      </VStack>
    </Container>
  )
} 