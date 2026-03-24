import { mockSupabase } from '../../test/mocks/supabase'

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabase }))

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('initializes with loading:true', async () => {
    const { useAuthStore } = await import('../authStore')
    expect(useAuthStore.getState().loading).toBe(true)
  })

  it('sets session after getSession resolves', async () => {
    const fakeSession = { access_token: 'tok', user: { id: 'u1', email: 'a@b.com' } }
    mockSupabase.auth.getSession.mockResolvedValueOnce({ data: { session: fakeSession }, error: null })
    const { useAuthStore, initAuth } = await import('../authStore')
    await initAuth()
    expect(useAuthStore.getState().session).toEqual(fakeSession)
  })

  it('sets loading:false after initAuth resolves', async () => {
    const { useAuthStore, initAuth } = await import('../authStore')
    await initAuth()
    expect(useAuthStore.getState().loading).toBe(false)
  })
})
