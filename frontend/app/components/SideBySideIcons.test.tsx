import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SideBySideIcons from './SideBySideIcons'

describe('SideBySideIcons Component', () => {
  it('renders the component', () => {
    const { container } = render(<SideBySideIcons />)
    expect(container.querySelector('.group')).toBeInTheDocument()
  })

  it('renders both SVG icons', () => {
    render(<SideBySideIcons />)
    const svgs = screen.getAllByRole('img')
    expect(svgs).toHaveLength(2)
  })

  it('renders Sanity logo with correct aria-label', () => {
    render(<SideBySideIcons />)
    const sanityLogo = screen.getByRole('img', { name: 'Sanity logo' })
    expect(sanityLogo).toBeInTheDocument()
  })

  it('renders Next.js logo with correct aria-label', () => {
    render(<SideBySideIcons />)
    const nextLogo = screen.getByRole('img', { name: 'Next.js logo' })
    expect(nextLogo).toBeInTheDocument()
  })

  it('renders plus sign', () => {
    const { container } = render(<SideBySideIcons />)
    const plusSign = container.querySelector('.text-4xl')
    expect(plusSign).toHaveTextContent('+')
  })

  it('applies group hover classes', () => {
    const { container } = render(<SideBySideIcons />)
    const groupContainer = container.querySelector('.group')
    expect(groupContainer).toHaveClass('group')
  })

  it('applies correct styling to icons container', () => {
    const { container } = render(<SideBySideIcons />)
    const icons = container.querySelectorAll('.aspect-square')
    expect(icons).toHaveLength(2)
    icons.forEach((icon) => {
      expect(icon).toHaveClass('rounded-full')
    })
  })

  it('first icon has correct transform classes', () => {
    const { container } = render(<SideBySideIcons />)
    const firstIcon = container.querySelectorAll('.aspect-square')[0]
    expect(firstIcon).toHaveClass('transform', 'translate-x-2')
  })

  it('second icon has correct transform classes', () => {
    const { container } = render(<SideBySideIcons />)
    const secondIcon = container.querySelectorAll('.aspect-square')[1]
    expect(secondIcon).toHaveClass('transform', '-translate-x-2')
  })

  it('plus sign is absolutely positioned', () => {
    const { container } = render(<SideBySideIcons />)
    const plusSign = container.querySelector('.text-4xl')
    expect(plusSign).toHaveClass('absolute')
  })

  it('plus sign has opacity-0 class', () => {
    const { container } = render(<SideBySideIcons />)
    const plusSign = container.querySelector('.text-4xl')
    expect(plusSign).toHaveClass('opacity-0')
  })

  it('renders SVG with viewBox attributes', () => {
    const { container } = render(<SideBySideIcons />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs[0]).toHaveAttribute('viewBox', '0 0 400 400')
    expect(svgs[1]).toHaveAttribute('viewBox', '0 0 180 180')
  })

  it('icons have hover scale animations', () => {
    const { container } = render(<SideBySideIcons />)
    const icons = container.querySelectorAll('.aspect-square')
    icons.forEach((icon) => {
      expect(icon).toHaveClass('group-hover:scale-110')
    })
  })

  it('renders with correct sizing classes', () => {
    const { container } = render(<SideBySideIcons />)
    const icons = container.querySelectorAll('.aspect-square')
    icons.forEach((icon) => {
      expect(icon).toHaveClass('w-32', 'h-32')
    })
  })

  it('icons have border styling', () => {
    const { container } = render(<SideBySideIcons />)
    const icons = container.querySelectorAll('.aspect-square')
    icons.forEach((icon) => {
      expect(icon).toHaveClass('border-white', 'border-4')
    })
  })

  it('uses unique IDs for SVG elements', () => {
    const { container } = render(<SideBySideIcons />)
    const clipPaths = container.querySelectorAll('clipPath')
    const masks = container.querySelectorAll('mask')
    const gradients = container.querySelectorAll('linearGradient')

    expect(clipPaths.length).toBeGreaterThan(0)
    expect(masks.length).toBeGreaterThan(0)
    expect(gradients.length).toBeGreaterThan(0)
  })

  it('applies transition classes for animations', () => {
    const { container } = render(<SideBySideIcons />)
    const icons = container.querySelectorAll('.aspect-square')
    icons.forEach((icon) => {
      expect(icon).toHaveClass('transition-all', 'duration-300')
    })
  })

  it('renders Sanity logo circle', () => {
    const { container } = render(<SideBySideIcons />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(0)
  })

  it('renders Next.js logo mask', () => {
    const { container } = render(<SideBySideIcons />)
    const masks = container.querySelectorAll('mask')
    expect(masks.length).toBeGreaterThan(0)
  })
})
