import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  SimpleGrid,
  useToast,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Divider,
  Heading,
  Stack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Interview, InterviewFormData, InterviewType, InterviewStatus } from '../../types/interview.types'

interface InterviewFormProps {
  initialData?: Partial<Interview>
  onSubmit: (data: InterviewFormData) => Promise<void>
  isEditing?: boolean
  applicationId?: string
}

export default function InterviewForm({ initialData, onSubmit, isEditing = false, applicationId }: InterviewFormProps) {
  const [formData, setFormData] = useState<InterviewFormData>({
    applicationId: initialData?.applicationId || applicationId || '',
    roundNumber: initialData?.roundNumber || 1,
    interviewDate: initialData?.interviewDate || new Date().toISOString().slice(0, 16),
    interviewType: initialData?.interviewType || 'PHONE',
    interviewerName: initialData?.interviewerName || '',
    interviewerTitle: initialData?.interviewerTitle || '',
    status: initialData?.status || 'SCHEDULED',
    feedback: initialData?.feedback || '',
    nextSteps: initialData?.nextSteps || '',
    notes: initialData?.notes || ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const toast = useToast()

  const sectionBg = useColorModeValue('gray.50', 'gray.700')
  const sectionHeadingColor = useColorModeValue('gray.700', 'gray.200')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.roundNumber) newErrors.roundNumber = 'Round number is required'
    if (!formData.interviewDate) newErrors.interviewDate = 'Interview date is required'
    if (!formData.interviewType) newErrors.interviewType = 'Interview type is required'
    if (!formData.status) newErrors.status = 'Status is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSubmit(formData)
      toast({
        title: `Interview ${isEditing ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      })
      navigate(`/applications/${applicationId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <VStack spacing={8} align="stretch" divider={<Divider />}>
      {/* Basic Information Section */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Interview Details</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={!!errors.roundNumber}>
            <FormLabel>Round Number</FormLabel>
            <NumberInput
              min={1}
              value={formData.roundNumber}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, roundNumber: parseInt(value) || 1 }))
              }}
            >
              <NumberInputField name="roundNumber" placeholder="Enter round number" />
            </NumberInput>
            <FormErrorMessage>{errors.roundNumber}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.interviewDate}>
            <FormLabel>Interview Date & Time</FormLabel>
            <Input
              type="datetime-local"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.interviewDate}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.interviewType}>
            <FormLabel>Interview Type</FormLabel>
            <Select
              name="interviewType"
              value={formData.interviewType}
              onChange={handleChange}
            >
              <option value="PHONE">Phone</option>
              <option value="VIDEO">Video</option>
              <option value="ON_SITE">On Site</option>
              <option value="TECHNICAL">Technical</option>
              <option value="BEHAVIORAL">Behavioral</option>
            </Select>
            <FormErrorMessage>{errors.interviewType}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.status}>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </Select>
            <FormErrorMessage>{errors.status}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Interviewer Information */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Interviewer Information</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl>
            <FormLabel>Interviewer Name</FormLabel>
            <Input
              name="interviewerName"
              value={formData.interviewerName}
              onChange={handleChange}
              placeholder="Enter interviewer's name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Interviewer Title</FormLabel>
            <Input
              name="interviewerTitle"
              value={formData.interviewerTitle}
              onChange={handleChange}
              placeholder="Enter interviewer's title"
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Feedback & Notes */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Feedback & Notes</Heading>
        <Stack spacing={6}>
          <FormControl>
            <FormLabel>Feedback</FormLabel>
            <Textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Enter interview feedback"
              minH="100px"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Next Steps</FormLabel>
            <Textarea
              name="nextSteps"
              value={formData.nextSteps}
              onChange={handleChange}
              placeholder="Enter next steps"
              minH="100px"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              minH="100px"
            />
          </FormControl>
        </Stack>
      </Box>

      {/* Form Actions */}
      <HStack spacing={4} justify="flex-end">
        <Button
          variant="outline"
          onClick={() => navigate(`/applications/${applicationId}`)}
        >
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          isLoading={loading}
          type="submit"
          onClick={handleSubmit}
        >
          {isEditing ? 'Update' : 'Create'} Interview
        </Button>
      </HStack>
    </VStack>
  )
} 