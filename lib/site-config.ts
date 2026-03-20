export const siteConfig = {
  name:    'Nội thất Đại Dương',
  phone:   process.env.NEXT_PUBLIC_PHONE   ?? '0977 750 900',
  email:   process.env.NEXT_PUBLIC_EMAIL   ?? 'info@noithatdaiduong.net.vn',
  address: process.env.NEXT_PUBLIC_ADDRESS ?? '69 Liêu Bình Hương, Tân Thông Hội, Củ Chi, TP. Hồ Chí Minh',
  mapUrl:  process.env.NEXT_PUBLIC_MAP_URL  ?? 'https://maps.app.goo.gl/koquN7HvmGz3QHEV6',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://noithatdaiduong.net.vn',
}
