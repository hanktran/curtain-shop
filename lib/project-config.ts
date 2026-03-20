export const roomTypes: Record<string, string> = {
  apartment: 'Căn hộ',
  villa: 'Biệt thự',
  office: 'Văn phòng',
  hotel: 'Khách sạn',
  showroom: 'Showroom',
  restaurant: 'Nhà hàng',
}

export const roomTypeList = Object.keys(roomTypes) as [string, ...string[]]