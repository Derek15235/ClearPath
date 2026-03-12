import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { apiFetch } from '../../lib/api'
import { PageSkeleton } from '../ui/Skeleton'
import type { BusinessProfileResponse } from '../../types/business'

export function RequireAuth() {
  const { session, loading: authLoading } = useAuthStore()
  const { hasProfile, setHasProfile } = useOnboardingStore()

  useEffect(() => {
    if (!session || hasProfile !== null) return

    apiFetch<BusinessProfileResponse>('/api/business-profile/')
      .then(() => {
        setHasProfile(true)
      })
      .catch(() => {
        // 404 or network error -- treat as no profile
        setHasProfile(false)
      })
  }, [session, hasProfile, setHasProfile])

  // 1. Auth is still loading
  if (authLoading) return <PageSkeleton />

  // 2. No session -- redirect to auth
  if (!session) return <Navigate to="/auth" replace />

  // 3. Profile status still unknown -- prevent flash of wrong page
  if (hasProfile === null) return <PageSkeleton />

  // 4. Profile missing -- redirect to onboarding
  if (hasProfile === false) return <Navigate to="/onboarding" replace />

  // 5. Fully authenticated with profile
  return <Outlet />
}
