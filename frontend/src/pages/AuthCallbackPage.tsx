import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PageSkeleton } from '../components/ui/Skeleton'

/**
 * Handles Supabase email callback URLs:
 * - Email verification: Supabase processes the token from URL hash automatically on getSession()
 * - Password recovery: type=recovery in query string
 * After processing, redirects to /dashboard (session will be set by onAuthStateChange)
 */
export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/auth', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <PageSkeleton />
    </div>
  )
}
