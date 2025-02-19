import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  HStack,
  Icon,
  Badge,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react'
import {
  FiBell,
  FiMoreVertical,
  FiCheckCircle,
  FiCalendar,
  FiUserPlus,
  FiBriefcase,
} from 'react-icons/fi'
import { useEffect, useState, useMemo } from 'react'
import { useApplicationStore } from '../../store/applicationStore'
import { useInterviewStore } from '../../store/interviewStore'
import { useReferralStore } from '../../store/referralStore'

interface Notification {
  id: string
  type: 'application' | 'interview' | 'referral'
  title: string
  message: string
  date: string
  read: boolean
  relatedId: string
}

export default function Notifications() {
  const { applications, loading: appsLoading } = useApplicationStore()
  const { interviews, loading: interviewsLoading } = useInterviewStore()
  const { referrals, loading: referralsLoading } = useReferralStore()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Generate notifications from real data
  useEffect(() => {
    const newNotifications: Notification[] = []

    // Application notifications
    applications.forEach(app => {
      newNotifications.push({
        id: `app-${app.id}`,
        type: 'application',
        title: `Application Update - ${app.companyName}`,
        message: `Status updated to ${app.status} for ${app.positionTitle} position`,
        date: app.updatedAt,
        read: false,
        relatedId: app.id
      })
    })

    // Interview notifications
    interviews.forEach(interview => {
      const app = applications.find(a => a.id === interview.applicationId)
      if (app) {
        newNotifications.push({
          id: `interview-${interview.id}`,
          type: 'interview',
          title: `Interview - ${app.companyName}`,
          message: `${interview.interviewType} interview scheduled for ${new Date(interview.interviewDate).toLocaleString()}`,
          date: interview.createdAt,
          read: false,
          relatedId: interview.id
        })
      }
    })

    // Referral notifications
    referrals.forEach(referral => {
      const app = applications.find(a => a.id === referral.applicationId)
      if (app) {
        newNotifications.push({
          id: `referral-${referral.id}`,
          type: 'referral',
          title: `New Referral - ${app.companyName}`,
          message: `${referral.referrerName} added as a referral for your application`,
          date: referral.createdAt,
          read: false,
          relatedId: referral.id
        })
      }
    })

    // Sort notifications by date
    newNotifications.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    setNotifications(newNotifications)
  }, [applications, interviews, referrals])

  const loading = appsLoading || interviewsLoading || referralsLoading

  const getIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return FiCalendar
      case 'application':
        return FiBriefcase
      case 'referral':
        return FiUserPlus
      default:
        return FiBell
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'purple'
      case 'application':
        return 'blue'
      case 'referral':
        return 'green'
      default:
        return 'gray'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiBell} boxSize={6} color="blue.500" />
            <Heading size="lg">Notifications</Heading>
            {unreadCount > 0 && (
              <Badge colorScheme="blue" rounded="full" px={2}>
                {unreadCount} new
              </Badge>
            )}
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          >
            Mark all as read
          </Button>
        </HStack>

        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {notifications.length === 0 ? (
                <Text color="gray.500" textAlign="center">No notifications</Text>
              ) : (
                notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <HStack
                      spacing={4}
                      bg={notification.read ? 'transparent' : useColorModeValue('blue.50', 'blue.900')}
                      p={4}
                      rounded="md"
                    >
                      <Icon
                        as={getIcon(notification.type)}
                        boxSize={5}
                        color={`${getColor(notification.type)}.500`}
                      />
                      <VStack flex={1} align="start" spacing={1}>
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="medium">{notification.title}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {new Date(notification.date).toLocaleDateString()}
                          </Text>
                        </HStack>
                        <Text color="gray.600">{notification.message}</Text>
                      </VStack>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<Icon as={FiMoreVertical} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          {!notification.read && (
                            <MenuItem
                              icon={<Icon as={FiCheckCircle} />}
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </MenuItem>
                          )}
                          <MenuItem
                            icon={<Icon as={FiMoreVertical} />}
                            onClick={() => deleteNotification(notification.id)}
                            color="red.500"
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                    {index < notifications.length - 1 && <Divider my={2} />}
                  </Box>
                ))
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
} 