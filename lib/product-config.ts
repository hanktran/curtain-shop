// Product taxonomy: English slugs for all URLs

export const types = [
  'curtains-blinds',
  'flooring',
  'wallpaper',
  '3d-art',
] as const

export type ProductType = typeof types[number]

export const typeNames: Record<ProductType, string> = {
  'curtains-blinds': 'Màn vải - Màn sáo',
  'flooring':        'Sàn gỗ - Sàn nhựa',
  'wallpaper':       'Giấy, vải & xốp dán tường',
  '3d-art':          'Tranh 3D',
}

export const typeDescriptions: Record<ProductType, string> = {
  'curtains-blinds': 'Đa dạng mẫu rèm vải, màn sáo, cửa lưới và giàn phơi — giải pháp hoàn hảo cho mọi không gian.',
  'flooring':        'Sàn gỗ tự nhiên, sàn công nghiệp, sàn nhựa và thảm trải sàn chất lượng cao từ các thương hiệu uy tín.',
  'wallpaper':       'Bộ sưu tập giấy dán tường, vải dán tường và xốp 3D đa phong cách — dễ thi công, bền màu lâu dài.',
  '3d-art':          'Tranh 3D nghệ thuật cao cấp, điểm nhấn ấn tượng cho phòng khách, phòng ngủ và không gian thương mại.',
}

// Which categories belong to which type
export const categoriesByType: Record<ProductType, string[]> = {
  'curtains-blinds': ['fabric-curtains', 'blinds', 'mosquito-screens', 'smart-drying-racks'],
  'flooring':        ['natural-wood', 'engineered-wood', 'vinyl-flooring', 'carpet'],
  'wallpaper':       ['wallpaper', 'fabric-wallpaper', 'foam-wallpaper'],
  '3d-art':          ['3d-art'],
}

// Flat list for quick membership checks
export const categories = Object.values(categoriesByType).flat() as [string, ...string[]]

export const catNames: Record<string, string> = {
  'fabric-curtains':   'Màn vải',
  'blinds':            'Màn sáo',
  'mosquito-screens':  'Cửa lưới chống muỗi',
  'smart-drying-racks':'Giàn phơi thông minh',
  'natural-wood':      'Sàn gỗ tự nhiên',
  'engineered-wood':   'Sàn gỗ Á - Âu',
  'vinyl-flooring':    'Sàn nhựa',
  'carpet':            'Thảm trải sàn',
  'wallpaper':         'Giấy dán tường',
  'fabric-wallpaper':  'Vải dán tường',
  'foam-wallpaper':    'Xốp dán tường',
  '3d-art':            'Tranh 3D',
}

export const originNames: Record<string, string> = {
  'viet-nam':    'Việt Nam',
  'thai-lan':    'Thái Lan',
  'ma-lai':      'Malaysia',
  'nhat-ban':    'Nhật Bản',
  'bi':          'Bỉ',
  'dai-loan':    'Đài Loan',
  'my':          'Mỹ',
  'uc':          'Úc',
  'han-quoc':    'Hàn Quốc',
  'duc':         'Đức',
  'cam-pu-chia': 'Campuchia',
  'lao':         'Lào',
  'nam-phi':     'Nam Phi',
}

export const colorOptions: Record<string, string> = {
  white:  'Trắng',
  beige:  'Be',
  grey:   'Xám',
  brown:  'Nâu',
  green:  'Xanh lá',
  blue:   'Xanh dương',
  red:    'Đỏ',
  yellow: 'Vàng',
  black:  'Đen',
  pink:   'Hồng',
  multi:  'Nhiều màu',
}

export const materialOptions: Record<string, string> = {
  fabric:   'Vải',
  wood:     'Gỗ',
  vinyl:    'Nhựa PVC',
  foam:     'Xốp 3D',
  paper:    'Giấy',
  metal:    'Kim loại',
  bamboo:   'Tre',
  aluminum: 'Nhôm',
}

export function formatPrice(price: string): string {
  if (price === 'Liên hệ' || Number.isNaN(Number(price))) return price
  return price.replaceAll(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' VNĐ'
}

export function formatOrigins(originStr: string) {
  return originStr.split(',').map((o) => ({
    origin: o.trim(),
    name:   originNames[o.trim()] ?? o.trim(),
  }))
}

export function getBreadcrumbs(type: string, category: string, productTitle?: string) {
  const crumbs: { href?: string; name: string }[] = [
    { href: '/', name: 'Trang chủ' },
    { href: `/${type}`, name: typeNames[type as ProductType] ?? type },
  ]
  if (type !== '3d-art') {
    crumbs.push({ href: `/${type}/${category}`, name: catNames[category] ?? category })
  }
  if (productTitle) {
    crumbs.push({ name: productTitle })
  }
  return crumbs
}
