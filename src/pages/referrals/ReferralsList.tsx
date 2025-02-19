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
import { FiUserPlus, FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../../store/applicationStore'
import { useReferralStore } from '../../store/referralStore'
import { useEffect } from 'react'

export default function ReferralsList() {
  const { applications, loading: appsLoading, error: appsError, fetchApplications } = useApplicationStore()
  const { referrals, loading: referralsLoading, error: referralsError, fetchReferrals } = useReferralStore()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    fetchApplications()
    fetchReferrals() // Fetch all referrals without an applicationId filter
  }, [fetchApplications, fetchReferrals])

  const loading = appsLoading || referralsLoading
  const error = appsError || referralsError

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
            <Icon as={FiUserPlus} boxSize={6} color="blue.500" />
            <Heading size="lg">Referrals</Heading>
          </HStack>
          <HStack spacing={4}>
            <Button
              leftIcon={<Icon as={FiUserPlus} />}
              colorScheme="blue"
              onClick={() => navigate('/applications')}
            >
              Add Referral
            </Button>
          </HStack>
        </HStack>

        {referrals.length === 0 ? (
          <Box 
            bg={bgColor}
            borderRadius="lg"
            shadow="sm"
            p={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text color="gray.500">No referrals added yet.</Text>
              <Text color="gray.500">
                Go to an application to add a referral.
              </Text>
              <Button
                colorScheme="blue"
                variant="outline"
                leftIcon={<Icon as={FiUserPlus} />}
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
                  <Th>Referrer Name</Th>
                  <Th>Company</Th>
                  <Th>Position</Th>
                  <Th>Relationship</Th>
                  <Th>Contact</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {referrals.map(referral => {
                  const application = applications.find(app => app.id === referral.applicationId)
                  return (
                    <Tr 
                      key={referral.id}
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                      cursor="pointer"
                      onClick={(e) => {
                        // Prevent navigation when clicking on the menu
                        if ((e.target as HTMLElement).closest('.actions-menu')) return
                        navigate(`/applications/${referral.applicationId}`)
                      }}
                    >
                      <Td>{referral.referrerName}</Td>
                      <Td>{application?.companyName || 'N/A'}</Td>
                      <Td>{application?.positionTitle || 'N/A'}</Td>
                      <Td>
                        <Badge colorScheme="blue">
                          {referral.relationship}
                        </Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          {referral.referrerEmail && (
                            <Text fontSize="sm">{referral.referrerEmail}</Text>
                          )}
                          {referral.referrerPhone && (
                            <Text fontSize="sm">{referral.referrerPhone}</Text>
                          )}
                        </VStack>
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
                            <MenuItem onClick={() => navigate(`/applications/${referral.applicationId}`)}>
                              View Application
                            </MenuItem>
                            <MenuItem onClick={() => navigate(`/applications/${referral.applicationId}/referrals/${referral.id}/edit`)}>
                              Edit Referral
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