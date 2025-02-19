import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Spinner,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip
} from '@chakra-ui/react'
import { FiCalendar, FiMoreVertical, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../../store/applicationStore'
import { useInterviewStore } from '../../store/interviewStore'
import { useEffect } from 'react'

export default function InterviewsList() {
  const { applications, loading: appsLoading, error: appsError, fetchApplications } = useApplicationStore()
  const { interviews, loading: interviewsLoading, error: interviewsError, fetchInterviews } = useInterviewStore()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    fetchApplications()
    fetchInterviews() // Fetch all interviews without an applicationId filter
  }, [fetchApplications, fetchInterviews])

  const loading = appsLoading || interviewsLoading
  const error = appsError || interviewsError

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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiCalendar} boxSize={6} color="blue.500" />
            <Heading size="lg">Interviews</Heading>
          </HStack>
          <HStack spacing={4}>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="blue"
              onClick={() => navigate('/applications')}
            >
              Schedule Interview
            </Button>
          </HStack>
        </HStack>

        {interviews.length === 0 ? (
          <Box 
            bg={bgColor}
            borderRadius="lg"
            shadow="sm"
            p={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text color="gray.500">No interviews scheduled yet.</Text>
              <Text color="gray.500">
                Go to an application to schedule an interview.
              </Text>
              <Button
                colorScheme="blue"
                variant="outline"
                leftIcon={<Icon as={FiPlus} />}
                onClick={() => navigate('/applications')}
              >
                View Applications
              </Button>
            </VStack>
          </Box>
        ) : (
          <Box
            bg={bgColor}
            borderRadius="lg"
            shadow="sm"
            overflowX="auto"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Company</Th>
                  <Th>Position</Th>
                  <Th>Interview Date</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {interviews.map(interview => {
                  const application = applications.find(app => app.id === interview.applicationId)
                  return (
                    <Tr 
                      key={interview.id}
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                      cursor="pointer"
                      onClick={(e) => {
                        // Prevent navigation when clicking on the menu
                        if ((e.target as HTMLElement).closest('.actions-menu')) return
                        navigate(`/applications/${interview.applicationId}`)
                      }}
                    >
                      <Td>{application?.companyName || 'N/A'}</Td>
                      <Td>{application?.positionTitle || 'N/A'}</Td>
                      <Td>
                        <Tooltip label={new Date(interview.interviewDate).toLocaleString()}>
                          {new Date(interview.interviewDate).toLocaleDateString()}
                        </Tooltip>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue">
                          {interview.interviewType}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            interview.status === 'COMPLETED' ? 'green' :
                            interview.status === 'CANCELLED' ? 'red' :
                            interview.status === 'RESCHEDULED' ? 'yellow' :
                            'blue'
                          }
                        >
                          {interview.status}
                        </Badge>
                      </Td>
                      <Td className="actions-menu">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<Icon as={FiMoreVertical} />}
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <MenuList>
                            <MenuItem onClick={() => navigate(`/applications/${interview.applicationId}`)}>
                              View Application
                            </MenuItem>
                            <MenuItem onClick={() => navigate(`/applications/${interview.applicationId}/interviews/${interview.id}/edit`)}>
                              Edit Interview
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Container>
  )
}