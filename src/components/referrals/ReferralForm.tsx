import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  SimpleGrid,
  useToast,
  FormErrorMessage,
  Divider,
  Heading,
  Stack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Referral } from '../../types/application.types'

interface ReferralFormProps {
  initialData?: Partial<Referral>
  onSubmit: (data: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  isEditing?: boolean
  applicationId?: string
}

export default function ReferralForm({ initialData, onSubmit, isEditing = false, applicationId }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    applicationId: initialData?.applicationId || applicationId || '',
    referrerName: initialData?.referrerName || '',
    referrerEmail: initialData?.referrerEmail || '',
    referrerPhone: initialData?.referrerPhone || '',
    relationship: initialData?.relationship || '',
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

    if (!formData.referrerName) newErrors.referrerName = 'Referrer name is required'
    if (!formData.relationship) newErrors.relationship = 'Relationship is required'
    if (formData.referrerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.referrerEmail)) {
      newErrors.referrerEmail = 'Invalid email address'
    }

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
        title: `Referral ${isEditing ? 'updated' : 'created'} successfully`,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Referrer Information</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={!!errors.referrerName}>
            <FormLabel>Referrer Name</FormLabel>
            <Input
              name="referrerName"
              value={formData.referrerName}
              onChange={handleChange}
              placeholder="Enter referrer's name"
            />
            <FormErrorMessage>{errors.referrerName}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.relationship}>
            <FormLabel>Relationship</FormLabel>
            <Input
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              placeholder="e.g., Former Colleague, Manager"
            />
            <FormErrorMessage>{errors.relationship}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.referrerEmail}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="referrerEmail"
              value={formData.referrerEmail}
              onChange={handleChange}
              placeholder="Enter referrer's email"
            />
            <FormErrorMessage>{errors.referrerEmail}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input
              name="referrerPhone"
              value={formData.referrerPhone}
              onChange={handleChange}
              placeholder="Enter referrer's phone"
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Notes Section */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Notes</Heading>
        <Stack spacing={6}>
          <FormControl>
            <FormLabel>Additional Notes</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes about the referrer"
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
          {isEditing ? 'Update' : 'Create'} Referral
        </Button>
      </HStack>
    </VStack>
  )
} 