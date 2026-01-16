/// <reference types="@vitest/browser/providers/playwright" />

declare module '@testing-library/react' {
  export * from '@testing-library/dom'
  export { render, renderHook } from '@testing-library/react'
}
