import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DateComponent from './Date'

describe('Date Component', () => {
  it('renders date in correct format', () => {
    const dateString = '2024-01-15T00:00:00.000Z'
    render(<DateComponent dateString={dateString} />)
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
  })

  it('renders time element with correct datetime attribute', () => {
    const dateString = '2024-01-15T00:00:00.000Z'
    render(<DateComponent dateString={dateString} />)
    const timeElement = screen.getByText('January 15, 2024')
    expect(timeElement.tagName).toBe('TIME')
    expect(timeElement).toHaveAttribute('datetime', dateString)
  })

  it('returns null when dateString is undefined', () => {
    const { container } = render(<DateComponent dateString={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('formats different date correctly', () => {
    const dateString = '2023-12-25T00:00:00.000Z'
    render(<DateComponent dateString={dateString} />)
    expect(screen.getByText('December 25, 2023')).toBeInTheDocument()
  })

  it('handles leap year dates', () => {
    const dateString = '2024-02-29T00:00:00.000Z'
    render(<DateComponent dateString={dateString} />)
    expect(screen.getByText('February 29, 2024')).toBeInTheDocument()
  })
})
