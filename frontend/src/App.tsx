import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useAuthStore } from './store/authStore'
import { Skeleton } from './components/ui'

// Lazy loaded pages for performance
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'))
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'))
const UserDashboard = lazy(() => import('./pages/UserDashboard/UserDashboard'))
const NewComplaint = lazy(() => import('./pages/UserDashboard/NewComplaint'))
const ComplaintTracking = lazy(() => import('./pages/ComplaintTracking/ComplaintTracking'))
const MapPage = lazy(() => import('./pages/Map/MapPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'))
const OfficerDashboard = lazy(() => import('./pages/OfficerDashboard/OfficerDashboard'))
const AnalyticsPage = lazy(() => import('./pages/Analytics/AnalyticsPage'))
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'))
const AboutPage = lazy(() => import('./pages/Landing/AboutPage'))
const ContactPage = lazy(() => import('./pages/Landing/ContactPage'))

import { ProtectedRoute } from './components/auth/ProtectedRoute'

// --- Loading Fallback ---
const PageLoader = () => (
  <div className="min-h-screen pt-24 px-6 max-w-[1600px] mx-auto">
    <Skeleton className="h-20 w-1/3 mb-10" />
    <div className="grid grid-cols-4 gap-6 mb-10">
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
    </div>
    <Skeleton className="h-[400px] rounded-[3rem]" />
  </div>
)

import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<AppShell />}>
              {/* Public Routes */}
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="complaints/track/:id" element={<ComplaintTracking />} />
              <Route path="complaints/map" element={<MapPage />} />

              {/* Citizen Routes */}
              <Route 
                path="dashboard/citizen" 
                element={<ProtectedRoute allowedRoles={['citizen']}><UserDashboard /></ProtectedRoute>} 
              />
              <Route 
                path="complaints/new" 
                element={<ProtectedRoute><NewComplaint /></ProtectedRoute>} 
              />
              <Route 
                path="profile" 
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
              />

              {/* Officer Routes */}
              <Route 
                path="dashboard/officer" 
                element={<ProtectedRoute allowedRoles={['officer']}><OfficerDashboard /></ProtectedRoute>} 
              />

              {/* Admin Routes */}
              <Route 
                path="dashboard/admin" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'zonal_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
