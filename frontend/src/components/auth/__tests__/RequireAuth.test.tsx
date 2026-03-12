import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

vi.mock('../../../lib/supabase', () => ({
  supabase: { auth: {} },
}))

const mockUseAuthStore = vi.fn()
vi.mock('../../../stores/authStore', () => ({
  useAuthStore: mockUseAuthStore,
}))

const mockUseOnboardingStore = vi.fn()
vi.mock('../../../stores/onboardingStore', () => ({
  useOnboardingStore: mockUseOnboardingStore,
}))

const mockApiFetch = vi.fn()
vi.mock('../../../lib/api', () => ({
  apiFetch: mockApiFetch,
}))

const { RequireAuth } = await import('../RequireAuth')

function renderWithRouter(
  authState: { session: unknown; loading: boolean },
  onboardingState: { hasProfile: boolean | null; setHasProfile: () => void } = {
    hasProfile: true,
    setHasProfile: vi.fn(),
  },
) {
  mockUseAuthStore.mockReturnValue(authState)
  mockUseOnboardingStore.mockReturnValue(onboardingState)
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/auth" element={<div>Auth Page</div>} />
        <Route path="/onboarding" element={<div>Onboarding Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: apiFetch returns a never-resolving promise so we can test the loading state
    mockApiFetch.mockReturnValue(new Promise(() => {}))
  })

  it('renders PageSkeleton when loading is true', () => {
    renderWithRouter({ session: null, loading: true })
    expect(screen.getByRole('status', { name: /loading page/i })).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to /auth when session is null and not loading', () => {
    renderWithRouter({ session: null, loading: false })
    expect(screen.getByText('Auth Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders PageSkeleton when hasProfile is null (profile check pending)', () => {
    renderWithRouter(
      { session: { access_token: 'tok' }, loading: false },
      { hasProfile: null, setHasProfile: vi.fn() },
    )
    expect(screen.getByRole('status', { name: /loading page/i })).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to /onboarding when hasProfile is false', () => {
    renderWithRouter(
      { session: { access_token: 'tok' }, loading: false },
      { hasProfile: false, setHasProfile: vi.fn() },
    )
    expect(screen.getByText('Onboarding Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders protected content when session exists and hasProfile is true', () => {
    renderWithRouter(
      { session: { access_token: 'tok' }, loading: false },
      { hasProfile: true, setHasProfile: vi.fn() },
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
