import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (loading) => set({ loading }),
}))

/**
 * Call once at app root (main.tsx) -- outside React render.
 * Resolves current session, then subscribes to future auth changes.
 * Returns the unsubscribe function for cleanup.
 */
export async function initAuth(): Promise<() => void> {
  const { data } = await supabase.auth.getSession()
  useAuthStore.getState().setSession(data.session)
  useAuthStore.getState().setLoading(false)

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session)
  })

  return () => subscription.unsubscribe()
}
