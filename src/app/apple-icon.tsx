import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#0f0e0b',
          borderRadius: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Barre dorée en haut */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#c9a84c',
          }}
        />

        {/* Globe — cercle principal */}
        <div
          style={{
            position: 'absolute',
            width: 108,
            height: 108,
            borderRadius: '50%',
            border: '2px solid #c9a84c',
            top: 28,
          }}
        />
        {/* Globe — méridien horizontal */}
        <div
          style={{
            position: 'absolute',
            width: 108,
            height: 1.5,
            background: '#c9a84c',
            opacity: 0.55,
            top: 82,
          }}
        />
        {/* Globe — méridien vertical ellipse */}
        <div
          style={{
            position: 'absolute',
            width: 54,
            height: 108,
            borderRadius: '50%',
            border: '2px solid #c9a84c',
            opacity: 0.55,
            top: 28,
          }}
        />
        {/* Globe — 2e parallèle haut */}
        <div
          style={{
            position: 'absolute',
            width: 86,
            height: 1,
            background: '#c9a84c',
            opacity: 0.3,
            top: 57,
          }}
        />
        {/* Globe — 2e parallèle bas */}
        <div
          style={{
            position: 'absolute',
            width: 86,
            height: 1,
            background: '#c9a84c',
            opacity: 0.3,
            top: 107,
          }}
        />

        {/* Monogramme C */}
        <span
          style={{
            position: 'absolute',
            top: 44,
            color: '#c9a84c',
            fontSize: 72,
            fontStyle: 'italic',
            fontWeight: 900,
            fontFamily: 'Georgia, "Times New Roman", serif',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          C
        </span>

        {/* Label bas */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <span
            style={{
              color: '#c9a84c',
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            FISCAL
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
