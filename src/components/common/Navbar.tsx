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

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
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
          onClick={isOpen ? onClose : onOpen}
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

      {/* Mobile menu */}
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'none' }}
        pb={4}
        px={2}
      >
        <VStack spacing={3} align="stretch">
          <Button 
            w="full"
            variant="ghost" 
            onClick={() => {
              navigate('/')
              onClose()
            }}
            leftIcon={<Icon as={FiHome} />}
          >
            Dashboard
          </Button>
          <Button 
            w="full"
            variant="ghost" 
            onClick={() => {
              navigate('/applications')
              onClose()
            }}
            leftIcon={<Icon as={FiBriefcase} />}
          >
            Applications
          </Button>
          <Button 
            w="full"
            variant="ghost" 
            onClick={() => {
              navigate('/interviews')
              onClose()
            }}
            leftIcon={<Icon as={FiCalendar} />}
          >
            Interviews
          </Button>
          <Button 
            w="full"
            variant="ghost" 
            onClick={() => {
              navigate('/referrals')
              onClose()
            }}
            leftIcon={<Icon as={FiUserPlus} />}
          >
            Referrals
          </Button>
          <Button 
            w="full"
            variant="ghost" 
            onClick={() => {
              navigate('/reports')
              onClose()
            }}
            leftIcon={<Icon as={FiPieChart} />}
          >
            Analytics{' '}
            <Badge ml={2} colorScheme="blue" variant="subtle" fontSize="xs">
              BETA
            </Badge>
          </Button>
        </VStack>
      </Box>
    </Box>
  )
} 