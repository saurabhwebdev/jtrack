import {
  Box,
  Button,
  VStack,
  HStack,
  Icon,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { FiPlus, FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Referral } from '../../types/application.types'

interface ReferralListProps {
  referrals: Referral[]
  applicationId: string
  onDelete: (id: string) => Promise<void>
}

export default function ReferralList({ referrals, applicationId, onDelete }: ReferralListProps) {
  const navigate = useNavigate()
  const bgHover = useColorModeValue('gray.50', 'gray.700')

  if (referrals.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="gray.500">No referrals added yet</Text>
        <Button
          mt={4}
          colorScheme="blue"
          variant="outline"
          leftIcon={<Icon as={FiPlus} />}
          onClick={() => navigate(`/applications/${applicationId}/referrals/new`)}
        >
          Add Referral
        </Button>
      </Box>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="flex-end">
        <Button
          colorScheme="blue"
          leftIcon={<Icon as={FiPlus} />}
          size="sm"
          onClick={() => navigate(`/applications/${applicationId}/referrals/new`)}
        >
          Add Referral
        </Button>
      </HStack>

      {referrals.map((referral) => (
        <Box
          key={referral.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          _hover={{ bg: bgHover }}
        >
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">{referral.referrerName}</Text>
              <Badge colorScheme="blue">{referral.relationship}</Badge>
              {referral.referrerEmail && (
                <Text fontSize="sm" color="gray.600">
                  Email: {referral.referrerEmail}
                </Text>
              )}
              {referral.referrerPhone && (
                <Text fontSize="sm" color="gray.600">
                  Phone: {referral.referrerPhone}
                </Text>
              )}
              {referral.notes && (
                <Text fontSize="sm" color="gray.600">
                  Notes: {referral.notes}
                </Text>
              )}
            </VStack>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<Icon as={FiMoreVertical} />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem onClick={() => navigate(`/applications/${applicationId}/referrals/${referral.id}/edit`)}>
                  Edit
                </MenuItem>
                <MenuItem
                  color="red.500"
                  onClick={() => onDelete(referral.id)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
} 