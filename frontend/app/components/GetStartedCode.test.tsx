import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GetStartedCode from './GetStartedCode'

describe('GetStartedCode Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('renders the command text', () => {
    render(<GetStartedCode />)
    expect(
      screen.getByText(
        /npm create sanity@latest -- --template sanity-io\/sanity-template-nextjs-clean/,
      ),
    ).toBeInTheDocument()
  })

  it('renders the copy button', () => {
    render(<GetStartedCode />)
    const copyButton = screen.getByLabelText('Copy to clipboard')
    expect(copyButton).toBeInTheDocument()
  })

  it('copies command to clipboard when button is clicked', async () => {
    render(<GetStartedCode />)
    const copyButton = screen.getByLabelText('Copy to clipboard')

    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'npm create sanity@latest -- --template sanity-io/sanity-template-nextjs-clean',
    )
  })

  it('shows tooltip after copying', async () => {
    render(<GetStartedCode />)
    const copyButton = screen.getByLabelText('Copy to clipboard')

    // Initially desktop tooltip should be hidden
    const tooltips = screen.getAllByText('Copied!')
    const desktopTooltip = tooltips.find((el) => el.classList.contains('md:block'))
    expect(desktopTooltip).toHaveClass('opacity-0')

    fireEvent.click(copyButton)

    // After click, tooltip should be visible
    await waitFor(() => {
      const tooltipsAfter = screen.getAllByText('Copied!')
      const desktopTooltipAfter = tooltipsAfter.find((el) => el.classList.contains('md:block'))
      expect(desktopTooltipAfter).toHaveClass('opacity-100')
    })
  })

  it('shows and hides tooltip', async () => {
    const { rerender } = render(<GetStartedCode />)
    const copyButton = screen.getByLabelText('Copy to clipboard')

    // Initially desktop tooltip should be hidden
    const tooltips = screen.getAllByText('Copied!')
    const desktopTooltip = tooltips.find((el) => el.classList.contains('md:block'))
    expect(desktopTooltip).toHaveClass('opacity-0')

    fireEvent.click(copyButton)

    // After click, desktop tooltip should be visible
    rerender(<GetStartedCode />)
    const tooltipsAfter = screen.getAllByText('Copied!')
    const desktopTooltipAfter = tooltipsAfter.find((el) => el.classList.contains('md:block'))
    expect(desktopTooltipAfter).toHaveClass('opacity-100')
  })

  it('renders SVG icon', () => {
    const { container } = render(<GetStartedCode />)
    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
    expect(svgElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('has correct button styling classes', () => {
    render(<GetStartedCode />)
    const copyButton = screen.getByLabelText('Copy to clipboard')

    expect(copyButton).toHaveClass('bg-blue')
    expect(copyButton).toHaveClass('hover:bg-yellow')
    expect(copyButton).toHaveClass('hover:text-black')
  })

  it('renders mobile-specific text content', () => {
    render(<GetStartedCode />)
    // The "Copy Snippet" text should be present but hidden on md screens
    const mobileText = screen.getByText('Copy Snippet')
    expect(mobileText).toBeInTheDocument()
    expect(mobileText).toHaveClass('md:hidden')
  })

  it('handles multiple rapid clicks', async () => {
    vi.useFakeTimers()
    render(<GetStartedCode />)
    const copyButton = screen.getByLabelText('Copy to clipboard')

    // Click multiple times
    fireEvent.click(copyButton)
    fireEvent.click(copyButton)
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3)

    vi.useRealTimers()
  })
})
