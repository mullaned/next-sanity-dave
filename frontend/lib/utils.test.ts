import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('merges class names', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    const result = cn('class1', false && 'class2', 'class3')
    expect(result).toBe('class1 class3')
  })

  it('merges tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('handles undefined values', () => {
    const result = cn('class1', undefined, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles null values', () => {
    const result = cn('class1', null, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles empty strings', () => {
    const result = cn('class1', '', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles objects with boolean values', () => {
    const result = cn({ class1: true, class2: false, class3: true })
    expect(result).toBe('class1 class3')
  })

  it('returns empty string for no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('merges conflicting tailwind classes (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('handles complex tailwind merging scenarios', () => {
    const result = cn('bg-red-500 text-white', 'bg-blue-500')
    expect(result).toBe('text-white bg-blue-500')
  })

  it('handles multiple conflicting responsive classes', () => {
    const result = cn('p-2 md:p-4', 'p-3')
    expect(result).toBe('md:p-4 p-3')
  })

  it('combines clsx and tailwind-merge functionality', () => {
    const isActive = true
    const result = cn('base-class', {
      'active-class': isActive,
      'inactive-class': !isActive,
    })
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
    expect(result).not.toContain('inactive-class')
  })

  it('handles nested arrays', () => {
    const result = cn('class1', ['class2', ['class3', 'class4']])
    expect(result).toBe('class1 class2 class3 class4')
  })

  it('merges hover and focus variants correctly', () => {
    const result = cn('hover:bg-red-500', 'hover:bg-blue-500')
    expect(result).toBe('hover:bg-blue-500')
  })
})
