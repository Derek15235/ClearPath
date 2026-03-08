import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { PageSkeleton } from '../components/ui/Skeleton'

const DashboardPage  = lazy(() => import('../pages/DashboardPage'))
const CalendarPage   = lazy(() => import('../pages/CalendarPage'))
const VaultPage      = lazy(() => import('../pages/VaultPage'))
const RiskCenterPage = lazy(() => import('../pages/RiskCenterPage'))
const NotFoundPage   = lazy(() => import('../pages/NotFoundPage'))

const wrap = (Page: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
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
