import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { PageSkeleton } from '../ui/Skeleton'

export function RequireAuth() {
  const { session, loading } = useAuthStore()

  if (loading) return <PageSkeleton />
  if (!session) return <Navigate to="/auth" replace />
  return <Outlet />
}
