export interface ProjectRead {
  _id: string
  keyId: string
  data: {
    info?: { code?: string; title_th?: string; title_en?: string }
    property_type?: { title_th?: string; title_en?: string; id?: number }[]
    images?: { main?: { thumbnail?: string; url?: string } }
    general?: { status?: string }
    developer?: { display_name?: string }
    address?: { province_th?: string }
    published?: number
  }
}

export interface Project {
  id: string
  code: string
  name: string
  type: string
  saleStatus: string // สถานะการขาย (general.status) เช่น on-sale
  image: string
  province: string
  published: number // 0 = offline, อื่น ๆ = online
}
