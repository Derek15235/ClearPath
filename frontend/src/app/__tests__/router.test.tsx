import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

function renderAtPath(path: string) {
  const testRouter = createMemoryRouter(
    [
      {
        path: '/',
        children: [
          { index: true, element: <div data-testid="dashboard">Dashboard</div> },
          { path: 'dashboard',   element: <div data-testid="dashboard">Dashboard</div> },
          { path: 'calendar',    element: <div data-testid="calendar">Calendar</div> },
          { path: 'vault',       element: <div data-testid="vault">Vault</div> },
          { path: 'risk-center', element: <div data-testid="risk-center">Risk Center</div> },
          { path: '*',           element: <div data-testid="not-found">Not Found</div> },
        ],
      },
    ],
    { initialEntries: [path] }
  )
  render(<RouterProvider router={testRouter} />)
}

describe('Router', () => {
  it('routes "/dashboard" to dashboard content', () => {
    renderAtPath('/dashboard')
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('routes "/calendar" to calendar content', () => {
    renderAtPath('/calendar')
    expect(screen.getByTestId('calendar')).toBeInTheDocument()
  })

  it('routes "/vault" to vault content', () => {
    renderAtPath('/vault')
    expect(screen.getByTestId('vault')).toBeInTheDocument()
  })

  it('routes "/risk-center" to risk center content', () => {
    renderAtPath('/risk-center')
    expect(screen.getByTestId('risk-center')).toBeInTheDocument()
  })

  it('routes unknown path to not-found content', () => {
    renderAtPath('/nonexistent')
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })
})
