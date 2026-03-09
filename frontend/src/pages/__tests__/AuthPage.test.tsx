import { mockSupabase } from '../../test/mocks/supabase'

vi.mock('../../lib/supabase', () => ({ supabase: mockSupabase }))

describe('AuthPage', () => {
  it.todo('renders email and password inputs')
  it.todo('calls signUp on form submit')
  it.todo('shows verify-email view when signUp returns session:null')
  it.todo('calls signInWithPassword and navigates to /dashboard on login success')
  it.todo('calls resetPasswordForEmail and shows confirmation in card')
})
