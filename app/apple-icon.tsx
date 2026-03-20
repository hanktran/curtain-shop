import { ImageResponse } from 'next/og'

export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Valance */}
        <div style={{ width: '100%', height: 46, background: '#1d4ed8', display: 'flex' }} />

        {/* Left curtain | window glow | right curtain */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: 50, background: '#2563eb', display: 'flex' }} />
          <div style={{ flex: 1,  background: '#fef3c7', display: 'flex' }} />
          <div style={{ width: 50, background: '#2563eb', display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
