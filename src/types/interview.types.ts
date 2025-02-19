export type InterviewType = 'PHONE' | 'VIDEO' | 'ON_SITE' | 'TECHNICAL' | 'BEHAVIORAL'
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export interface Interview {
  id: string
  applicationId: string
  roundNumber: number
  interviewDate: string
  interviewType: InterviewType
  interviewerName?: string
  interviewerTitle?: string
  status: InterviewStatus
  feedback?: string
  nextSteps?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface InterviewFormData extends Omit<Interview, 'id' | 'applicationId' | 'createdAt' | 'updatedAt'> {
  applicationId?: string
} 