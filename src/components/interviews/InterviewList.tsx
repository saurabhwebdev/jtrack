import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  useColorModeValue,
  IconButton,
  Tooltip,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { FiCalendar, FiEdit2, FiTrash2, FiPlus, FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Interview } from '../../types/interview.types'
import { useRef, useState } from 'react'

interface InterviewListProps {
  interviews: Interview[]
  applicationId: string
  onDelete: (id: string) => Promise<void>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'blue'
    case 'COMPLETED':
      return 'green'
    case 'CANCELLED':
      return 'red'
    case 'RESCHEDULED':
      return 'yellow'
    default:
      return 'gray'
  }
}

export default function InterviewList({ interviews, applicationId, onDelete }: InterviewListProps) {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedId, setSelectedId] = useState<string>('')
  const cancelRef = useRef<HTMLButtonElement>(null)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgHover = useColorModeValue('gray.50', 'gray.700')

  const handleDelete = async () => {
    try {
      await onDelete(selectedId)
      onClose()
    } catch (error) {
      console.error('Failed to delete interview:', error)
    }
  }

  const confirmDelete = (id: string) => {
    setSelectedId(id)
    onOpen()
  }

  if (interviews.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="gray.500">No interviews scheduled yet</Text>
        <Button
          mt={4}
          colorScheme="blue"
          variant="outline"
          leftIcon={<Icon as={FiPlus} />}
          onClick={() => navigate(`/applications/${applicationId}/interviews/new`)}
        >
          Schedule Interview
        </Button>
      </Box>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="flex-end">
        <Button
          colorScheme="blue"
          leftIcon={<Icon as={FiPlus} />}
          size="sm"
          onClick={() => navigate(`/applications/${applicationId}/interviews/new`)}
        >
          Schedule Interview
        </Button>
      </HStack>

      {interviews.map((interview) => (
        <Box
          key={interview.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          _hover={{ bg: bgHover }}
        >
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2}>
              <HStack>
                <Badge colorScheme="blue">Round {interview.roundNumber}</Badge>
                <Badge>{interview.interviewType}</Badge>
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
              </HStack>

              <Tooltip label={new Date(interview.interviewDate).toLocaleString()}>
                <Text fontSize="sm" color="gray.600">
                  {new Date(interview.interviewDate).toLocaleDateString()}
                </Text>
              </Tooltip>

              {interview.interviewerName && (
                <Text fontSize="sm">
                  with {interview.interviewerName}
                  {interview.interviewerTitle && ` (${interview.interviewerTitle})`}
                </Text>
              )}

              {interview.feedback && (
                <Text fontSize="sm" color="gray.600">
                  Feedback: {interview.feedback}
                </Text>
              )}

              {interview.nextSteps && (
                <Text fontSize="sm" color="gray.600">
                  Next Steps: {interview.nextSteps}
                </Text>
              )}

              {interview.notes && (
                <Text fontSize="sm" color="gray.600">
                  Notes: {interview.notes}
                </Text>
              )}
            </VStack>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<Icon as={FiMoreVertical} />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem onClick={() => navigate(`/applications/${applicationId}/interviews/${interview.id}/edit`)}>
                  Edit
                </MenuItem>
                <MenuItem
                  color="red.500"
                  onClick={() => confirmDelete(interview.id)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Box>
      ))}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Interview
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  )
} 