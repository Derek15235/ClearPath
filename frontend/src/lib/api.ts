import { supabase } from './supabase'

/**
 * Authenticated fetch wrapper for the ClearPath FastAPI backend.
 *
 * Required environment variable: VITE_API_URL
 * Example: VITE_API_URL=http://localhost:8000
 *
 * Gets the current Supabase session JWT and attaches it as a Bearer token.
 * Throws an error with status code and response body on non-2xx responses.
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const baseUrl = import.meta.env.VITE_API_URL as string
  const url = `${baseUrl}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error ${response.status}: ${errorText}`)
  }

  return response.json() as Promise<T>
}
