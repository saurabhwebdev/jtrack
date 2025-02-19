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
import { signIn } from '../../services/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) throw error

      navigate('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
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
          <Heading textAlign="center" color="blue.600">Welcome Back</Heading>
          <form onSubmit={handleLogin}>
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
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={loading}
                w="full"
                mt={4}
              >
                Sign In
              </Button>
            </Stack>
          </form>
          <Text textAlign="center">
            Don't have an account?{' '}
            <Link to="/register">
              <Text as="span" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Sign up
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  )
}