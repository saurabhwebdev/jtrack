import { create } from 'zustand'
import { Referral } from '../types/application.types'
import { supabase } from '../services/supabase/client'

interface ReferralState {
  referrals: Referral[]
  loading: boolean
  error: string | null
  
  fetchReferrals: (applicationId?: string) => Promise<void>
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateReferral: (id: string, referral: Partial<Referral>) => Promise<void>
  deleteReferral: (id: string) => Promise<void>
}

export const useReferralStore = create<ReferralState>((set, get) => ({
  referrals: [],
  loading: false,
  error: null,

  fetchReferrals: async (applicationId?: string) => {
    set({ loading: true, error: null })
    try {
      let query = supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false })

      if (applicationId) {
        query = query.eq('application_id', applicationId)
      }

      const { data, error } = await query

      if (error) throw error

      // Convert snake_case to camelCase
      const formattedData = data.map(item => ({
        id: item.id,
        applicationId: item.application_id,
        referrerName: item.referrer_name,
        referrerEmail: item.referrer_email,
        referrerPhone: item.referrer_phone,
        relationship: item.relationship,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Referral[]

      set({ referrals: formattedData })
    } catch (error) {
      console.error('Error in fetchReferrals:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to fetch referrals' })
    } finally {
      set({ loading: false })
    }
  },

  addReferral: async (referral) => {
    set({ loading: true, error: null })
    try {
      // Convert camelCase to snake_case for Supabase
      const formattedData = {
        application_id: referral.applicationId,
        referrer_name: referral.referrerName,
        referrer_email: referral.referrerEmail,
        referrer_phone: referral.referrerPhone,
        relationship: referral.relationship,
        notes: referral.notes
      }

      console.log('Sending referral data:', formattedData)

      const { data, error } = await supabase
        .from('referrals')
        .insert([formattedData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Referral added successfully:', data)

      // Convert snake_case back to camelCase
      const newReferral = {
        id: data.id,
        applicationId: data.application_id,
        referrerName: data.referrer_name,
        referrerEmail: data.referrer_email,
        referrerPhone: data.referrer_phone,
        relationship: data.relationship,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Referral

      set(state => ({
        referrals: [...state.referrals, newReferral]
      }))
    } catch (error) {
      console.error('Error in addReferral:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to add referral' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateReferral: async (id, referral) => {
    set({ loading: true, error: null })
    try {
      // Convert camelCase to snake_case for Supabase
      const formattedData = {
        application_id: referral.applicationId,
        referrer_name: referral.referrerName,
        referrer_email: referral.referrerEmail,
        referrer_phone: referral.referrerPhone,
        relationship: referral.relationship,
        notes: referral.notes
      }

      const { data, error } = await supabase
        .from('referrals')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Convert snake_case back to camelCase
      const updatedReferral = {
        id: data.id,
        applicationId: data.application_id,
        referrerName: data.referrer_name,
        referrerEmail: data.referrer_email,
        referrerPhone: data.referrer_phone,
        relationship: data.relationship,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Referral

      set(state => ({
        referrals: state.referrals.map(ref => 
          ref.id === id ? updatedReferral : ref
        )
      }))
    } catch (error) {
      console.error('Error in updateReferral:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to update referral' })
      throw error
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
      console.error('Error in deleteReferral:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to delete referral' })
      throw error
    } finally {
      set({ loading: false })
    }
  }
})) 