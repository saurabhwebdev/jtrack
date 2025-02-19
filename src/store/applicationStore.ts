import { create } from 'zustand'
import { JobApplication, Interview, Referral } from '../types/application.types'
import { supabase } from '../services/supabase/client'

interface ApplicationState {
  applications: JobApplication[]
  interviews: Interview[]
  referrals: Referral[]
  loading: boolean
  error: string | null
  
  // Applications
  fetchApplications: () => Promise<void>
  addApplication: (application: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateApplication: (id: string, application: Partial<JobApplication>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
  addSampleApplication: () => Promise<void>
  
  // Interviews
  fetchInterviews: (applicationId: string) => Promise<void>
  addInterview: (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateInterview: (id: string, interview: Partial<Interview>) => Promise<void>
  deleteInterview: (id: string) => Promise<void>
  
  // Referrals
  fetchReferrals: (applicationId: string) => Promise<void>
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateReferral: (id: string, referral: Partial<Referral>) => Promise<void>
  deleteReferral: (id: string) => Promise<void>
}

// Sample application data
const sampleApplication = {
  companyName: "Tech Corp Inc.",
  positionTitle: "Senior Software Engineer",
  applicationDate: new Date().toISOString().split('T')[0],
  applicationSource: "LINKEDIN",
  jobDescription: "We are looking for an experienced software engineer to join our team...",
  status: "APPLIED",
  salaryRange: {
    min: 120000,
    max: 160000,
    currency: "USD",
    period: "YEARLY"
  },
  location: "San Francisco, CA",
  jobType: "FULL_TIME",
  workMode: "HYBRID",
  notes: "Great company culture, modern tech stack",
  nextStep: "Technical Interview",
  nextStepDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
} as const

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  interviews: [],
  referrals: [],
  loading: false,
  error: null,

  // Applications
  fetchApplications: async () => {
    set({ loading: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        throw error
      }

      // Convert snake_case to camelCase
      const formattedData = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        companyName: item.company_name,
        positionTitle: item.position_title,
        applicationDate: item.application_date,
        applicationSource: item.application_source,
        jobDescription: item.job_description,
        status: item.status,
        salaryRange: item.salary_range,
        location: item.location,
        jobType: item.job_type,
        workMode: item.work_mode,
        notes: item.notes,
        nextStep: item.next_step,
        nextStepDate: item.next_step_date,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as JobApplication[]
      
      set({ applications: formattedData })
    } catch (error) {
      console.error('Error in fetchApplications:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to fetch applications' })
    } finally {
      set({ loading: false })
    }
  },

  addApplication: async (application) => {
    set({ loading: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Convert camelCase to snake_case for Supabase
      const newApplication = {
        user_id: user.id,
        company_name: application.companyName,
        position_title: application.positionTitle,
        application_date: application.applicationDate,
        application_source: application.applicationSource,
        job_description: application.jobDescription,
        status: application.status,
        salary_range: application.salaryRange,
        location: application.location,
        job_type: application.jobType,
        work_mode: application.workMode,
        notes: application.notes,
        next_step: application.nextStep,
        next_step_date: application.nextStepDate
      }

      console.log('Sending application data:', newApplication)

      const { data, error } = await supabase
        .from('applications')
        .insert([newApplication])
        .select()
        .single()

      if (error) {
        console.error('Error adding application:', error)
        throw error
      }

      console.log('Application added successfully:', data)
      
      // Convert snake_case back to camelCase for the frontend
      const formattedData = {
        id: data.id,
        userId: data.user_id,
        companyName: data.company_name,
        positionTitle: data.position_title,
        applicationDate: data.application_date,
        applicationSource: data.application_source,
        jobDescription: data.job_description,
        status: data.status,
        salaryRange: data.salary_range,
        location: data.location,
        jobType: data.job_type,
        workMode: data.work_mode,
        notes: data.notes,
        nextStep: data.next_step,
        nextStepDate: data.next_step_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as JobApplication

      set(state => ({
        applications: [...state.applications, formattedData]
      }))
    } catch (error) {
      console.error('Error in addApplication:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to add application' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateApplication: async (id, application) => {
    set({ loading: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Convert camelCase to snake_case for Supabase
      const formattedData = {
        company_name: application.companyName,
        position_title: application.positionTitle,
        application_date: application.applicationDate,
        application_source: application.applicationSource,
        job_description: application.jobDescription,
        status: application.status,
        salary_range: application.salaryRange,
        location: application.location,
        job_type: application.jobType,
        work_mode: application.workMode,
        notes: application.notes,
        next_step: application.nextStep,
        next_step_date: application.nextStepDate
      }

      console.log('Updating application with data:', formattedData)

      const { data, error } = await supabase
        .from('applications')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Update response:', data)

      // Convert snake_case back to camelCase for the frontend
      const updatedApplication = {
        id: data.id,
        userId: data.user_id,
        companyName: data.company_name,
        positionTitle: data.position_title,
        applicationDate: data.application_date,
        applicationSource: data.application_source,
        jobDescription: data.job_description,
        status: data.status,
        salaryRange: data.salary_range,
        location: data.location,
        jobType: data.job_type,
        workMode: data.work_mode,
        notes: data.notes,
        nextStep: data.next_step,
        nextStepDate: data.next_step_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as JobApplication

      set(state => ({
        applications: state.applications.map(app => 
          app.id === id ? updatedApplication : app
        )
      }))
    } catch (error) {
      console.error('Error in updateApplication:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to update application' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  deleteApplication: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

      if (error) throw error
      set(state => ({
        applications: state.applications.filter(app => app.id !== id)
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete application' })
    } finally {
      set({ loading: false })
    }
  },

  // Interviews
  fetchInterviews: async (applicationId) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('applicationId', applicationId)
        .order('interviewDate', { ascending: true })

      if (error) throw error
      set({ interviews: data as Interview[] })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch interviews' })
    } finally {
      set({ loading: false })
    }
  },

  addInterview: async (interview) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert([interview])
        .select()
        .single()

      if (error) throw error
      set(state => ({
        interviews: [...state.interviews, data as Interview]
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add interview' })
    } finally {
      set({ loading: false })
    }
  },

  updateInterview: async (id, interview) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update(interview)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      set(state => ({
        interviews: state.interviews.map(int => 
          int.id === id ? { ...int, ...data } as Interview : int
        )
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update interview' })
    } finally {
      set({ loading: false })
    }
  },

  deleteInterview: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      set(state => ({
        interviews: state.interviews.filter(int => int.id !== id)
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete interview' })
    } finally {
      set({ loading: false })
    }
  },

  // Referrals
  fetchReferrals: async (applicationId) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('applicationId', applicationId)

      if (error) throw error
      set({ referrals: data as Referral[] })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch referrals' })
    } finally {
      set({ loading: false })
    }
  },

  addReferral: async (referral) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert([referral])
        .select()
        .single()

      if (error) throw error
      set(state => ({
        referrals: [...state.referrals, data as Referral]
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add referral' })
    } finally {
      set({ loading: false })
    }
  },

  updateReferral: async (id, referral) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('referrals')
        .update(referral)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      set(state => ({
        referrals: state.referrals.map(ref => 
          ref.id === id ? { ...ref, ...data } as Referral : ref
        )
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update referral' })
    } finally {
      set({ loading: false })
    }
  },

  deleteReferral: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('referrals')
        .delete()
        .eq('id', id)

      if (error) throw error
      set(state => ({
        referrals: state.referrals.filter(ref => ref.id !== id)
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete referral' })
    } finally {
      set({ loading: false })
    }
  },

  addSampleApplication: async () => {
    const store = get()
    await store.addApplication(sampleApplication)
  }
})) 