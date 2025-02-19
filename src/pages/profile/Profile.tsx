import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Icon,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiEdit2, FiBriefcase, FiCalendar, FiUserPlus, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useApplicationStore } from '../../store/applicationStore'
import { useEffect } from 'react'

export default function Profile() {
  const { user } = useAuth()
  const { applications, fetchApplications } = useApplicationStore()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const stats = {
    totalApplications: applications.length,
    activeApplications: applications.filter(app => 
      ['APPLIED', 'INTERVIEWING'].includes(app.status)
    ).length,
    successfulApplications: applications.filter(app => 
      ['OFFERED', 'ACCEPTED'].includes(app.status)
    ).length,
    interviews: applications.reduce((count, app) => 
      count + (app.interviews?.length || 0), 0
    ),
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Card>
          <CardBody>
            <HStack spacing={8} align="flex-start">
              <Avatar
                size="2xl"
                name={user?.email}
                bg="blue.500"
              />
              <VStack align="start" flex={1} spacing={4}>
                <VStack align="start" spacing={1}>
                  <Heading size="lg">{user?.email}</Heading>
                  <Text color="gray.500">Member since {new Date(user?.created_at || '').toLocaleDateString()}</Text>
                </VStack>
                <Button
                  leftIcon={<Icon as={FiEdit2} />}
                  size="sm"
                  variant="outline"
                >
                  Edit Profile
                </Button>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Applications</StatLabel>
                <StatNumber>{stats.totalApplications}</StatNumber>
                <HStack color="gray.500">
                  <Icon as={FiBriefcase} />
                  <Text fontSize="sm">All time</Text>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Applications</StatLabel>
                <StatNumber>{stats.activeApplications}</StatNumber>
                <HStack color="blue.500">
                  <Icon as={FiCalendar} />
                  <Text fontSize="sm">In progress</Text>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Success Rate</StatLabel>
                <StatNumber>
                  {stats.totalApplications 
                    ? ((stats.successfulApplications / stats.totalApplications) * 100).toFixed(1)
                    : 0}%
                </StatNumber>
                <HStack color="green.500">
                  <Icon as={FiCheckCircle} />
                  <Text fontSize="sm">Offers received</Text>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Interviews</StatLabel>
                <StatNumber>{stats.interviews}</StatNumber>
                <HStack color="purple.500">
                  <Icon as={FiUserPlus} />
                  <Text fontSize="sm">Scheduled & completed</Text>
                </HStack>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {applications.slice(0, 5).map(app => (
                <Box key={app.id}>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{app.companyName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {app.positionTitle}
                      </Text>
                    </VStack>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </Text>
                  </HStack>
                  <Divider mt={2} />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
} 