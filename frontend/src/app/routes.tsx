import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '../components/layout/AppLayout'

// Inline page skeleton (Plan 03 creates the real Skeleton component;
// use this inline version here to avoid circular dependency)
function PageLoadingFallback() {
  return (
    <div className="space-y-6 animate-pulse" role="status" aria-label="Loading page...">
      <div className="h-8 w-48 rounded-lg bg-surface-raised" />
      <div className="h-4 w-96 rounded-lg bg-surface-raised" />
      <div className="h-64 rounded-xl bg-surface-raised mt-8" />
    </div>
  )
}

const DashboardPage  = lazy(() => import('../pages/DashboardPage'))
const CalendarPage   = lazy(() => import('../pages/CalendarPage'))
const VaultPage      = lazy(() => import('../pages/VaultPage'))
const RiskCenterPage = lazy(() => import('../pages/RiskCenterPage'))
const NotFoundPage   = lazy(() => import('../pages/NotFoundPage'))

const wrap = (Page: React.ComponentType) => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Page />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',   element: wrap(DashboardPage) },
      { path: 'calendar',    element: wrap(CalendarPage) },
      { path: 'vault',       element: wrap(VaultPage) },
      { path: 'risk-center', element: wrap(RiskCenterPage) },
      { path: '*',           element: wrap(NotFoundPage) },
    ],
  },
])
