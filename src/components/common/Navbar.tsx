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

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
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
  }) => (
    <Button
      w="full"
      variant="ghost"
      justifyContent="flex-start"
      px={4}
      py={6}
      onClick={() => {
        navigate(to)
        onClose()
      }}
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

  return (
    <Box
      bg={bgColor}
      px={4}
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
        />

        <HStack spacing={8} alignItems="center">
          <Image
            src={useColorModeValue('/assets/logo.svg', '/assets/logo-dark.svg')}
            alt="JTrack Logo"
            h="40px"
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

        <Flex alignItems="center" gap={4}>
          <Menu>
            <Tooltip label="Adjust font size">
              <MenuButton
                as={IconButton}
                icon={<FaFont />}
                variant="ghost"
                aria-label="Font size"
                size="md"
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
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar
                size="sm"
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

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Image
              src={useColorModeValue('/assets/logo.svg', '/assets/logo-dark.svg')}
              alt="JTrack Logo"
              h="40px"
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
                  handleSignOut()
                  onClose()
                }}
                leftIcon={<Icon as={FiLogOut} boxSize={5} />}
                color="red.500"
                _hover={{ bg: 'red.50' }}
              >
                Sign Out
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
} 