import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Header from './Header'

describe('Header Component', () => {
  it('renders the header', async () => {
    render(await Header())
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('renders the logo image', async () => {
    render(await Header())
    const logo = screen.getByAltText('logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '100')
    expect(logo).toHaveAttribute('height', '60')
  })

  it('renders home link with logo', async () => {
    render(await Header())
    const homeLinks = screen.getAllByRole('link')
    const homeLink = homeLinks.find((link) => link.getAttribute('href') === '/')
    expect(homeLink).toBeInTheDocument()
  })

  it('renders navigation links', async () => {
    render(await Header())
    expect(screen.getByRole('link', { name: 'House' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Location' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'WFH' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Test Page' })).toBeInTheDocument()
  })

  it('renders House link with correct href', async () => {
    render(await Header())
    const houseLink = screen.getByRole('link', { name: 'House' })
    expect(houseLink).toHaveAttribute('href', '/house')
  })

  it('renders Location link with correct href', async () => {
    render(await Header())
    const locationLink = screen.getByRole('link', { name: 'Location' })
    expect(locationLink).toHaveAttribute('href', '/location')
  })

  it('renders WFH link with correct href', async () => {
    render(await Header())
    const wfhLink = screen.getByRole('link', { name: 'WFH' })
    expect(wfhLink).toHaveAttribute('href', '/wfh')
  })

  it('renders Test Page link with correct href', async () => {
    render(await Header())
    const testPageLink = screen.getByRole('link', { name: 'Test Page' })
    expect(testPageLink).toHaveAttribute('href', '/test-page')
  })

  it('renders Book Now button with correct attributes', async () => {
    render(await Header())
    const bookButton = screen.getByRole('link', { name: 'Book Now' })
    expect(bookButton).toBeInTheDocument()
    expect(bookButton).toHaveAttribute('href', 'https://airbnb.com/h/wawfarm')
    expect(bookButton).toHaveAttribute('target', '_blank')
  })

  it('applies fixed header styling', async () => {
    const { container } = render(await Header())
    const header = container.querySelector('header')
    expect(header).toHaveClass('fixed', 'z-50', 'h-24')
  })

  it('applies backdrop blur effect', async () => {
    const { container } = render(await Header())
    const header = container.querySelector('header')
    expect(header).toHaveClass('backdrop-blur-lg', 'bg-white/80')
  })

  it('renders navigation element', async () => {
    render(await Header())
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('applies button styling to Book Now link', async () => {
    render(await Header())
    const bookButton = screen.getByRole('link', { name: 'Book Now' })
    expect(bookButton).toHaveClass('rounded-full', 'bg-waw-btn')
  })

  it('renders all navigation items in correct order', async () => {
    render(await Header())
    const navItems = screen.getAllByRole('listitem')
    expect(navItems).toHaveLength(4)
    expect(navItems[0]).toHaveTextContent('House')
    expect(navItems[1]).toHaveTextContent('Location')
    expect(navItems[2]).toHaveTextContent('WFH')
    expect(navItems[3]).toHaveTextContent('Test Page')
  })
})
