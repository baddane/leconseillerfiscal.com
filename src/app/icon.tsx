import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0f0e0b',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Globe — cercle extérieur */}
        <div
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '1.5px solid #c9a84c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {/* Globe — méridien horizontal */}
        <div
          style={{
            position: 'absolute',
            width: 20,
            height: 1,
            background: '#c9a84c',
            opacity: 0.6,
          }}
        />
        {/* Globe — méridien vertical (ellipse) */}
        <div
          style={{
            position: 'absolute',
            width: 10,
            height: 20,
            borderRadius: '50%',
            border: '1.5px solid #c9a84c',
            opacity: 0.6,
          }}
        />
        {/* Lettre C — centre */}
        <span
          style={{
            position: 'absolute',
            color: '#c9a84c',
            fontSize: 13,
            fontStyle: 'italic',
            fontWeight: 900,
            fontFamily: 'Georgia, "Times New Roman", serif',
            lineHeight: 1,
            textShadow: '0 0 6px rgba(201,168,76,0.4)',
          }}
        >
          C
        </span>
      </div>
    ),
    { ...size },
  )
}
