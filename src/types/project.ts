import React from 'react'

export type TabType =
  | 'basic'
  | 'address'
  | 'developer'
  | 'detail'
  | 'facility'
  | 'financial'
  | 'contact'
  | 'ads_meta'
  | 'images'

export interface ProjectFormData {
  // 1. Basic Info
  title_th: string
  title_en: string
  code: string
  search_keyword: string
  property_type: string
  status: string
  mgnt_status: string
  building_amount: string

  // 2. Address & Location
  address_th: string
  address_en: string
  subdistrict_th: string
  subdistrict_en: string
  subdistrict_id: string
  district_th: string
  district_en: string
  district_id: string
  province_th: string
  province_en: string
  province_id: string
  postcode: string
  transport: string
  nearby: string
  neighbors: string
  landzone_name: string
  lat: string
  lon: string
  heading: string

  // 3. Developer
  dev_display_name: string
  dev_title_th: string
  dev_title_en: string
  dev_capital: string
  dev_reg_num: string
  dev_director: string
  dev_address: string
  dev_branch: string
  dev_department: string
  dev_email: string
  dev_website: string
  dev_contact_info: string
  dev_business_segment: string

  // 4. Detail
  area_rai: string
  area_ngan: string
  area_wa: string
  num_unit: string
  num_floor: string
  num_lift: string
  num_lift_service: string
  ratio_parking: string
  num_parking: string
  insurance_condition: string
  area_shared: string

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
  info_other_fac: string

  // 6. Financial & Promotions
  price_start: string
  price_end: string
  price_land: string
  price_start_per_unit: string
  price_end_per_unit: string
  price_facility: string
  unitof_price_facility: string
  ratio_yield: string
  num_yield: string
  insurance_cost: string
  slogan: string
  highlight: string
  detail: string
  promotion: string
  promotion_start: string
  promotion_stop: string
  start_price_not_found: boolean
  not_show_start_price: boolean

  // 7. Contact
  email: string
  facebook: string
  website: string
  line: string
  selloffice_contact_number: string
  selloffice_address: string

  // 8. Ads & Meta
  meta_keywords: string
  meta_description: string
  retarget_google: string
  retarget_facebook: string
  retarget_price: string
}

export interface ProjectTabProps {
  formData: ProjectFormData
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
}
