/**
 * Sanity CLI Configuration
 * This file configures the Sanity CLI tool with project-specific settings
 * for the frontend Next.js application.
 * Learn more: https://www.sanity.io/docs/cli
 */

import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '<your project ID>'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  autoUpdates: true,
  typegen: {
    path: './sanity/**/*.{ts,tsx,js,jsx}',
    schema: '../studio/schema.json',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
