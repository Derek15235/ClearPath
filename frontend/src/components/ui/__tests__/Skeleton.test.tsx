import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Skeleton, PageSkeleton } from '../Skeleton'
import { ErrorState } from '../ErrorState'

describe('Skeleton', () => {
  it('renders with role="status"', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('defaults aria-label to "Loading..."', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading...')
  })

  it('accepts custom aria-label', () => {
    render(<Skeleton aria-label="Loading user data" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading user data')
  })

  it('accepts and merges custom className', () => {
    render(<Skeleton className="h-8 w-48" />)
    expect(screen.getByRole('status')).toHaveClass('h-8', 'w-48')
  })
})

describe('PageSkeleton', () => {
  it('renders with role="status" and label "Loading page..."', () => {
    render(<PageSkeleton />)
    expect(screen.getByRole('status', { name: 'Loading page...' })).toBeInTheDocument()
  })
})

describe('ErrorState', () => {
  it('renders with role="alert"', () => {
    render(<ErrorState />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders default title and message', () => {
    render(<ErrorState />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/unexpected error/)).toBeInTheDocument()
  })

  it('renders custom title and message', () => {
    render(<ErrorState title="Custom Error" message="Custom message" />)
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Custom message')).toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', async () => {
    const user = userEvent.setup()
    const handleRetry = vi.fn()
    render(<ErrorState onRetry={handleRetry} />)
    const retryBtn = screen.getByRole('button', { name: /try again/i })
    expect(retryBtn).toBeInTheDocument()
    await user.click(retryBtn)
    expect(handleRetry).toHaveBeenCalledOnce()
  })

  it('omits retry button when onRetry is not provided', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
  })
})
