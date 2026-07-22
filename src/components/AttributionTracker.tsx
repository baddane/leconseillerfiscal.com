'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'

// Fige l'origine (UTM + referrer) dès la première page de la session.
// Rendu globalement dans le layout ; ne rend rien.
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}
