import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  useColorModeValue,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import {
  FiSearch,
  FiBookOpen,
  FiMessageCircle,
  FiMail,
  FiVideo,
  FiBriefcase,
  FiCalendar,
  FiUserPlus,
  FiPieChart,
  FiSettings,
  FiHelpCircle,
  FiChevronRight,
  FiCheck,
} from 'react-icons/fi'
import { useState, useMemo } from 'react'

interface Guide {
  id: string
  title: string
  description: string
  icon: any
  details: string[]
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function HelpCenter() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const guides: Guide[] = [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Learn the basics of using JTrack to manage your job applications',
      icon: FiBookOpen,
      details: [
        'Create your account and set up your profile',
        'Understand the dashboard and navigation',
        'Learn how to add your first job application',
        'Set up your notification preferences',
        'Customize your application tracking workflow'
      ]
    },
    {
      id: '2',
      title: 'Managing Applications',
      description: 'Track and organize your job applications effectively',
      icon: FiBriefcase,
      details: [
        'Add and update job applications',
        'Track application status and progress',
        'Set reminders for follow-ups',
        'Organize applications by company and role',
        'Manage application documents and notes'
      ]
    },
    {
      id: '3',
      title: 'Interview Tracking',
      description: 'Schedule and manage your job interviews',
      icon: FiCalendar,
      details: [
        'Schedule and track interview rounds',
        'Set interview reminders',
        'Record interviewer details and feedback',
        'Track interview preparation tasks',
        'Manage post-interview follow-ups'
      ]
    },
    {
      id: '4',
      title: 'Referral System',
      description: 'Learn how to manage and utilize referrals',
      icon: FiUserPlus,
      details: [
        'Add and track job referrals',
        'Manage referrer information',
        'Track referral status and outcomes',
        'Send thank you notes to referrers',
        'Maintain your professional network'
      ]
    },
    {
      id: '5',
      title: 'Analytics & Reports',
      description: 'Understand your job search performance metrics',
      icon: FiPieChart,
      details: [
        'View application success rates',
        'Track interview conversion metrics',
        'Analyze application sources',
        'Monitor salary ranges and offers',
        'Generate custom performance reports'
      ]
    },
    {
      id: '6',
      title: 'Account Settings',
      description: 'Customize your account preferences and notifications',
      icon: FiSettings,
      details: [
        'Update your profile information',
        'Manage notification settings',
        'Customize email preferences',
        'Set up data backup options',
        'Configure privacy settings'
      ]
    }
  ]

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'Applications',
      question: 'How do I add a new job application?',
      answer: 'To add a new job application, click the "New Application" button on the Applications page. Fill in the required details such as company name, position, and application date. You can also add optional information like salary range and job description.'
    },
    {
      id: '2',
      category: 'Applications',
      question: 'How do I update the status of my application?',
      answer: 'Open the application details page by clicking on any application in your list. Click the "Edit" button and update the status field to reflect the current state of your application (e.g., Applied, Interviewing, Offered, etc.).'
    },
    {
      id: '3',
      category: 'Interviews',
      question: 'How do I schedule an interview?',
      answer: 'Navigate to the application details page and click "Add Interview". Enter the interview details including date, time, type (phone, video, on-site), and any additional notes or preparation materials.'
    },
    {
      id: '4',
      category: 'Referrals',
      question: 'How do I add a referral to my application?',
      answer: 'From the application details page, click "Add Referral". Enter your referrer\'s information including their name, contact details, and your relationship with them.'
    },
    {
      id: '5',
      category: 'Analytics',
      question: 'How can I view my application statistics?',
      answer: 'Visit the Analytics page to view comprehensive statistics about your job search. You can see metrics like application success rate, interview conversion rate, and track your progress over time.'
    },
    {
      id: '6',
      category: 'Account',
      question: 'How do I update my notification preferences?',
      answer: 'Go to Settings > Notifications to customize which notifications you want to receive and how you want to receive them (email, in-app, or both).'
    }
  ]

  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return faqs
    const query = searchQuery.toLowerCase()
    return faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, blue.900, gray.800)'
  )

  const handleGuideClick = (guide: Guide) => {
    setSelectedGuide(guide)
    onOpen()
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Quick Help Guides */}
        <Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {guides.map(guide => (
              <Card 
                key={guide.id} 
                _hover={{ transform: 'translateY(-4px)', shadow: 'md' }} 
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => handleGuideClick(guide)}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        bg={useColorModeValue('blue.50', 'blue.900')}
                        rounded="lg"
                        color="blue.500"
                      >
                        <Icon as={guide.icon} boxSize={6} />
                      </Box>
                      <Heading size="md">{guide.title}</Heading>
                    </HStack>
                    <Text color="gray.600">{guide.description}</Text>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      rightIcon={<Icon as={FiHelpCircle} />}
                    >
                      Learn More
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* FAQs Section */}
        <Box bg={useColorModeValue('white', 'gray.800')} rounded="xl" shadow="sm" p={6}>
          <Heading size="lg" mb={6}>Frequently Asked Questions</Heading>
          <Accordion allowMultiple>
            {filteredFAQs.map(faq => (
              <AccordionItem key={faq.id}>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text fontWeight="semibold">{faq.question}</Text>
                      <Badge colorScheme="blue">{faq.category}</Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text color="gray.600">{faq.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        {/* Contact Support Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <VStack spacing={4} align="center">
                <Box
                  p={3}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  rounded="full"
                  color="blue.500"
                >
                  <Icon as={FiMessageCircle} boxSize={8} />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md">Live Chat</Heading>
                  <Text color="gray.600">Chat with our support team</Text>
                  <Button colorScheme="blue" leftIcon={<FiMessageCircle />}>
                    Start Chat
                  </Button>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4} align="center">
                <Box
                  p={3}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  rounded="full"
                  color="blue.500"
                >
                  <Icon as={FiMail} boxSize={8} />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md">Email Support</Heading>
                  <Text color="gray.600">Get help via email</Text>
                  <Button colorScheme="blue" leftIcon={<FiMail />}>
                    Send Email
                  </Button>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4} align="center">
                <Box
                  p={3}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  rounded="full"
                  color="blue.500"
                >
                  <Icon as={FiVideo} boxSize={8} />
                </Box>
                <VStack spacing={2}>
                  <Heading size="md">Video Tutorials</Heading>
                  <Text color="gray.600">Watch helpful tutorials</Text>
                  <Button colorScheme="blue" leftIcon={<FiVideo />}>
                    Watch Now
                  </Button>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Guide Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            {selectedGuide && (
              <>
                <ModalHeader>
                  <HStack spacing={3}>
                    <Icon as={selectedGuide.icon} color="blue.500" />
                    <Text>{selectedGuide.title}</Text>
                  </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack align="stretch" spacing={4}>
                    <Text color="gray.600">{selectedGuide.description}</Text>
                    <List spacing={3}>
                      {selectedGuide.details.map((detail, index) => (
                        <ListItem key={index}>
                          <HStack>
                            <ListIcon as={FiCheck} color="green.500" />
                            <Text>{detail}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  )
} 