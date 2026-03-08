import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'
import { Card } from '../Card'
import { PageHeader } from '../PageHeader'

describe('Button', () => {
  it('renders children in primary variant', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('shows spinner and disables interaction when loading=true', () => {
    render(<Button loading>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
    // spinner is present, children text is replaced
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })

  it('renders danger variant button', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('accepts and applies custom className', () => {
    render(<Button className="extra-class">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('extra-class')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies rounded-xl class', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('rounded-xl')
  })
})

describe('PageHeader', () => {
  it('renders title as h1', () => {
    render(<PageHeader title="Dashboard" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
  })

  it('renders optional description', () => {
    render(<PageHeader title="Dashboard" description="Your compliance overview" />)
    expect(screen.getByText('Your compliance overview')).toBeInTheDocument()
  })

  it('renders without description when not provided', () => {
    render(<PageHeader title="Dashboard" />)
    // No description paragraph rendered
    expect(screen.queryByText(/overview/)).not.toBeInTheDocument()
  })
})
