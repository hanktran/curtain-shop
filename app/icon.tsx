import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Valance / top bar */}
        <div style={{ width: '100%', height: 8, background: '#1d4ed8', display: 'flex' }} />

        {/* Main area: left curtain | window glow | right curtain */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: 9,  background: '#2563eb', display: 'flex' }} />
          <div style={{ flex: 1,   background: '#fef3c7', display: 'flex' }} />
          <div style={{ width: 9,  background: '#2563eb', display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
