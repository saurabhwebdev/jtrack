import { ApplicationStatus } from '../types/application.types'

export const statusColors: Record<ApplicationStatus, string> = {
  DRAFT: 'gray',
  APPLIED: 'blue',
  INTERVIEWING: 'purple',
  REJECTED: 'red',
  OFFERED: 'green',
  ACCEPTED: 'teal',
  WITHDRAWN: 'orange',
}