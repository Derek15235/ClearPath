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

const { RequireAuth } = await import('../RequireAuth')

function renderWithRouter(authState: { session: unknown; loading: boolean }) {
  mockUseAuthStore.mockReturnValue(authState)
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/auth" element={<div>Auth Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  it('renders protected content when session exists', () => {
    renderWithRouter({ session: { access_token: 'tok' }, loading: false })
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
