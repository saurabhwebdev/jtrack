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
  IconButton
} from '@chakra-ui/react'
import { FiBriefcase, FiPlus, FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../../store/applicationStore'
import { useEffect } from 'react'
import { statusColors } from '../../utils/constants'

export default function ApplicationsList() {
  const { applications, loading, error, fetchApplications, addSampleApplication } = useApplicationStore()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

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
            <Icon as={FiBriefcase} boxSize={6} color="blue.500" />
            <Heading size="lg">Job Applications</Heading>
          </HStack>
          <HStack spacing={4}>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="blue"
              variant="outline"
              onClick={addSampleApplication}
            >
              Add Sample
            </Button>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="blue"
              onClick={() => navigate('/applications/new')}
            >
              New Application
            </Button>
          </HStack>
        </HStack>

        {applications.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">No applications yet. Start by adding one!</Text>
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
                  <Th>Application Date</Th>
                  <Th>Status</Th>
                  <Th>Location</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applications.map(application => (
                  <Tr 
                    key={application.id}
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                    cursor="pointer"
                    onClick={(e) => {
                      // Prevent navigation when clicking on the menu
                      if ((e.target as HTMLElement).closest('.actions-menu')) return
                      navigate(`/applications/${application.id}`)
                    }}
                  >
                    <Td>{application.companyName}</Td>
                    <Td>{application.positionTitle}</Td>
                    <Td>{new Date(application.applicationDate).toLocaleDateString()}</Td>
                    <Td>
                      <Badge
                        colorScheme={statusColors[application.status]}
                      >
                        {application.status}
                      </Badge>
                    </Td>
                    <Td>{application.location || '-'}</Td>
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
                          <MenuItem onClick={() => navigate(`/applications/${application.id}`)}>
                            View Details
                          </MenuItem>
                          <MenuItem onClick={() => navigate(`/applications/${application.id}/edit`)}>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => navigate(`/applications/${application.id}/interviews/new`)}>
                            Add Interview
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Container>
  )
} 