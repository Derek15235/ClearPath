import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { mockSupabase } from '../../../test/mocks/supabase'

vi.mock('../../../lib/supabase', () => ({ supabase: mockSupabase }))

import { TopNavigationBar } from '../TopNavigationBar'

function renderNav(initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <TopNavigationBar />
    </MemoryRouter>
  )
}

describe('TopNavigationBar', () => {
  it('renders brand logo text "ClearPath"', () => {
    renderNav()
    expect(screen.getByText('ClearPath')).toBeInTheDocument()
  })

  it('renders all four nav links', () => {
    renderNav()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Vault' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Risk Center' })).toBeInTheDocument()
  })

  it('renders user profile menu trigger button', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /user profile menu/i })).toBeInTheDocument()
  })

  it('renders mobile hamburger button', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })
})
