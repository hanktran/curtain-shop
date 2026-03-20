import { Clock, Mail, MapPin, Phone, ShieldCheck, Star, Truck } from 'lucide-react'
import type { Metadata } from 'next'

import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Tìm hiểu về Nội thất Đại Dương — hơn 10 năm kinh nghiệm cung cấp rèm cửa, sàn gỗ, giấy dán tường và tranh 3D chất lượng cao tại Việt Nam.',
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Chất lượng cam kết',
    description: 'Mọi sản phẩm đều được chọn lọc kỹ càng từ các nhà sản xuất uy tín trong và ngoài nước.',
  },
  {
    icon: Star,
    title: 'Đa dạng mẫu mã',
    description: 'Hàng nghìn mẫu sản phẩm phong phú, cập nhật xu hướng nội thất mới nhất từ châu Á và châu Âu.',
  },
  {
    icon: Truck,
    title: 'Lắp đặt tận nơi',
    description: 'Đội ngũ thi công chuyên nghiệp, lắp đặt nhanh chóng, tư vấn miễn phí tại nhà.',
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-14">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Giới thiệu</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl">
        Nội thất Đại Dương — địa chỉ tin cậy cho mọi nhu cầu trang trí không gian sống tại Việt Nam.
      </p>

      {/* About text */}
      <div className="space-y-5 text-muted-foreground leading-relaxed mb-14">
        <p>
          Được thành lập với tâm huyết mang đến những sản phẩm nội thất chất lượng cao với giá cả hợp lý,{' '}
          <strong className="text-foreground">Nội thất Đại Dương</strong> đã trở thành đối tác tin cậy của hàng
          nghìn gia đình và doanh nghiệp trên khắp Việt Nam.
        </p>
        <p>
          Chúng tôi chuyên cung cấp: <strong className="text-foreground">rèm vải, màn sáo, cửa lưới chống muỗi,
          giàn phơi thông minh, sàn gỗ tự nhiên, sàn gỗ công nghiệp, sàn nhựa, thảm trải sàn,
          giấy dán tường và tranh 3D</strong> — tất cả trong một địa điểm mua sắm duy nhất.
        </p>
        <p>
          Với đội ngũ tư vấn nhiều năm kinh nghiệm, chúng tôi cam kết mang lại giải pháp nội thất tối ưu
          phù hợp với phong cách và ngân sách của từng khách hàng.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14 p-6 rounded-2xl bg-brand text-white">
        {[
          { value: '10+',    label: 'Năm kinh nghiệm' },
          { value: '5.000+', label: 'Công trình hoàn thành' },
          { value: '1.000+', label: 'Mẫu sản phẩm' },
          { value: '100%',   label: 'Tư vấn miễn phí' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-white/70 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 className="text-xl font-bold mb-6">Tại sao chọn chúng tôi?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
        {values.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border bg-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <h2 className="text-xl font-bold mb-6">Liên hệ</h2>
      <div className="rounded-xl border bg-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
        {siteConfig.phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
            <div>
              <p className="font-medium mb-0.5">Điện thoại</p>
              <a href={`tel:${siteConfig.phone}`} className="text-muted-foreground hover:text-brand transition-colors">
                {siteConfig.phone}
              </a>
            </div>
          </div>
        )}
        {siteConfig.email && (
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
            <div>
              <p className="font-medium mb-0.5">Email</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-muted-foreground hover:text-brand transition-colors break-all"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        )}
        {siteConfig.address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
            <div>
              <p className="font-medium mb-0.5">Địa chỉ</p>
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-brand hover:underline"
              >
                {siteConfig.address}
              </a>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3">
          <Clock className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
          <div>
            <p className="font-medium mb-0.5">Giờ làm việc</p>
            <p className="text-muted-foreground">Thứ 2 – Thứ 7: 8:00 – 17:30</p>
          </div>
        </div>
      </div>
    </div>
  )
}
