import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'
export const alt = 'Nội thất Đại Dương'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const businessName = 'Nội thất Đại Dương'
const tagline = 'Rèm cửa • Sàn gỗ • Giấy dán tường • Tranh 3D'

export default function Image() {
  const phone = process.env.NEXT_PUBLIC_PHONE || '0977 750 900'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          backgroundColor: '#0A6974',
          color: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 86, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{businessName}</div>
        <div style={{ marginTop: 22, fontSize: 38, fontWeight: 500, opacity: 0.95 }}>{tagline}</div>
        <div style={{ marginTop: 44, fontSize: 34, fontWeight: 600 }}>Hotline: {phone}</div>
      </div>
    ),
    {
      ...size,
    }
  )
}