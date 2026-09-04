'use client'

import { useEffect } from 'react'

export default function DevErrorFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const origError = console.error
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : ''
      if (
        msg.includes('Hydration failed because the server rendered HTML') ||
        msg.includes('__next_metadata_boundary__') ||
        msg.includes('Encountered a script tag while rendering')
      ) {
        return
      }
      origError.apply(console, args)
    }

    return () => {
      console.error = origError
    }
  }, [])

  return null
}
