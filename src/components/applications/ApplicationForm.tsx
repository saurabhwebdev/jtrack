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
  InputGroup,
  InputLeftAddon,
  Divider,
  Heading,
  Stack,
  HStack,
  useColorModeValue,
  Grid
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JobApplication, ApplicationSource, ApplicationStatus, CurrencyType } from '../../types/application.types'

interface ApplicationFormProps {
  initialData?: Partial<JobApplication>
  onSubmit: (data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  isEditing?: boolean
}

const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'C$'
}

const CURRENCY_LABELS: Record<CurrencyType, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  INR: 'Indian Rupee',
  CAD: 'Canadian Dollar'
}

export default function ApplicationForm({ initialData, onSubmit, isEditing = false }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    positionTitle: initialData?.positionTitle || '',
    applicationDate: initialData?.applicationDate || new Date().toISOString().split('T')[0],
    applicationSource: initialData?.applicationSource || 'LINKEDIN' as ApplicationSource,
    jobDescription: initialData?.jobDescription || '',
    status: initialData?.status || 'DRAFT' as ApplicationStatus,
    location: initialData?.location || '',
    jobType: initialData?.jobType || 'FULL_TIME',
    workMode: initialData?.workMode || 'ON_SITE',
    notes: initialData?.notes || '',
    nextStep: initialData?.nextStep || '',
    nextStepDate: initialData?.nextStepDate || '',
    salaryRange: initialData?.salaryRange || {
      min: 0,
      max: 0,
      currency: 'USD' as CurrencyType,
      period: 'YEARLY' as const
    }
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const toast = useToast()

  const sectionBg = useColorModeValue('gray.50', 'gray.700')
  const sectionHeadingColor = useColorModeValue('gray.700', 'gray.200')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName) newErrors.companyName = 'Company name is required'
    if (!formData.positionTitle) newErrors.positionTitle = 'Position title is required'
    if (!formData.applicationDate) newErrors.applicationDate = 'Application date is required'

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
        title: `Application ${isEditing ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      })
      navigate('/applications')
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

  const handleSalaryChange = (field: 'min' | 'max', value: string) => {
    setFormData(prev => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: parseInt(value) || 0
      }
    }))
  }

  return (
    <VStack spacing={8} align="stretch" divider={<Divider />}>
      {/* Basic Information Section */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Basic Information</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={!!errors.companyName}>
            <FormLabel>Company Name</FormLabel>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
            />
            <FormErrorMessage>{errors.companyName}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.positionTitle}>
            <FormLabel>Position Title</FormLabel>
            <Input
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              placeholder="Enter position title"
            />
            <FormErrorMessage>{errors.positionTitle}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Application Details Section */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Application Details</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={!!errors.applicationDate}>
            <FormLabel>Application Date</FormLabel>
            <Input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.applicationDate}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Application Source</FormLabel>
            <Select
              name="applicationSource"
              value={formData.applicationSource}
              onChange={handleChange}
            >
              <option value="LINKEDIN">LinkedIn</option>
              <option value="COMPANY_WEBSITE">Company Website</option>
              <option value="JOB_BOARD">Job Board</option>
              <option value="REFERRAL">Referral</option>
              <option value="OTHER">Other</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="DRAFT">Draft</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFERED">Offered</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, NY or Remote"
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Job Details Section */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Job Details</Heading>
        <Stack spacing={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>Job Type</FormLabel>
              <Select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Work Mode</FormLabel>
              <Select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On Site</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>Currency</FormLabel>
              <Select
                name="currency"
                value={formData.salaryRange.currency}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    salaryRange: {
                      ...prev.salaryRange,
                      currency: e.target.value as CurrencyType
                    }
                  }))
                }}
              >
                {Object.entries(CURRENCY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label} ({CURRENCY_SYMBOLS[value as CurrencyType]})
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Payment Period</FormLabel>
              <Select
                name="period"
                value={formData.salaryRange.period}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    salaryRange: {
                      ...prev.salaryRange,
                      period: e.target.value as 'YEARLY' | 'MONTHLY' | 'HOURLY'
                    }
                  }))
                }}
              >
                <option value="YEARLY">Per Year</option>
                <option value="MONTHLY">Per Month</option>
                <option value="HOURLY">Per Hour</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>Minimum Salary</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  {CURRENCY_SYMBOLS[formData.salaryRange.currency]}
                </InputLeftAddon>
                <NumberInput
                  min={0}
                  value={formData.salaryRange.min}
                  onChange={(value) => handleSalaryChange('min', value)}
                >
                  <NumberInputField 
                    placeholder={`Enter minimum ${formData.salaryRange.period.toLowerCase()} salary`}
                  />
                </NumberInput>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Maximum Salary</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  {CURRENCY_SYMBOLS[formData.salaryRange.currency]}
                </InputLeftAddon>
                <NumberInput
                  min={0}
                  value={formData.salaryRange.max}
                  onChange={(value) => handleSalaryChange('max', value)}
                >
                  <NumberInputField 
                    placeholder={`Enter maximum ${formData.salaryRange.period.toLowerCase()} salary`}
                  />
                </NumberInput>
              </InputGroup>
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel>Job Description</FormLabel>
            <Textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              minH="200px"
              placeholder="Copy and paste the job description here"
            />
          </FormControl>
        </Stack>
      </Box>

      {/* Notes & Next Steps Section */}
      <Box>
        <Heading size="sm" color={sectionHeadingColor} mb={4}>Notes & Next Steps</Heading>
        <Stack spacing={6}>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any personal notes about this application"
              minH="100px"
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>Next Step</FormLabel>
              <Input
                name="nextStep"
                value={formData.nextStep}
                onChange={handleChange}
                placeholder="e.g., Follow up email, Technical interview"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Next Step Date</FormLabel>
              <Input
                type="date"
                name="nextStepDate"
                value={formData.nextStepDate}
                onChange={handleChange}
              />
            </FormControl>
          </SimpleGrid>
        </Stack>
      </Box>

      {/* Form Actions */}
      <HStack spacing={4} justify="flex-end">
        <Button
          variant="outline"
          onClick={() => navigate('/applications')}
        >
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          isLoading={loading}
          type="submit"
          onClick={handleSubmit}
        >
          {isEditing ? 'Update' : 'Create'} Application
        </Button>
      </HStack>
    </VStack>
  )
} 