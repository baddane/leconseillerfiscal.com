import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Le Conseiller Fiscal — Fiscalité Expatriation Français'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5f0e8',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#c9a84c',
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: '80px',
            height: '80px',
            background: '#0f0e0b',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: '#c9a84c', fontSize: '44px', fontWeight: 700 }}>C</span>
        </div>

        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            color: '#0f0e0b',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          Le Conseiller Fiscal
        </div>

        <div
          style={{
            fontSize: '28px',
            color: '#c9a84c',
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: '3px',
            textTransform: 'uppercase' as const,
            marginBottom: '24px',
          }}
        >
          Fiscalité · Expatriation · Affiliation
        </div>

        <div
          style={{
            fontSize: '22px',
            color: '#6b6560',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
          }}
        >
          La référence francophone de la fiscalité des expatriés. Guides complets par pays, comparatifs d&apos;outils et ressources gratuites.
        </div>

        {/* Bottom URL bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '16px',
            color: '#6b6560',
            letterSpacing: '2px',
            textTransform: 'uppercase' as const,
          }}
        >
          leconseillerfiscal.com
        </div>
      </div>
    ),
    { ...size }
  )
}
