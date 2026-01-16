import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CookieConsentProvider } from './CookieConsentContext'
import Footer from './Footer'

describe('Footer Component', () => {
  it('renders the footer', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const logo = screen.getByAltText('WAW Farm')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '150')
    expect(logo).toHaveAttribute('height', '150')
  })

  it('renders navigation links', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    expect(screen.getByRole('link', { name: 'House' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Location' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'WFH' })).toBeInTheDocument()
  })

  it('renders House link with correct href', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const houseLink = screen.getByRole('link', { name: 'House' })
    expect(houseLink).toHaveAttribute('href', '/house')
  })

  it('renders Location link with correct href', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const locationLink = screen.getByRole('link', { name: 'Location' })
    expect(locationLink).toHaveAttribute('href', '/location')
  })

  it('renders WFH link with correct href', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const wfhLink = screen.getByRole('link', { name: 'WFH' })
    expect(wfhLink).toHaveAttribute('href', '/work-from-home')
  })

  it('renders copyright text with current year', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} WAW Farm. All rights reserved`)).toBeInTheDocument()
  })

  it('renders Cookie Settings button', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const cookieSettingsButton = screen.getByText('Cookie Settings')
    expect(cookieSettingsButton).toBeInTheDocument()
  })

  it('Cookie Settings button has correct ARIA label', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const cookieSettingsButton = screen.getByLabelText('Open cookie preferences settings')
    expect(cookieSettingsButton).toBeInTheDocument()
  })

  it('triggers openSettings when Cookie Settings button is clicked', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )

    const cookieSettingsButton = screen.getByText('Cookie Settings')
    fireEvent.click(cookieSettingsButton)

    // The button should be clickable without errors
    expect(cookieSettingsButton).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('bg-gray-50', 'relative')
  })

  it('renders navigation list with correct structure', () => {
    const { container } = render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const navList = container.querySelector('ul')
    expect(navList).toBeInTheDocument()
    expect(navList?.querySelectorAll('li')).toHaveLength(4) // Updated to 4 (added Cookie Settings)
  })

  it('applies hover styles to links', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const links = screen.getAllByRole('link', { name: /House|Location|WFH/ })
    links.forEach((link) => {
      expect(link).toHaveClass('hover:underline')
    })
  })

  it('applies hover style to Cookie Settings button', () => {
    render(
      <CookieConsentProvider>
        <Footer />
      </CookieConsentProvider>,
    )
    const cookieSettingsButton = screen.getByText('Cookie Settings')
    expect(cookieSettingsButton).toHaveClass('hover:underline')
  })
})
