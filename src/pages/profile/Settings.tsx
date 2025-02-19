import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  Select,
  SimpleGrid,
  useToast,
  Divider,
  Icon,
  HStack,
} from '@chakra-ui/react'
import { 
  FiUser, 
  FiBell, 
  FiLock, 
  FiMail, 
  FiSave,
  FiGlobe,
  FiEye
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

export default function Settings() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [formData, setFormData] = useState({
    displayName: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    interviewReminders: true,
    profileVisibility: 'private'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Implement settings update logic
      toast({
        title: 'Settings updated',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error updating settings',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Account Settings</Heading>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FiUser} />
              <Heading size="md">Profile Information</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel>Display Name</FormLabel>
                <Input
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Localization Settings */}
        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FiGlobe} />
              <Heading size="md">Localization</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Language</FormLabel>
                <Select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Timezone</FormLabel>
                <Select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FiBell} />
              <Heading size="md">Notification Preferences</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Email Notifications</FormLabel>
                <Switch
                  name="emailNotifications"
                  isChecked={formData.emailNotifications}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Push Notifications</FormLabel>
                <Switch
                  name="pushNotifications"
                  isChecked={formData.pushNotifications}
                  onChange={handleChange}
                />
              </FormControl>
              <Divider />
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Application Updates</FormLabel>
                <Switch
                  name="applicationUpdates"
                  isChecked={formData.applicationUpdates}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Interview Reminders</FormLabel>
                <Switch
                  name="interviewReminders"
                  isChecked={formData.interviewReminders}
                  onChange={handleChange}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FiEye} />
              <Heading size="md">Privacy Settings</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <FormControl>
              <FormLabel>Profile Visibility</FormLabel>
              <Select
                name="profileVisibility"
                value={formData.profileVisibility}
                onChange={handleChange}
              >
                <option value="private">Private</option>
                <option value="contacts">Contacts Only</option>
                <option value="public">Public</option>
              </Select>
            </FormControl>
          </CardBody>
        </Card>

        {/* Save Button */}
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSubmit}
          leftIcon={<Icon as={FiSave} />}
        >
          Save Changes
        </Button>
      </VStack>
    </Container>
  )
} 