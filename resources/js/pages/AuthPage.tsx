import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

type AuthView = 'login' | 'signup' | 'verify-email' | 'reset-password' | 'update-password'

interface FormValues {
  email: string
  password: string
}

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { session } = useAuthStore()
  const [view, setView] = useState<AuthView>(
    (searchParams.get('view') as AuthView) ?? 'login'
  )
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [pendingEmail, setPendingEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>()

  // Redirect if already authenticated
  useEffect(() => {
    if (session && view !== 'update-password') navigate('/dashboard', { replace: true })
  }, [session, navigate])

  async function onLogin({ email, password }: FormValues) {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  async function onSignup({ email, password }: FormValues) {
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    if (data.session === null) {
      setPendingEmail(email)
      setView('verify-email')
    } else {
      navigate('/dashboard')
    }
  }

  async function onResend() {
    setError(null)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: pendingEmail,
    })
    if (error) {
      setError(error.message)
    } else {
      setInfo('Verification email resent.')
    }
  }

  async function onUpdatePassword({ password }: FormValues) {
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard', { replace: true })
  }

  async function onReset({ email }: FormValues) {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })
    if (error) {
      setError(error.message)
      return
    }
    setInfo('Check your email for a password reset link.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-content tracking-tight">ClearPath</h1>
          <p className="text-sm text-content-secondary mt-1">Compliance made simple</p>
        </div>

        <Card padding="none" className="p-6 space-y-5">
          {view === 'login' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-content">Sign in</h2>
                <p className="text-sm text-content-secondary">Welcome back</p>
              </div>
              <form onSubmit={handleSubmit(onLogin)} className="space-y-4" noValidate>
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { required: true })}
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { required: true })}
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                  Sign in
                </Button>
              </form>
              <div className="text-center space-y-2 text-sm text-content-secondary">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setView('reset-password')
                  }}
                  className="hover:text-content transition-colors"
                >
                  Forgot password?
                </button>
                <p>
                  No account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setView('signup')
                    }}
                    className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}

          {view === 'signup' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-content">Create account</h2>
                <p className="text-sm text-content-secondary">Get started with ClearPath</p>
              </div>
              <form onSubmit={handleSubmit(onSignup)} className="space-y-4" noValidate>
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { required: true })}
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password', { required: true })}
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                  Create account
                </Button>
              </form>
              <p className="text-center text-sm text-content-secondary">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setView('login')
                  }}
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {view === 'verify-email' && (
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold text-content">Check your email</h2>
              <p className="text-sm text-content-secondary">
                We sent a verification link to{' '}
                <span className="text-content font-medium">{pendingEmail}</span>. Click the link to
                activate your account.
              </p>
              {error && <p className="text-sm text-error">{error}</p>}
              {info && <p className="text-sm text-primary-400">{info}</p>}
              <Button type="button" variant="secondary" onClick={onResend} className="w-full">
                Resend verification email
              </Button>
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-sm text-content-secondary hover:text-content transition-colors"
              >
                Back to sign in
              </button>
            </div>
          )}

          {view === 'reset-password' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-content">Reset password</h2>
                <p className="text-sm text-content-secondary">
                  Enter your email to receive a reset link
                </p>
              </div>
              {info ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-content-secondary">{info}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setInfo(null)
                      setView('login')
                    }}
                    className="text-sm text-content-secondary hover:text-content transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onReset)} className="space-y-4" noValidate>
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    {...register('email', { required: true })}
                  />
                  {error && <p className="text-sm text-error">{error}</p>}
                  <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                    Send reset email
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null)
                        setView('login')
                      }}
                      className="text-sm text-content-secondary hover:text-content transition-colors"
                    >
                      Back to sign in
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
          {view === 'update-password' && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-content">Set new password</h2>
                <p className="text-sm text-content-secondary">Choose a new password for your account</p>
              </div>
              <form onSubmit={handleSubmit(onUpdatePassword)} className="space-y-4" noValidate>
                <Input
                  id="password"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password', { required: true })}
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                  Update password
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
