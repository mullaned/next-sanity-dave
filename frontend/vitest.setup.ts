import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    return React.createElement('img', props)
  },
}))

// Mock next-sanity Image component
vi.mock('next-sanity/image', () => ({
  Image: (props: any) => {
    return React.createElement('img', { ...props, src: props.src || '' })
  },
}))
