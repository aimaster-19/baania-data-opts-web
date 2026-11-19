import React from 'react'
import type { IDeveloper } from '../developer'

export type TabType =
  | 'basic'
  | 'address'
  | 'unittype'
  | 'detail'
  | 'facility'
  | 'financial'
  | 'contact'
  | 'ads_meta'
  | 'images'
  | 'video'

export interface PropertyTypeItem {
  id: number
  title_th: string
  title_en: string
}

export interface ProjectFormData {
  // 1. Basic Info
  title_th: string
  title_en: string
  code: string
  search_keyword: string
  property_type: PropertyTypeItem[]
  status: string
  mgnt_status: string
  building_amount: string
  building_description: string
  date_construction: string
  date_finish: string

  // 2. Address & Location
  address_th: string
  address_en: string
  subdistrict_th: string
  subdistrict_en: string
  subdistrict_id: number
  district_th: string
  district_en: string
  district_id: number
  province_th: string
  province_en: string
  province_id: number
  postcode: string
  transport: string
  nearby: string
  neighbors: string
  landzone_name: string
  lat: number
  lon: number
  heading: string

  // 3. Developer
  developer: IDeveloper

  // 3b. Unit Types
  unittype: UnitTypeItem[]

  // 4. Detail
  area_rai: number
  area_ngan: number
  area_wa: number
  num_unit: number
  num_floor: number
  num_lift: number
  num_lift_service: number
  ratio_parking: number
  num_parking: number
  insurance_condition: string
  area_shared: string

  // 4b. Progress
  progress_overall: string
  progress_system: string
  progress_architect: string
  progress_structure: string
  progress_wiring: string

  // 5. Facilities
  has_pool: boolean
  info_pool: string
  has_fitness: boolean
  info_fitness: string
  has_park: boolean
  info_park: string
  has_playground: boolean
  info_playground: string
  has_clubhouse: boolean
  info_clubhouse: string
  has_security: boolean
  info_security: string
  has_meeting: boolean
  info_meeting: string
  has_service_bus: boolean
  info_service_bus: string
  has_other: boolean
  info_other_fac: string

  // 6. Financial & Promotions
  price_start: number
  price_end: number
  price_land: number
  price_start_per_unit: number
  price_end_per_unit: number
  price_facility: string
  unitof_price_facility: string
  ratio_yield: number
  num_yield: string
  insurance_cost: string
  slogan: string
  highlight: string
  detail: string
  promotion: string
  info_rationeccomend: string
  promotion_start: number
  promotion_stop: number
  start_price_not_found: boolean
  not_show_start_price: boolean

  // 7. Contact
  email: string
  facebook: string
  website: string
  line: string
  selloffice_contact_number: string
  selloffice_address: string

  // 7b. Footnote
  info_landlord: string
  info_shared_prop: string
  info_landzone: string
  info_designer: string
  info_land_id: string
  info_license_id: string
  info_financial: string

  // 8. Ads & Meta
  meta_keywords: string
  meta_description: string
  retarget_google: string
  retarget_facebook: string
  retarget_price: string

  // สถานะเผยแพร่ (0 = offline, 1 = online)
  published: number

  // 9. Images
  images: ProjectImages

  // 10. Videos
  video: ProjectVideos
}

export interface ProjectVideoItem {
  thumbnail: string
  title: string
  url: string
}

export interface ProjectVideos {
  video: ProjectVideoItem
  aerial: ProjectVideoItem
  customer: ProjectVideoItem
}

export const emptyProjectVideos = (): ProjectVideos => ({
  video: { thumbnail: '', title: '', url: '' },
  aerial: { thumbnail: '', title: '', url: '' },
  customer: { thumbnail: '', title: '', url: '' }
})

export interface ProjectSimpleImage {
  thumbnail: string
  title: string
  url: string
}

export interface ProjectMainImage {
  thumbnail: string
  title: string
  url: string
  webp_main: string
  webp_thumbnail: string
}

export interface ProjectOverallImage {
  title: string
  url: string
  thumbnail: string
  webp_main: string
  webp_thumbnail: string
}

export interface ProjectImages {
  project: ProjectSimpleImage
  main: ProjectMainImage
  nearby: string
  overall: ProjectOverallImage[]
  map: ProjectSimpleImage
}

export const emptyProjectImages = (): ProjectImages => ({
  project: { thumbnail: '', title: '', url: '' },
  main: {
    thumbnail: '',
    title: '',
    url: '',
    webp_main: '',
    webp_thumbnail: ''
  },
  nearby: '',
  overall: [],
  map: { thumbnail: '', title: '', url: '' }
})

export interface ProjectTabProps {
  formData: ProjectFormData
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
}

export interface UnitTypeItem {
  title: string
  price_start: number
  price_end: number
  area_usable: number
  num_bed: number
  num_bath: number
  sold_out: boolean
}
