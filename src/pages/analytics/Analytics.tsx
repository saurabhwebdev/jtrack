import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Select,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiTrendingUp, FiClock, FiCheckCircle, FiXCircle, FiBarChart2, FiPieChart } from 'react-icons/fi'
import { useApplicationStore } from '../../store/applicationStore'
import { useEffect, useState } from 'react'
import { JobApplication } from '../../types/application.types'
import ApplicationStatusChart from '../../components/analytics/ApplicationStatusChart'
import ApplicationTimelineChart from '../../components/analytics/ApplicationTimelineChart'
import SourceAnalyticsChart from '../../components/analytics/SourceAnalyticsChart'
import SalaryRangeChart from '../../components/analytics/SalaryRangeChart'

export default function Analytics() {
  const { applications, fetchApplications } = useApplicationStore()
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days' | 'all'>('30days')
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const getFilteredApplications = () => {
    if (timeframe === 'all') return applications

    const now = new Date()
    const days = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 90
    const cutoff = new Date(now.setDate(now.getDate() - days))

    return applications.filter(app => new Date(app.applicationDate) >= cutoff)
  }

  const getAnalytics = (apps: JobApplication[]) => {
    const total = apps.length
    const active = apps.filter(app => 
      ['APPLIED', 'INTERVIEWING'].includes(app.status)
    ).length
    const offered = apps.filter(app => 
      ['OFFERED', 'ACCEPTED'].includes(app.status)
    ).length
    const rejected = apps.filter(app => 
      app.status === 'REJECTED'
    ).length
    const successRate = total ? ((offered / total) * 100).toFixed(1) + '%' : '0%'
    const responseRate = total ? 
      (((offered + rejected) / total) * 100).toFixed(1) + '%' : '0%'

    return { total, active, offered, rejected, successRate, responseRate }
  }

  const filteredApps = getFilteredApplications()
  const analytics = getAnalytics(filteredApps)

  const StatCard = ({ label, value, icon, trend }: { 
    label: string
    value: string | number
    icon: any
    trend?: { value: number; isUpward: boolean }
  }) => (
    <Card>
      <CardBody>
        <Stat>
          <HStack spacing={4}>
            <Box
              p={2}
              bg={useColorModeValue('blue.50', 'blue.900')}
              rounded="lg"
              color="blue.500"
            >
              <Icon as={icon} boxSize={6} />
            </Box>
            <Box flex="1">
              <StatLabel color="gray.500">{label}</StatLabel>
              <StatNumber fontSize="2xl">{value}</StatNumber>
              {trend && (
                <StatHelpText>
                  <StatArrow type={trend.isUpward ? 'increase' : 'decrease'} />
                  {trend.value}%
                </StatHelpText>
              )}
            </Box>
          </HStack>
        </Stat>
      </CardBody>
    </Card>
  )

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="lg">Analytics Dashboard</Heading>
            <Text color="gray.600">Track your job search performance</Text>
          </VStack>
          <Select
            w="200px"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="all">All time</option>
          </Select>
        </HStack>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
          <StatCard
            label="Total Applications"
            value={analytics.total}
            icon={FiBarChart2}
          />
          <StatCard
            label="Active Applications"
            value={analytics.active}
            icon={FiClock}
          />
          <StatCard
            label="Success Rate"
            value={analytics.successRate}
            icon={FiCheckCircle}
          />
          <StatCard
            label="Response Rate"
            value={analytics.responseRate}
            icon={FiTrendingUp}
          />
        </SimpleGrid>

        {/* Charts */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Main Charts */}
          <Card>
            <CardHeader>
              <Heading size="md">Application Timeline</Heading>
            </CardHeader>
            <CardBody>
              <ApplicationTimelineChart applications={filteredApps} />
            </CardBody>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <Heading size="md">Status Distribution</Heading>
            </CardHeader>
            <CardBody>
              <ApplicationStatusChart applications={filteredApps} />
            </CardBody>
          </Card>
        </Grid>

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <Heading size="md">Detailed Analysis</Heading>
          </CardHeader>
          <CardBody>
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>Application Sources</Tab>
                <Tab>Salary Ranges</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SourceAnalyticsChart applications={filteredApps} />
                </TabPanel>
                <TabPanel>
                  <SalaryRangeChart applications={filteredApps} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
} 