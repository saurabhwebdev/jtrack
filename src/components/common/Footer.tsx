import { Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderTop={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container
        as={Stack}
        maxW="container.xl"
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© {new Date().getFullYear()} JTrack. All rights reserved</Text>
        <Stack direction="row" spacing={6}>
          <Text as="a" href="#" color="blue.500">Privacy Policy</Text>
          <Text as="a" href="#" color="blue.500">Terms of Service</Text>
          <Text as="a" href="#" color="blue.500">Contact</Text>
        </Stack>
      </Container>
    </Box>
  )
} 