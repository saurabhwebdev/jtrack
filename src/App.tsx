import { ChakraProvider, Spinner, extendTheme } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { lazy, Suspense } from 'react'
import Layout from './components/common/Layout'

// Lazy load components
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const ApplicationsList = lazy(() => import('./pages/applications/ApplicationsList'))
const NewApplication = lazy(() => import('./pages/applications/NewApplication'))
const EditApplication = lazy(() => import('./pages/applications/EditApplication'))
const ApplicationDetails = lazy(() => import('./pages/applications/ApplicationDetails'))
const InterviewsList = lazy(() => import('./pages/interviews/InterviewsList'))
const NewInterview = lazy(() => import('./pages/interviews/NewInterview'))
const EditInterview = lazy(() => import('./pages/interviews/EditInterview'))
const NewReferral = lazy(() => import('./pages/referrals/NewReferral'))
const EditReferral = lazy(() => import('./pages/referrals/EditReferral'))
const ReferralsList = lazy(() => import('./pages/referrals/ReferralsList'))
const Analytics = lazy(() => import('./pages/analytics/Analytics'))
const Profile = lazy(() => import('./pages/profile/Profile'))
const Settings = lazy(() => import('./pages/profile/Settings'))
const Notifications = lazy(() => import('./pages/profile/Notifications'))
const HelpCenter = lazy(() => import('./pages/help/HelpCenter'))

// Create a custom theme with better defaults
const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.xl',
      },
    },
  },
})

function LoadingSpinner() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <Spinner size="xl" />
    </div>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/applications" element={<ApplicationsList />} />
                          <Route path="/applications/new" element={<NewApplication />} />
                          <Route path="/applications/:id" element={<ApplicationDetails />} />
                          <Route path="/applications/:id/edit" element={<EditApplication />} />
                          <Route path="/interviews" element={<InterviewsList />} />
                          <Route path="/referrals" element={<ReferralsList />} />
                          <Route path="/applications/:applicationId/interviews/new" element={<NewInterview />} />
                          <Route path="/applications/:applicationId/interviews/:interviewId/edit" element={<EditInterview />} />
                          <Route path="/applications/:applicationId/referrals/new" element={<NewReferral />} />
                          <Route path="/applications/:applicationId/referrals/:referralId/edit" element={<EditReferral />} />
                          <Route path="/reports" element={<Analytics />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/profile/settings" element={<Settings />} />
                          <Route path="/profile/notifications" element={<Notifications />} />
                          <Route path="/help" element={<HelpCenter />} />
                        </Routes>
                      </Layout>
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  )
}