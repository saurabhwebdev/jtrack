import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Image,
  Avatar,
  Divider,
  Tooltip,
  Icon,
  MenuGroup,
  Badge,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Portal,
  useBreakpointValue,
} from '@chakra-ui/react'
import { HiOutlineMenu } from 'react-icons/hi'
import { FaFont } from 'react-icons/fa'
import { 
  FiPieChart, 
  FiHome, 
  FiBriefcase, 
  FiCalendar, 
  FiUserPlus,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiBell,
  FiLogOut
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { signOut } from '../../services/supabase/client'

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { fontSize, setFontSize } = useTheme()
  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  // Use breakpoint to disable focus trap on mobile
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const cleanupModalElements = () => {
    // Remove focus guards and other modal elements
    const elementsToRemove = document.querySelectorAll(
      '[data-focus-guard], [data-focus-lock-disabled], .chakra-portal, .chakra-modal__content-container'
    )
    elementsToRemove.forEach(el => el?.parentNode?.removeChild(el))

    // Reset body styles
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
    
    // Remove any inline styles added to body
    document.body.removeAttribute('data-chakra-lock')
  }

  const handleDrawerClose = () => {
    onClose()
    setTimeout(cleanupModalElements, 100) // Cleanup after animation
  }

  const NavButton = ({ 
    icon, 
    children, 
    to, 
    badge 
  }: { 
    icon: any; 
    children: React.ReactNode; 
    to: string; 
    badge?: React.ReactNode 
  }) => {
    const handleClick = () => {
      onClose()
      // Force cleanup of any lingering overlay
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      navigate(to)
    }

    return (
      <Button
        w="full"
        variant="ghost"
        justifyContent="flex-start"
        px={4}
        py={6}
        onClick={handleClick}
        leftIcon={<Icon as={icon} boxSize={5} />}
        _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
        position="relative"
      >
        <HStack width="full" justify="space-between">
          <Text>{children}</Text>
          {badge}
        </HStack>
      </Button>
    )
  }

  return (
    <Box
      bg={bgColor}
      px={{ base: 2, md: 4 }}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={<HiOutlineMenu />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={onOpen}
          variant="ghost"
          _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
        />

        <HStack spacing={{ base: 2, md: 8 }} alignItems="center">
          <Image
            src={useColorModeValue('/assets/logo.svg', '/assets/logo-dark.svg')}
            alt="JTrack Logo"
            h={{ base: "32px", md: "40px" }}
            cursor="pointer"
            onClick={() => navigate('/')}
          />
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              leftIcon={<Icon as={FiHome} />}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/applications')}
              leftIcon={<Icon as={FiBriefcase} />}
            >
              Applications
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/interviews')}
              leftIcon={<Icon as={FiCalendar} />}
            >
              Interviews
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/referrals')}
              leftIcon={<Icon as={FiUserPlus} />}
            >
              Referrals
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/reports')}
              leftIcon={<Icon as={FiPieChart} />}
            >
              Analytics{' '}
              <Badge ml={2} colorScheme="blue" variant="subtle" fontSize="xs">
                BETA
              </Badge>
            </Button>
          </HStack>
        </HStack>

        <Flex alignItems="center" gap={{ base: 1, md: 4 }}>
          <Menu>
            <Tooltip label="Adjust font size" openDelay={500}>
              <MenuButton
                as={IconButton}
                icon={<FaFont />}
                variant="ghost"
                aria-label="Font size"
                size={{ base: "sm", md: "md" }}
                display={{ base: 'none', sm: 'flex' }}
                _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
              />
            </Tooltip>
            <MenuList>
              <MenuItem
                onClick={() => setFontSize('sm')}
                fontWeight={fontSize === 'sm' ? 'bold' : 'normal'}
              >
                Small
              </MenuItem>
              <MenuItem
                onClick={() => setFontSize('md')}
                fontWeight={fontSize === 'md' ? 'bold' : 'normal'}
              >
                Medium
              </MenuItem>
              <MenuItem
                onClick={() => setFontSize('lg')}
                fontWeight={fontSize === 'lg' ? 'bold' : 'normal'}
              >
                Large
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={IconButton}
              rounded="full"
              variant="ghost"
              cursor="pointer"
              minW={0}
              size={{ base: "sm", md: "md" }}
              p={0}
              _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
            >
              <Avatar
                size={{ base: "sm", md: "sm" }}
                name={user?.email}
                bg="blue.500"
              />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem 
                  icon={<Icon as={FiUser} />}
                  onClick={() => navigate('/profile')}
                >
                  View Profile
                </MenuItem>
                <MenuItem 
                  icon={<Icon as={FiSettings} />}
                  onClick={() => navigate('/profile/settings')}
                >
                  Account Settings
                </MenuItem>
                <MenuItem 
                  icon={<Icon as={FiBell} />}
                  onClick={() => navigate('/profile/notifications')}
                >
                  Notifications
                </MenuItem>
              </MenuGroup>
              <Divider />
              <MenuGroup title="Support">
                <MenuItem 
                  icon={<Icon as={FiHelpCircle} />}
                  onClick={() => navigate('/help')}
                >
                  Help Center
                </MenuItem>
              </MenuGroup>
              <Divider />
              <MenuItem 
                icon={<Icon as={FiLogOut} />}
                onClick={handleSignOut}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Portal>
        <Drawer 
          isOpen={isOpen} 
          placement="left" 
          onClose={handleDrawerClose}
          autoFocus={false}
          returnFocusOnClose={false}
          preserveScrollBarGap={false}
          blockScrollOnMount={false}
          closeOnEsc={true}
          onEsc={handleDrawerClose}
          trapFocus={!isMobile}
          onCloseComplete={cleanupModalElements}
        >
          <DrawerOverlay 
            bg="blackAlpha.600" 
            backdropFilter="blur(2px)"
            onClick={handleDrawerClose}
            style={{ position: 'fixed', inset: 0 }}
          />
          <DrawerContent
            style={{ position: 'fixed', height: '100vh', top: 0, left: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <DrawerCloseButton 
              onClick={handleDrawerClose}
              _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
              zIndex={2}
            />
            <DrawerHeader borderBottomWidth="1px">
              <Image
                src={useColorModeValue('/assets/logo.svg', '/assets/logo-dark.svg')}
                alt="JTrack Logo"
                h="40px"
                onClick={() => {
                  handleDrawerClose()
                  navigate('/')
                }}
                cursor="pointer"
              />
            </DrawerHeader>

            <DrawerBody px={0} py={4}>
              <VStack spacing={0} align="stretch">
                <NavButton icon={FiHome} to="/">
                  Dashboard
                </NavButton>
                
                <NavButton icon={FiBriefcase} to="/applications">
                  Applications
                </NavButton>
                
                <NavButton icon={FiCalendar} to="/interviews">
                  Interviews
                </NavButton>
                
                <NavButton icon={FiUserPlus} to="/referrals">
                  Referrals
                </NavButton>
                
                <NavButton 
                  icon={FiPieChart} 
                  to="/reports"
                  badge={
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      BETA
                    </Badge>
                  }
                >
                  Analytics
                </NavButton>

                <Divider my={4} />

                <Text px={4} mb={2} fontSize="sm" color="gray.500" fontWeight="medium">
                  Account
                </Text>

                <NavButton icon={FiUser} to="/profile">
                  Profile
                </NavButton>
                
                <NavButton icon={FiSettings} to="/profile/settings">
                  Settings
                </NavButton>
                
                <NavButton icon={FiBell} to="/profile/notifications">
                  Notifications
                </NavButton>
                
                <NavButton icon={FiHelpCircle} to="/help">
                  Help Center
                </NavButton>

                <Divider my={4} />

                <Button
                  w="full"
                  variant="ghost"
                  justifyContent="flex-start"
                  px={4}
                  py={6}
                  onClick={() => {
                    handleDrawerClose()
                    handleSignOut()
                  }}
                  leftIcon={<Icon as={FiLogOut} boxSize={5} />}
                  _hover={{ bg: useColorModeValue('red.50', 'red.900'), color: 'red.500' }}
                >
                  <Text>Sign Out</Text>
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Portal>
    </Box>
  )
} 