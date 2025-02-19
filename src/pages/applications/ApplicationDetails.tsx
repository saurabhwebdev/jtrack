import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Divider,
  useColorModeValue,
  IconButton,
  Tooltip,
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon,
  SimpleGrid,
  Circle
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApplicationStore } from '../../store/applicationStore'
import { useInterviewStore } from '../../store/interviewStore'
import { useReferralStore } from '../../store/referralStore'
import { statusColors } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'
import InterviewList from '../../components/interviews/InterviewList'
import ReferralList from '../../components/referrals/ReferralList'
import { FiArrowLeft, FiEdit2, FiBriefcase, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiMonitor } from 'react-icons/fi'
import { useEffect } from 'react'

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { applications, loading: appsLoading, error: appsError } = useApplicationStore()
  const { 
    interviews, 
    loading: interviewsLoading, 
    error: interviewsError, 
    fetchInterviews,
    deleteInterview
  } = useInterviewStore()
  const {
    referrals,
    loading: referralsLoading,
    error: referralsError,
    fetchReferrals,
    deleteReferral
  } = useReferralStore()

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const headerBg = useColorModeValue('blue.50', 'blue.900')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const cardBg = useColorModeValue('white', 'gray.800')
  const iconColor = useColorModeValue('blue.500', 'blue.300')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  useEffect(() => {
    if (id) {
      fetchInterviews(id)
      fetchReferrals(id)
    }
  }, [id, fetchInterviews, fetchReferrals])

  if (!id) {
    return <Text>Invalid application ID</Text>
  }

  const loading = appsLoading || interviewsLoading || referralsLoading
  const error = appsError || interviewsError || referralsError

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500" fontSize="lg">{error}</Text>
      </Box>
    )
  }

  const application = applications.find(app => app.id === id)

  if (!application) {
    return (
      <Box textAlign="center" py={8}>
        <Text fontSize="lg" color="red.500">Application not found</Text>
      </Box>
    )
  }

  const handleDeleteInterview = async (interviewId: string) => {
    try {
      await deleteInterview(interviewId)
      toast({
        title: 'Interview deleted',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error deleting interview',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const handleDeleteReferral = async (referralId: string) => {
    try {
      await deleteReferral(referralId)
      toast({
        title: 'Referral deleted',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error deleting referral',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header Section */}
      <Card
        bg={headerBg}
        mb={8}
        borderRadius="xl"
        overflow="hidden"
        position="relative"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <CardBody p={6}>
          <Grid templateColumns={{ base: '1fr', md: '1fr auto' }} gap={6}>
            <VStack align="start" spacing={4}>
              <HStack spacing={4}>
                <IconButton
                  icon={<FiArrowLeft />}
                  aria-label="Back to list"
                  variant="ghost"
                  onClick={() => navigate('/applications')}
                  size="lg"
                />
                <VStack align="start" spacing={1}>
                  <Heading size="lg" fontWeight="bold">
                    {application.positionTitle}
                  </Heading>
                  <Text fontSize="xl" color={textColor}>
                    {application.companyName}
                  </Text>
                </VStack>
              </HStack>
              
              <HStack spacing={4} wrap="wrap">
                <Tag size="lg" colorScheme={statusColors[application.status]} borderRadius="full">
                  <TagLabel fontWeight="medium">{application.status}</TagLabel>
                </Tag>
                {application.location && (
                  <Tag size="lg" variant="subtle" borderRadius="full">
                    <TagLeftIcon as={FiMapPin} />
                    <TagLabel>{application.location}</TagLabel>
                  </Tag>
                )}
                {application.jobType && (
                  <Tag size="lg" variant="subtle" borderRadius="full">
                    <TagLeftIcon as={FiBriefcase} />
                    <TagLabel>{application.jobType}</TagLabel>
                  </Tag>
                )}
                {application.workMode && (
                  <Tag size="lg" variant="subtle" borderRadius="full">
                    <TagLeftIcon as={FiMonitor} />
                    <TagLabel>{application.workMode}</TagLabel>
                  </Tag>
                )}
              </HStack>
            </VStack>

            <Flex justify="flex-end" align="start">
              <Tooltip label="Edit application">
                <IconButton
                  icon={<FiEdit2 />}
                  aria-label="Edit application"
                  colorScheme="blue"
                  variant="solid"
                  size="lg"
                  onClick={() => navigate(`/applications/${id}/edit`)}
                />
              </Tooltip>
            </Flex>
          </Grid>
        </CardBody>
      </Card>

      {/* Main Content */}
      <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={8}>
        {/* Sidebar */}
        <GridItem>
          <Stack spacing={6}>
            {/* Application Details Card */}
            <Card variant="outline">
              <CardHeader pb={2}>
                <Heading size="md">Application Details</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={6} divider={<Divider />}>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <HStack spacing={2} color={textColor}>
                        <Icon as={FiCalendar} />
                        <Text fontSize="sm">Applied On</Text>
                      </HStack>
                      <Text mt={1} fontWeight="medium">
                        {new Date(application.applicationDate).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Box>
                      <HStack spacing={2} color={textColor}>
                        <Icon as={FiClock} />
                        <Text fontSize="sm">Source</Text>
                      </HStack>
                      <Text mt={1} fontWeight="medium">
                        {application.applicationSource}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {application.salaryRange && (
                    <Box>
                      <HStack spacing={2} color={textColor} mb={2}>
                        <Icon as={FiDollarSign} />
                        <Text fontSize="sm">Salary Range</Text>
                      </HStack>
                      <Text fontWeight="medium">
                        {formatCurrency(application.salaryRange.min)} - {formatCurrency(application.salaryRange.max)}
                      </Text>
                      <Text fontSize="sm" color={textColor} mt={1}>
                        per {application.salaryRange.period.toLowerCase()}
                      </Text>
                    </Box>
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* Next Steps Card */}
            {(application.nextStep || application.nextStepDate) && (
              <Card variant="outline">
                <CardHeader pb={2}>
                  <Heading size="md">Next Steps</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    {application.nextStep && (
                      <Box>
                        <Text fontSize="sm" color={textColor}>Action</Text>
                        <Text mt={1} fontWeight="medium">{application.nextStep}</Text>
                      </Box>
                    )}
                    {application.nextStepDate && (
                      <Box>
                        <Text fontSize="sm" color={textColor}>Due Date</Text>
                        <Text mt={1} fontWeight="medium">
                          {new Date(application.nextStepDate).toLocaleDateString()}
                        </Text>
                      </Box>
                    )}
                  </Stack>
                </CardBody>
              </Card>
            )}

            {/* Notes Card */}
            {application.notes && (
              <Card variant="outline">
                <CardHeader pb={2}>
                  <Heading size="md">Notes</Heading>
                </CardHeader>
                <CardBody>
                  <Text whiteSpace="pre-wrap" color={textColor}>
                    {application.notes}
                  </Text>
                </CardBody>
              </Card>
            )}
          </Stack>
        </GridItem>

        {/* Main Content Area */}
        <GridItem>
          <Card variant="outline">
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList px={4} pt={4}>
                <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
                  Job Description
                </Tab>
                <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
                  Interviews
                </Tab>
                <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
                  Referrals
                </Tab>
              </TabList>
              <Divider />

              <TabPanels>
                <TabPanel>
                  <Box bg={cardBg} p={4} borderRadius="md">
                    <Text whiteSpace="pre-wrap" color={textColor}>
                      {application.jobDescription || 'No job description provided'}
                    </Text>
                  </Box>
                </TabPanel>

                <TabPanel>
                  <InterviewList
                    interviews={interviews}
                    applicationId={id}
                    onDelete={handleDeleteInterview}
                  />
                </TabPanel>

                <TabPanel>
                  <ReferralList
                    referrals={referrals}
                    applicationId={id}
                    onDelete={handleDeleteReferral}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  )
} 