import { useEffect } from 'react'
import { useApplicationStore } from '../store/applicationStore'
import { JobApplication, ApplicationStatus } from '../types/application.types'

export const useApplications = () => {
  const {
    applications,
    loading,
    error,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useApplicationStore()

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status)
  }

  const getActiveApplications = () => {
    return applications.filter(app => 
      ['APPLIED', 'INTERVIEWING'].includes(app.status)
    )
  }

  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      active: getActiveApplications().length,
      offered: getApplicationsByStatus('OFFERED').length,
      rejected: getApplicationsByStatus('REJECTED').length,
      accepted: getApplicationsByStatus('ACCEPTED').length,
      withdrawn: getApplicationsByStatus('WITHDRAWN').length,
    }

    const successRate = applications.length > 0
      ? ((stats.offered + stats.accepted) / applications.length * 100).toFixed(1)
      : '0'

    return {
      ...stats,
      successRate: `${successRate}%`,
    }
  }

  const sortApplications = (apps: JobApplication[]) => {
    return [...apps].sort((a, b) => 
      new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
    )
  }

  return {
    applications: sortApplications(applications),
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    getApplicationsByStatus,
    getActiveApplications,
    getApplicationStats,
  }
} 