import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  MapPin,
  Building,
  Settings,
  Tag,
  Phone,
  Image as ImageIcon,
  Video as VideoIcon,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Globe,
  FileText
} from 'lucide-react'
import api from '../lib/axios'
import { getApiErrorMessage } from '../lib/errors'

import type { ProjectFormData, TabType } from '../types/project/form'
import { emptyProjectImages, emptyProjectVideos } from '../types/project/form'
import type { BaaniaDocument } from '../types/common'
import type { Province } from '../types/province'
import { BasicInfoTab } from './ProjectFormTabs/BasicInfoTab'
import { AddressTab } from './ProjectFormTabs/AddressTab'
import { UnittypeTab } from './ProjectFormTabs/UnittypeTab'
import { DetailTab } from './ProjectFormTabs/DetailTab'
import { FacilityTab } from './ProjectFormTabs/FacilityTab'
import { FinancialTab } from './ProjectFormTabs/FinancialTab'
import { ContactTab } from './ProjectFormTabs/ContactTab'
import { AdsMetaTab } from './ProjectFormTabs/AdsMetaTab'
import { ImagesTab } from './ProjectFormTabs/ImagesTab'
import { VideoTab } from './ProjectFormTabs/VideoTab'

// วันที่เก็บเป็น unix timestamp — แปลง unix -> yyyy-mm-dd (ให้ input calendar แสดง)
// และ yyyy-mm-dd -> unix (วินาที) ตอนบันทึก
const unixToYMD = (v: unknown) => {
  if (v === '' || v == null) return ''
  let n = Number(v)
  if (!Number.isFinite(n) || n <= 0) return ''
  if (n < 1e12) n = n * 1000 // วินาที -> มิลลิวินาที
  const d = new Date(n)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const ymdToUnix = (v: string) => {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return 0
  const t = new Date(v + 'T00:00:00').getTime()
  return isNaN(t) ? 0 : Math.floor(t / 1000)
}

export default function ProjectForm({ projectId }: { projectId?: string }) {
  const navigate = useNavigate()
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [provincesList, setProvincesList] = useState<
    { id: string; title_th: string; title_en: string }[]
  >([])

  useEffect(() => {
    api
      .get('/provinces')
      .then((res) => {
        if (res.data?.data) {
          setProvincesList(
            (res.data.data as BaaniaDocument<Province>[]).map((doc) => ({
              id: String(doc.data.id),
              title_th: doc.data.title?.title_th || '',
              title_en: doc.data.title?.title_en || ''
            }))
          )
        }
      })
      .catch((err) => console.error('Failed to fetch provinces', err))
  }, [])

  useEffect(() => {
    if (projectId) {
      setIsLoadingData(true)
      api
        .get(`/projectread/id/${projectId}`)
        .then((res) => {
          // รับ data.data จาก API ตามที่ระบุ
          const projectRead = res.data?.data || {}
          const apiData = projectRead.data || {}

          setFormData({
            title_th: apiData.info?.title_th || '',
            title_en: apiData.info?.title_en || '',
            code: apiData.info?.code || '',
            search_keyword: apiData.info?.search_keyword || '',
            property_type: Array.isArray(apiData.property_type)
              ? apiData.property_type.map(
                  (p: {
                    id?: number | string
                    title_th?: string
                    title_en?: string
                  }) => ({
                    id: Number(p.id) || 0,
                    title_th: p.title_th || '',
                    title_en: p.title_en || ''
                  })
                )
              : [],
            status: apiData.general?.status || 'on-sale',
            mgnt_status: apiData.general?.mgnt_status || 'none',
            building_amount: apiData.general?.building_amount || 'None',
            building_description: apiData.general?.building_description || '',
            date_construction: unixToYMD(
              apiData.progress?.date_construction ||
                apiData.progress?.date_start
            ),
            date_finish: unixToYMD(apiData.progress?.date_finish),
            address_th: apiData.address?.address_th || '',
            address_en: apiData.address?.address_en || '',
            subdistrict_th: apiData.address?.subdistrict_th || '',
            subdistrict_en: apiData.address?.subdistrict_en || '',
            subdistrict_id: Number(apiData.address?.subdistrict_id) || 0,
            district_th: apiData.address?.district_th || '',
            district_en: apiData.address?.district_en || '',
            district_id: Number(apiData.address?.district_id) || 0,
            province_th: apiData.address?.province_th || '',
            province_en: apiData.address?.province_en || '',
            province_id: Number(apiData.address?.province_id) || 0,
            postcode: String(apiData.address?.postcode || ''),
            transport: apiData.address?.transport || '',
            nearby: apiData.address?.nearby || '',
            neighbors: apiData.address?.neighbors || '',
            landzone_name: apiData.address?.landzone?.name || '',
            lat: Number(apiData.location?.lat) || 0,
            lon: Number(apiData.location?.lon) || 0,
            heading: apiData.location?.heading || '',
            developer: {
              id: String(apiData.developer?.id || ''),
              keyId: apiData.developer?.keyId || '',
              display_name: apiData.developer?.display_name || '',
              title_th: apiData.developer?.title_th || '',
              title_en: apiData.developer?.title_en || '',
              image: {
                thumbnail: apiData.developer?.image?.thumbnail || '',
                alt: apiData.developer?.image?.alt || '',
                title: apiData.developer?.image?.title || '',
                url: apiData.developer?.image?.url || ''
              },
              capital: Number(apiData.developer?.capital) || 0,
              website: apiData.developer?.website || '',
              address: apiData.developer?.address || '',
              reg_num: apiData.developer?.reg_num || '',
              director: apiData.developer?.director || '',
              business_segment: apiData.developer?.business_segment || '',
              contact_info: apiData.developer?.contact_info || '',
              branch: apiData.developer?.branch || '',
              bank_id: apiData.developer?.bank_id || '',
              location: {
                bottom: apiData.developer?.location?.bottom || '',
                lon: apiData.developer?.location?.lon || '',
                right: apiData.developer?.location?.right || '',
                top: apiData.developer?.location?.top || '',
                left: apiData.developer?.location?.left || '',
                lat: apiData.developer?.location?.lat || ''
              },
              department: apiData.developer?.department || '',
              email: apiData.developer?.email || ''
            },
            unittype: apiData.unittype || [],
            area_rai: apiData.detail?.area_total?.rai || 0,
            area_ngan: apiData.detail?.area_total?.ngan || 0,
            area_wa: apiData.detail?.area_total?.wa || 0,
            num_unit: apiData.detail?.num_unit || 0,
            num_floor: apiData.detail?.num_floor || 0,
            num_lift: apiData.detail?.num_lift || 0,
            num_lift_service: apiData.detail?.num_lift_service || 0,
            ratio_parking: apiData.detail?.ratio_parking || 0,
            num_parking: apiData.detail?.num_parking || 0,
            insurance_condition: apiData.detail?.insurance_condition || '',
            area_shared: apiData.detail?.area_shared || '',
            progress_overall: apiData.progress?.progress_overall || '',
            progress_system: apiData.progress?.progress_system || '',
            progress_architect: apiData.progress?.progress_architect || '',
            progress_structure: apiData.progress?.progress_structure || '',
            progress_wiring: apiData.progress?.progress_wiring || '',
            has_pool: Boolean(apiData.facility?.has_pool),
            info_pool: apiData.facility?.info_pool || '',
            has_fitness: Boolean(apiData.facility?.has_fitness),
            info_fitness: apiData.facility?.info_fitness || '',
            has_park: Boolean(apiData.facility?.has_park),
            info_park: apiData.facility?.info_park || '',
            has_playground: Boolean(apiData.facility?.has_playground),
            info_playground: apiData.facility?.info_playground || '',
            has_clubhouse: Boolean(apiData.facility?.has_clubhouse),
            info_clubhouse: apiData.facility?.info_clubhouse || '',
            has_security: Boolean(apiData.facility?.has_security),
            info_security: apiData.facility?.info_security || '',
            has_meeting: Boolean(apiData.facility?.has_meeting),
            info_meeting: apiData.facility?.info_meeting || '',
            has_service_bus: Boolean(apiData.facility?.has_service_bus),
            info_service_bus: apiData.facility?.info_service_bus || '',
            has_other: Boolean(apiData.facility?.has_other),
            info_other_fac: apiData.facility?.info_other_fac || '',
            price_start: apiData.financial?.price_start || 0,
            price_end: apiData.financial?.price_end || 0,
            price_land: apiData.financial?.price_land || 0,
            price_start_per_unit: apiData.financial?.price_start_per_unit || 0,
            price_end_per_unit: apiData.financial?.price_end_per_unit || 0,
            price_facility: apiData.financial?.price_facility || '',
            unitof_price_facility:
              apiData.financial?.unitof_price_facility || '',
            ratio_yield: apiData.financial?.ratio_yield || 0,
            num_yield: apiData.financial?.num_yield || '',
            insurance_cost: apiData.financial?.insurance_cost || '',
            slogan: apiData.general?.slogan || '',
            highlight: apiData.general?.highlight || '',
            detail: apiData.general?.detail || '',
            promotion: apiData.general?.promotion || '',
            info_rationeccomend: apiData.general?.info_rationeccomend || '',
            promotion_start: apiData.general?.promotion_start || 0,
            promotion_stop: apiData.general?.promotion_stop || 0,
            start_price_not_found: Boolean(
              apiData.financial?.start_price_not_found
            ),
            not_show_start_price: Boolean(
              apiData.financial?.not_show_start_price
            ),
            email: apiData.email || '',
            facebook: apiData.facebook || '',
            website: apiData.website || '',
            line: apiData.line || '',
            selloffice_contact_number: apiData.selloffice?.contact_number || '',
            selloffice_address: apiData.selloffice?.address_selloffice || '',
            info_landlord: apiData.footnote?.info_landlord || '',
            info_shared_prop: apiData.footnote?.info_shared_prop || '',
            info_landzone: apiData.footnote?.info_landzone || '',
            info_designer: apiData.footnote?.info_designer || '',
            info_land_id: apiData.footnote?.info_land_id || '',
            info_license_id: apiData.footnote?.info_license_id || '',
            info_financial: apiData.footnote?.info_financial || '',
            meta_keywords: apiData.meta?.meta_keywords || '',
            meta_description: apiData.meta?.meta_description || '',
            retarget_google: apiData.ads?.retarget_google_content_type || '',
            retarget_facebook:
              apiData.ads?.retarget_facebook_content_type || '',
            retarget_price: apiData.ads?.retarget_price_start || '',
            published: Number(apiData.published) || 0,
            images: {
              project: {
                thumbnail: apiData.images?.project?.thumbnail || '',
                title: apiData.images?.project?.title || '',
                url: apiData.images?.project?.url || ''
              },
              main: {
                thumbnail: apiData.images?.main?.thumbnail || '',
                title: apiData.images?.main?.title || '',
                url: apiData.images?.main?.url || '',
                webp_main: apiData.images?.main?.webp_main || '',
                webp_thumbnail: apiData.images?.main?.webp_thumbnail || ''
              },
              nearby: apiData.images?.nearby || '',
              overall: Array.isArray(apiData.images?.overall)
                ? apiData.images.overall.map(
                    (o: {
                      title?: string
                      url?: string
                      thumbnail?: string
                      webp_main?: string
                      webp_thumbnail?: string
                    }) => ({
                      title: o?.title || '',
                      url: o?.url || '',
                      thumbnail: o?.thumbnail || o?.url || '',
                      webp_main: o?.webp_main || '',
                      webp_thumbnail: o?.webp_thumbnail || ''
                    })
                  )
                : [],
              map: {
                thumbnail: apiData.images?.map?.thumbnail || '',
                title: apiData.images?.map?.title || '',
                url: apiData.images?.map?.url || ''
              }
            },
            video: {
              video: {
                thumbnail: apiData.video?.video?.thumbnail || '',
                title: apiData.video?.video?.title || '',
                url: apiData.video?.video?.url || ''
              },
              aerial: {
                thumbnail: apiData.video?.aerial?.thumbnail || '',
                title: apiData.video?.aerial?.title || '',
                url: apiData.video?.aerial?.url || ''
              },
              customer: {
                thumbnail: apiData.video?.customer?.thumbnail || '',
                title: apiData.video?.customer?.title || '',
                url: apiData.video?.customer?.url || ''
              }
            }
          })
        })
        .catch((err) => {
          console.error('Failed to fetch project detail:', err)
          alert('ไม่สามารถโหลดข้อมูลโครงการได้')
        })
        .finally(() => {
          setIsLoadingData(false)
        })
    }
  }, [projectId])

  const [formData, setFormData] = useState<ProjectFormData>({
    title_th: '',
    title_en: '',
    code: '',
    search_keyword: '',
    property_type: [],
    status: 'on-sale',
    mgnt_status: 'none',
    building_amount: 'None',
    building_description: '',
    date_construction: '',
    date_finish: '',
    address_th: '',
    address_en: '',
    subdistrict_th: '',
    subdistrict_en: '',
    subdistrict_id: 0,
    district_th: '',
    district_en: '',
    district_id: 0,
    province_th: '',
    province_en: '',
    province_id: 0,
    postcode: '',
    transport: '',
    nearby: '',
    neighbors: '',
    landzone_name: '',
    lat: 0,
    lon: 0,
    heading: '',
    developer: {
      image: {
        thumbnail: '',
        alt: '',
        title: '',
        url: ''
      },
      capital: 0,
      website: '',
      address: '',
      reg_num: '',
      director: '',
      keyId: '',
      business_segment: '',
      contact_info: '',
      display_name: '',
      branch: '',
      title_th: '',
      bank_id: '',
      location: {
        bottom: '',
        lon: '',
        right: '',
        top: '',
        left: '',
        lat: ''
      },
      title_en: '',
      id: '',
      department: '',
      email: ''
    },
    unittype: [],
    area_rai: 0,
    area_ngan: 0,
    area_wa: 0,
    num_unit: 0,
    num_floor: 0,
    num_lift: 0,
    num_lift_service: 0,
    ratio_parking: 0,
    num_parking: 0,
    insurance_condition: '',
    area_shared: '',
    progress_overall: '',
    progress_system: '',
    progress_architect: '',
    progress_structure: '',
    progress_wiring: '',
    has_pool: false,
    info_pool: '',
    has_fitness: false,
    info_fitness: '',
    has_park: false,
    info_park: '',
    has_playground: false,
    info_playground: '',
    has_clubhouse: false,
    info_clubhouse: '',
    has_security: false,
    info_security: '',
    has_meeting: false,
    info_meeting: '',
    has_service_bus: false,
    info_service_bus: '',
    has_other: false,
    info_other_fac: '',
    price_start: 0,
    price_end: 0,
    price_land: 0,
    price_start_per_unit: 0,
    price_end_per_unit: 0,
    price_facility: '',
    unitof_price_facility: '',
    ratio_yield: 0,
    num_yield: '',
    insurance_cost: '',
    slogan: '',
    highlight: '',
    detail: '',
    promotion: '',
    info_rationeccomend: '',
    promotion_start: 0,
    promotion_stop: 0,
    start_price_not_found: false,
    not_show_start_price: false,
    email: '',
    facebook: '',
    website: '',
    line: '',
    selloffice_contact_number: '',
    selloffice_address: '',
    info_landlord: '',
    info_shared_prop: '',
    info_landzone: '',
    info_designer: '',
    info_land_id: '',
    info_license_id: '',
    info_financial: '',
    meta_keywords: '',
    meta_description: '',
    retarget_google: '',
    retarget_facebook: '',
    retarget_price: '',
    published: 0,
    images: emptyProjectImages(),
    video: emptyProjectVideos()
  })

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'ข้อมูลพื้นฐาน', icon: <User className='w-4 h-4' /> },
    { id: 'address', label: 'ที่ตั้ง', icon: <MapPin className='w-4 h-4' /> },
    {
      id: 'unittype',
      label: 'ประเภทยูนิต',
      icon: <Building className='w-4 h-4' />
    },
    {
      id: 'detail',
      label: 'รายละเอียด',
      icon: <FileText className='w-4 h-4' />
    },
    {
      id: 'facility',
      label: 'ส่วนกลาง',
      icon: <Settings className='w-4 h-4' />
    },
    {
      id: 'financial',
      label: 'การเงิน',
      icon: <Tag className='w-4 h-4' />
    },
    { id: 'contact', label: 'ติดต่อ', icon: <Phone className='w-4 h-4' /> },
    {
      id: 'ads_meta',
      label: 'SEO & โฆษณา',
      icon: <Globe className='w-4 h-4' />
    },
    { id: 'images', label: 'รูปภาพ', icon: <ImageIcon className='w-4 h-4' /> },
    { id: 'video', label: 'วิดีโอ', icon: <VideoIcon className='w-4 h-4' /> }
  ]

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      // Keep empty string as 0 for number fields
      const numVal = value === '' ? 0 : parseFloat(value)
      setFormData((prev) => ({ ...prev, [name]: isNaN(numVal) ? 0 : numVal }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const nextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id)
  }

  const prevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id)
  }

  const handleSave = async () => {
    if (!formData.title_th || formData.property_type.length === 0) {
      alert('กรุณากรอกชื่อโครงการ (TH) และเลือกประเภทโครงการ')
      setActiveTab('basic')
      return
    }

    setIsSubmitting(true)
    try {
      const keyId = projectId || `PRJ-${Date.now()}`

      // ค่าเริ่มต้นอัตโนมัติเมื่อไม่ได้กรอก
      const SALES_FALLBACK = '* ติดต่อฝ่ายขายโครงการ'
      const isHtmlEmpty = (html: string) =>
        !html ||
        html
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, '')
          .trim() === ''
      const promotion = isHtmlEmpty(formData.promotion)
        ? SALES_FALLBACK
        : formData.promotion
      const highlight = isHtmlEmpty(formData.highlight)
        ? SALES_FALLBACK
        : formData.highlight
      const detailText = isHtmlEmpty(formData.detail)
        ? SALES_FALLBACK
        : formData.detail
      const email = formData.email.trim() || 'contact@baania.com'

      // จัด Payload ให้ตรงตาม JSON ตัวอย่างแบบ 100%
      const payload = {
        data: {
          address: {
            subdistrict_en: formData.subdistrict_en,
            province_en: formData.province_en,
            postcode: parseInt(formData.postcode) || 0,
            transport: formData.transport,
            district_en: formData.district_en,
            nearby: formData.nearby,
            subdistrict_id: formData.subdistrict_id,
            address_th: formData.address_th,
            district_th: formData.district_th,
            province_id: formData.province_id,
            neighbors: formData.neighbors,
            subdistrict_th: formData.subdistrict_th,
            address_en: formData.address_en,
            district_id: formData.district_id,
            province_th: formData.province_th,
            landzone: { name: formData.landzone_name, id: '' }
          },
          ads: {
            retarget_google_content_type: formData.retarget_google,
            has_retarket_ads: !!formData.retarget_google,
            retarget_content_id: '',
            retarget_facebook_content_type: formData.retarget_facebook,
            retarget_price_start: formData.retarget_price
          },
          detail: {
            area_total: {
              wa: formData.area_wa,
              ngan: formData.area_ngan,
              rai: formData.area_rai
            },
            num_lift_service: formData.num_lift_service,
            num_unit_type: '',
            num_lift: formData.num_lift,
            num_unit: formData.num_unit,
            area_shared: formData.area_shared,
            num_floor: formData.num_floor,
            ratio_parking: formData.ratio_parking,
            insurance_condition: formData.insurance_condition,
            num_parking: formData.num_parking
          },
          developer: formData.developer,
          email: email,
          facebook: formData.facebook,
          facility: {
            has_pool: formData.has_pool ? 1 : 0,
            info_pool: formData.info_pool,
            has_fitness: formData.has_fitness ? 1 : 0,
            info_fitness: formData.info_fitness,
            has_park: formData.has_park ? 1 : 0,
            info_park: formData.info_park,
            has_playground: formData.has_playground ? 1 : 0,
            info_playground: formData.info_playground,
            has_clubhouse: formData.has_clubhouse ? 1 : 0,
            info_clubhouse: formData.info_clubhouse,
            has_security: formData.has_security ? 1 : 0,
            info_security: formData.info_security,
            has_meeting: formData.has_meeting ? 1 : 0,
            info_meeting: formData.info_meeting,
            has_service_bus: formData.has_service_bus ? 1 : 0,
            info_service_bus: formData.info_service_bus,
            has_other: formData.has_other ? 1 : 0,
            info_other_fac: formData.info_other_fac
          },
          financial: {
            price_land: formData.price_land,
            price_start: formData.price_start,
            price_end: formData.price_end,
            price_start_per_unit: formData.price_start_per_unit,
            price_end_per_unit: formData.price_end_per_unit,
            price_facility: formData.price_facility,
            unitof_price_facility: formData.unitof_price_facility,
            ratio_yield: formData.ratio_yield,
            num_yield: formData.num_yield,
            insurance_cost: formData.insurance_cost,
            start_price_not_found: formData.start_price_not_found,
            not_show_start_price: formData.not_show_start_price
          },
          footnote: {
            info_landlord: formData.info_landlord,
            info_shared_prop: formData.info_shared_prop,
            info_landzone: formData.info_landzone,
            info_designer: formData.info_designer,
            info_land_id: formData.info_land_id,
            info_license_id: formData.info_license_id,
            info_financial: formData.info_financial
          },
          general: {
            building_amount: formData.building_amount,
            building_description: formData.building_description,
            highlight: highlight,
            mgnt_status: formData.mgnt_status,
            promotion: promotion,
            info_rationeccomend: formData.info_rationeccomend,
            promotion_start: formData.promotion_start,
            promotion_stop: formData.promotion_stop,
            slogan: formData.slogan,
            status: formData.status,
            detail: detailText
          },
          id: keyId,
          images: formData.images,
          info: {
            search_keyword: formData.search_keyword,
            code: formData.code,
            hasBlogic: false,
            posted: '',
            title_th: formData.title_th,
            title_en: formData.title_en
          },
          line: formData.line,
          location: {
            heading: formData.heading,
            bottom: '',
            lon: formData.lon,
            right: '',
            top: '',
            left: '',
            lat: formData.lat
          },
          meta: {
            meta_keywords: formData.meta_keywords,
            meta_description: formData.meta_description
          },
          progress: {
            progress_overall: formData.progress_overall,
            progress_system: formData.progress_system,
            date_construction: ymdToUnix(formData.date_construction),
            date_start: ymdToUnix(formData.date_construction),
            progress_architect: formData.progress_architect,
            date_finish: ymdToUnix(formData.date_finish),
            progress_structure: formData.progress_structure,
            progress_wiring: formData.progress_wiring
          },
          promote: {
            promote_review: 0,
            promote_level: 0,
            promote_end_date: 0,
            promote_search: 0,
            promote_recommend: 0,
            promote_map: 0,
            promote_compare: 0,
            promote_list: 0,
            promote_comment: '',
            promote_start_date: 0
          },
          property_type: formData.property_type,
          published: formData.published,
          selloffice: {
            contact_number: formData.selloffice_contact_number,
            address_selloffice: formData.selloffice_address
          },
          transaction: [],
          uid: 'admin_user',
          unittype: formData.unittype,
          url: { alias_th: formData.title_th, alias_en: formData.title_en },
          video: formData.video,
          website: formData.website,
          exreview: '',
          livingscore: ''
        },
        geopoint: { coordinates: [formData.lon, formData.lat], type: 'Point' },
        // published = 1 (online) -> isShouldUpdate = 1, published = 0 (offline) -> 0
        isShouldUpdate: formData.published === 1 ? 1 : 0,
        deletedAt: ''
      }

      if (projectId) {
        // อัปเดตข้อมูลผ่าน API
        await api.put(`/projectread/update/${projectId}`, payload)
        alert('อัปเดตข้อมูลโครงการสำเร็จ!')
        navigate('/projects')
        return
      }

      // สร้างโครงการใหม่ผ่าน API
      await api.post('/projectread/add', payload)
      alert('บันทึกโครงการสำเร็จ!')
      navigate('/projects')
    } catch (error) {
      console.error('Save error:', error)
      // แสดง validation error จาก API (422) หากมี
      alert(getApiErrorMessage(error, 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Tab Props Helper
  const tabProps = { formData, handleInputChange, setFormData }

  return (
    <div className='max-w-6xl mx-auto py-8 px-4 pb-24'>
      {isLoadingData && (
        <div className='fixed inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm'>
          <div className='flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-xl'>
            <Loader2 className='w-10 h-10 animate-spin text-blue-600' />
            <p className='text-slate-700 font-medium'>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      )}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-slate-900 tracking-tight'>
          {projectId ? 'แก้ไขโครงการ' : 'สร้างโครงการใหม่'}
        </h1>
        <p className='text-slate-500 mt-2'>
          ฟอร์มละเอียดสำหรับบันทึกข้อมูลทุก Field ลงในระบบของ Baania
        </p>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6 flex flex-wrap gap-1 overflow-x-auto'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
        <div className='p-6 sm:p-8 min-h-[500px]'>
          {activeTab === 'basic' && <BasicInfoTab {...tabProps} />}
          {activeTab === 'address' && (
            <AddressTab {...tabProps} provincesList={provincesList} />
          )}
          {activeTab === 'unittype' && <UnittypeTab {...tabProps} />}
          {activeTab === 'detail' && <DetailTab {...tabProps} />}
          {activeTab === 'facility' && <FacilityTab {...tabProps} />}
          {activeTab === 'financial' && <FinancialTab {...tabProps} />}
          {activeTab === 'contact' && <ContactTab {...tabProps} />}
          {activeTab === 'ads_meta' && <AdsMetaTab {...tabProps} />}
          {activeTab === 'images' && <ImagesTab {...tabProps} />}
          {activeTab === 'video' && <VideoTab {...tabProps} />}
        </div>

        {/* Footer Navigation */}
        <div className='px-6 py-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center rounded-b-2xl'>
          <button
            onClick={prevTab}
            disabled={activeTab === 'basic'}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${activeTab === 'basic' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
          >
            <ChevronLeft className='w-5 h-5' /> ย้อนกลับ
          </button>

          {activeTab === 'video' ? (
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className='flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' /> กำลังบันทึก...
                </>
              ) : (
                'บันทึกข้อมูลทั้งหมด'
              )}
            </button>
          ) : (
            <button
              onClick={nextTab}
              className='flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95'
            >
              ถัดไป <ChevronRight className='w-5 h-5' />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
