import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Flex,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../../services/supabase/client'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(email, password)
      if (error) throw error

      toast({
        title: 'Success',
        description: 'Please check your email to confirm your account',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign up',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center" bg="gray.50">
      <Box
        w={["90%", "80%", "md"]}
        maxW="md"
        p={8}
        borderRadius="lg"
        bg="white"
        boxShadow="lg"
        mx="auto"
      >
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center" color="blue.600">Create Account</Heading>
          <form onSubmit={handleRegister}>
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="white"
                  size="lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="white"
                  size="lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="white"
                  size="lg"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={loading}
                w="full"
                mt={4}
              >
                Sign Up
              </Button>
            </Stack>
          </form>
          <Text textAlign="center">
            Already have an account?{' '}
            <Link to="/login">
              <Text as="span" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Sign in
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  )
}