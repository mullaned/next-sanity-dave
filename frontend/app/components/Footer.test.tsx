import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer Component', () => {
  it('renders the footer', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(<Footer />)
    const logo = screen.getByAltText('logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '150')
    expect(logo).toHaveAttribute('height', '150')
  })

  it('renders navigation links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'House' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Location' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'WFH' })).toBeInTheDocument()
  })

  it('renders House link with correct href', () => {
    render(<Footer />)
    const houseLink = screen.getByRole('link', { name: 'House' })
    expect(houseLink).toHaveAttribute('href', '/house')
  })

  it('renders Location link with correct href', () => {
    render(<Footer />)
    const locationLink = screen.getByRole('link', { name: 'Location' })
    expect(locationLink).toHaveAttribute('href', '/location')
  })

  it('renders WFH link with correct href', () => {
    render(<Footer />)
    const wfhLink = screen.getByRole('link', { name: 'WFH' })
    expect(wfhLink).toHaveAttribute('href', '/wfh')
  })

  it('renders copyright text with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} WAW Farm. All rights reserved`)).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('bg-gray-50', 'relative')
  })

  it('renders navigation list with correct structure', () => {
    const { container } = render(<Footer />)
    const navList = container.querySelector('ul')
    expect(navList).toBeInTheDocument()
    expect(navList?.querySelectorAll('li')).toHaveLength(3)
  })

  it('applies hover styles to links', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link', { name: /House|Location|WFH/ })
    links.forEach((link) => {
      expect(link).toHaveClass('hover:underline')
    })
  })
})
