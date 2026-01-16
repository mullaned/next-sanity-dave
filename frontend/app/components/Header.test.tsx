import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Header from './Header'

describe('Header Component', () => {
  it('renders the header', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(<Header />)
    const logo = screen.getByAltText('WAW Farm')
    expect(logo).toBeInTheDocument()
  })

  it('renders home link with logo', () => {
    render(<Header />)
    const homeLinks = screen.getAllByRole('link')
    const homeLink = homeLinks.find((link) => link.getAttribute('href') === '/')
    expect(homeLink).toBeInTheDocument()
  })

  it('renders desktop navigation links', () => {
    render(<Header />)
    const navLinks = screen.getAllByRole('link', { name: 'House' })
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('renders House link with correct href', () => {
    render(<Header />)
    const houseLink = screen.getAllByRole('link', { name: 'House' })[0]
    expect(houseLink).toHaveAttribute('href', '/house')
  })

  it('renders Location link with correct href', () => {
    render(<Header />)
    const locationLink = screen.getAllByRole('link', { name: 'Location' })[0]
    expect(locationLink).toHaveAttribute('href', '/location')
  })

  it('renders WFH link with correct href', () => {
    render(<Header />)
    const wfhLink = screen.getAllByRole('link', { name: 'WFH' })[0]
    expect(wfhLink).toHaveAttribute('href', '/work-from-home')
  })

  it('renders Book Now button with correct attributes', () => {
    render(<Header />)
    const bookButtons = screen.getAllByRole('link', { name: /Book Now/i })
    const desktopButton = bookButtons[0]
    expect(desktopButton).toHaveAttribute('href', 'https://airbnb.com/h/wawfarm')
    expect(desktopButton).toHaveAttribute('target', '_blank')
  })

  it('applies fixed header styling', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('fixed', 'bg-white/80')
  })

  it('applies backdrop blur effect', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('backdrop-blur-lg')
  })

  it('renders navigation element', () => {
    render(<Header />)
    const navs = screen.getAllByRole('navigation')
    expect(navs.length).toBeGreaterThan(0)
  })

  it('applies button styling to Book Now link', () => {
    render(<Header />)
    const bookButtons = screen.getAllByRole('link', { name: /Book Now/i })
    expect(bookButtons[0]).toHaveClass('rounded-full', 'bg-waw-btn')
  })

  it('renders mobile menu button', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button', { name: /Toggle menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it('toggles mobile menu when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    // Menu should not be visible initially
    expect(screen.queryByText('House')).toBeInTheDocument()

    // Click to open menu
    const menuButton = screen.getByRole('button', { name: /Toggle menu/i })
    await user.click(menuButton)

    // Mobile menu items should be visible
    const houseLinks = screen.getAllByRole('link', { name: 'House' })
    expect(houseLinks.length).toBeGreaterThanOrEqual(2) // Desktop + Mobile
  })
})
