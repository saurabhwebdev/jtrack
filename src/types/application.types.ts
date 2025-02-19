export type ApplicationStatus = 
  | 'DRAFT'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'REJECTED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'WITHDRAWN'

export type ApplicationSource =
  | 'LINKEDIN'
  | 'COMPANY_WEBSITE'
  | 'JOB_BOARD'
  | 'REFERRAL'
  | 'OTHER'

export type CurrencyType =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'CAD'

export interface SalaryRange {
  min: number
  max: number
  currency: CurrencyType
  period: 'YEARLY' | 'MONTHLY' | 'HOURLY'
}

export interface JobApplication {
  id: string
  userId: string
  companyName: string
  positionTitle: string
  applicationDate: string
  applicationSource: ApplicationSource
  status: ApplicationStatus
  jobDescription?: string
  location?: string
  jobType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  workMode?: 'REMOTE' | 'HYBRID' | 'ON_SITE'
  salaryRange?: SalaryRange
  nextStep?: string
  nextStepDate?: string
  notes?: string
  interviews?: Interview[]
  createdAt: string
  updatedAt: string
}

export interface Interview {
  id: string
  applicationId: string
  roundNumber: number
  interviewDate: string
  interviewType: 'PHONE' | 'VIDEO' | 'ON_SITE' | 'TECHNICAL' | 'BEHAVIORAL'
  interviewerName?: string
  interviewerTitle?: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
  feedback?: string
  nextSteps?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Referral {
  id: string
  applicationId: string
  referrerName: string
  referrerEmail?: string
  referrerPhone?: string
  relationship: string
  notes?: string
  createdAt: string
  updatedAt: string
} 