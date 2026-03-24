import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mockSupabase } from '../../test/mocks/supabase'

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabase }))

const mockUseAuthStore = vi.fn(() => ({ session: null, loading: false }))
vi.mock('../../stores/authStore', () => ({
  useAuthStore: mockUseAuthStore,
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

const { AuthPage } = await import('../AuthPage')

function renderAuthPage() {
  return render(
    <MemoryRouter>
      <AuthPage />
    </MemoryRouter>,
  )
}

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuthStore.mockReturnValue({ session: null, loading: false })
  })

  it('renders email and password inputs on login view by default', () => {
    renderAuthPage()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('calls signInWithPassword on login submit', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { session: { access_token: 't' } },
      error: null,
    })
    renderAuthPage()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() =>
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'pass123',
      }),
    )
  })

  it('navigates to /dashboard on successful login', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { session: { access_token: 't' } },
      error: null,
    })
    renderAuthPage()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'))
  })

  it('shows error when signInWithPassword returns error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'Invalid credentials' },
    })
    renderAuthPage()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument())
  })

  it('switches to signup view when Sign up link is clicked', () => {
    renderAuthPage()
    fireEvent.click(screen.getByText(/sign up/i))
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows VerifyEmailView when signUp returns session:null', async () => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { session: null, user: { id: 'u1' } },
      error: null,
    })
    renderAuthPage()
    fireEvent.click(screen.getByText(/sign up/i))
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText(/check your email/i)).toBeInTheDocument())
  })

  it('switches to reset view when Forgot password link is clicked', () => {
    renderAuthPage()
    fireEvent.click(screen.getByText(/forgot password/i))
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument()
  })

  it('calls resetPasswordForEmail on reset submit', async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null,
    })
    renderAuthPage()
    fireEvent.click(screen.getByText(/forgot password/i))
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.click(screen.getByRole('button', { name: /send reset email/i }))
    await waitFor(() =>
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'a@b.com',
        expect.any(Object),
      ),
    )
  })

  it('redirects to /dashboard if session already exists', () => {
    mockUseAuthStore.mockReturnValue({ session: { access_token: 't' }, loading: false })
    renderAuthPage()
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })
})
