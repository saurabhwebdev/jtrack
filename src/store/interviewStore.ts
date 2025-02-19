import { create } from 'zustand'
import { Interview, InterviewFormData } from '../types/interview.types'
import { supabase } from '../services/supabase/client'

interface InterviewState {
  interviews: Interview[]
  loading: boolean
  error: string | null
  
  fetchInterviews: (applicationId?: string) => Promise<void>
  addInterview: (interview: InterviewFormData) => Promise<void>
  updateInterview: (id: string, interview: Partial<Interview>) => Promise<void>
  deleteInterview: (id: string) => Promise<void>
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviews: [],
  loading: false,
  error: null,

  fetchInterviews: async (applicationId?: string) => {
    set({ loading: true, error: null })
    try {
      let query = supabase
        .from('interviews')
        .select('*')
        .order('interview_date', { ascending: true })

      if (applicationId) {
        query = query.eq('application_id', applicationId)
      }

      const { data, error } = await query

      if (error) throw error

      // Convert snake_case to camelCase
      const formattedData = data.map(item => ({
        id: item.id,
        applicationId: item.application_id,
        roundNumber: item.round_number,
        interviewDate: item.interview_date,
        interviewType: item.interview_type,
        interviewerName: item.interviewer_name,
        interviewerTitle: item.interviewer_title,
        status: item.status,
        feedback: item.feedback,
        nextSteps: item.next_steps,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Interview[]

      set({ interviews: formattedData })
    } catch (error) {
      console.error('Error in fetchInterviews:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to fetch interviews' })
    } finally {
      set({ loading: false })
    }
  },

  addInterview: async (interview) => {
    set({ loading: true, error: null })
    try {
      // Convert camelCase to snake_case for Supabase
      const formattedData = {
        application_id: interview.applicationId,
        round_number: interview.roundNumber,
        interview_date: interview.interviewDate,
        interview_type: interview.interviewType,
        interviewer_name: interview.interviewerName,
        interviewer_title: interview.interviewerTitle,
        status: interview.status,
        feedback: interview.feedback,
        next_steps: interview.nextSteps,
        notes: interview.notes
      }

      console.log('Sending interview data:', formattedData)

      const { data, error } = await supabase
        .from('interviews')
        .insert([formattedData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Interview added successfully:', data)

      // Convert snake_case back to camelCase
      const newInterview = {
        id: data.id,
        applicationId: data.application_id,
        roundNumber: data.round_number,
        interviewDate: data.interview_date,
        interviewType: data.interview_type,
        interviewerName: data.interviewer_name,
        interviewerTitle: data.interviewer_title,
        status: data.status,
        feedback: data.feedback,
        nextSteps: data.next_steps,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Interview

      set(state => ({
        interviews: [...state.interviews, newInterview]
      }))
    } catch (error) {
      console.error('Error in addInterview:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to add interview' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateInterview: async (id, interview) => {
    set({ loading: true, error: null })
    try {
      // Convert camelCase to snake_case for Supabase
      const formattedData = {
        application_id: interview.applicationId,
        round_number: interview.roundNumber,
        interview_date: interview.interviewDate,
        interview_type: interview.interviewType,
        interviewer_name: interview.interviewerName,
        interviewer_title: interview.interviewerTitle,
        status: interview.status,
        feedback: interview.feedback,
        next_steps: interview.nextSteps,
        notes: interview.notes
      }

      const { data, error } = await supabase
        .from('interviews')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Convert snake_case back to camelCase
      const updatedInterview = {
        id: data.id,
        applicationId: data.application_id,
        roundNumber: data.round_number,
        interviewDate: data.interview_date,
        interviewType: data.interview_type,
        interviewerName: data.interviewer_name,
        interviewerTitle: data.interviewer_title,
        status: data.status,
        feedback: data.feedback,
        nextSteps: data.next_steps,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Interview

      set(state => ({
        interviews: state.interviews.map(int => 
          int.id === id ? updatedInterview : int
        )
      }))
    } catch (error) {
      console.error('Error in updateInterview:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to update interview' })
      throw error
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
      console.error('Error in deleteInterview:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to delete interview' })
      throw error
    } finally {
      set({ loading: false })
    }
  }
})) 