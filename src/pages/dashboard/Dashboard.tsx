import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Divider,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useApplications } from '../../hooks/useApplications'
import { FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiUserPlus, FiPieChart } from 'react-icons/fi'

export default function Dashboard() {
  const navigate = useNavigate()
  const { applications, loading, error, getApplicationStats } = useApplications()

  const stats = getApplicationStats()

  const StatCard = ({ label, value, icon, helpText }: { label: string; value: string | number; icon: any; helpText?: string }) => (
    <Stat
      px={{ base: 4, md: 6 }}
      py="5"
      bg="white"
      shadow="base"
      rounded="lg"
      position="relative"
    >
      <HStack spacing={3}>
        <Box
          p={2}
          bg="blue.50"
          rounded="md"
          color="blue.500"
        >
          <Icon as={icon} boxSize={6} />
        </Box>
        <Box flex="1">
          <StatLabel color="gray.500" fontSize="sm">{label}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
          {helpText && (
            <StatHelpText mb={0} color="gray.500">
              {helpText}
            </StatHelpText>
          )}
        </Box>
      </HStack>
    </Stat>
  )

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={FiBriefcase}
        />
        <StatCard
          label="Active Applications"
          value={stats.active}
          icon={FiClock}
          helpText="In progress"
        />
        <StatCard
          label="Success Rate"
          value={stats.successRate}
          icon={FiCheckCircle}
          helpText="Offers received"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={FiXCircle}
        />
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={8}>
        <Box bg="white" p={6} rounded="lg" shadow="base">
          <HStack justify="space-between" mb={6}>
            <Heading size="md">Recent Applications</Heading>
            <Button colorScheme="blue" onClick={() => navigate('/applications/new')}>
              Add Application
            </Button>
          </HStack>

          {loading ? (
            <Text>Loading applications...</Text>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : applications.length === 0 ? (
            <Text color="gray.500">No applications yet. Start by adding one!</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {applications.slice(0, 5).map(app => (
                <Box
                  key={app.id}
                  p={4}
                  bg="gray.50"
                  rounded="md"
                  cursor="pointer"
                  onClick={() => navigate(`/applications/${app.id}`)}
                  _hover={{ bg: 'gray.100' }}
                >
                  <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }} gap={4}>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{app.positionTitle}</Text>
                      <Text color="gray.600">{app.companyName}</Text>
                    </VStack>
                    <Text color="gray.600">
                      Applied: {new Date(app.applicationDate).toLocaleDateString()}
                    </Text>
                    <Text
                      color={
                        app.status === 'ACCEPTED' || app.status === 'OFFERED'
                          ? 'green.500'
                          : app.status === 'REJECTED'
                          ? 'red.500'
                          : 'blue.500'
                      }
                      fontWeight="medium"
                    >
                      {app.status}
                    </Text>
                  </Grid>
                </Box>
              ))}
              {applications.length > 5 && (
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => navigate('/applications')}
                >
                  View All Applications
                </Button>
              )}
            </VStack>
          )}
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="base">
          <Heading size="md" mb={6}>Quick Actions</Heading>
          <VStack spacing={4} align="stretch" divider={<Divider />}>
            {/* Applications */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Applications
              </Text>
              <Button
                w="full"
                colorScheme="blue"
                leftIcon={<Icon as={FiBriefcase} />}
                onClick={() => navigate('/applications/new')}
              >
                Add New Application
              </Button>
              <Button
                w="full"
                variant="outline"
                colorScheme="blue"
                leftIcon={<Icon as={FiBriefcase} />}
                onClick={() => navigate('/applications')}
              >
                View All Applications
              </Button>
            </VStack>

            {/* Interviews */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Interviews
              </Text>
              <Button
                w="full"
                variant="outline"
                colorScheme="purple"
                leftIcon={<Icon as={FiCalendar} />}
                onClick={() => navigate('/interviews')}
              >
                Manage Interviews
              </Button>
            </VStack>

            {/* Referrals */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Referrals
              </Text>
              <Button
                w="full"
                variant="outline"
                colorScheme="teal"
                leftIcon={<Icon as={FiUserPlus} />}
                onClick={() => navigate('/referrals')}
              >
                Manage Referrals
              </Button>
            </VStack>

            {/* Reports & Analysis */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Reports
              </Text>
              <Button
                w="full"
                variant="outline"
                colorScheme="orange"
                leftIcon={<Icon as={FiPieChart} />}
                onClick={() => navigate('/reports')}
              >
                View Analytics
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Grid>
    </Box>
  )
} 