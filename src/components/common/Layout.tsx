import { Box } from '@chakra-ui/react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" w="100vw" overflow="hidden">
      <Navbar />
      <Box
        as="main"
        flex="1"
        w="100%"
        bg="gray.50"
      >
        <Box
          maxW="1280px"
          w="100%"
          mx="auto"
          px={{ base: 4, md: 8 }}
          py={8}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
} 