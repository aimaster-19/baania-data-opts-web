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
  ChevronRight,
  ChevronLeft,
  Upload,
  Loader2,
  Globe,
  Activity,
  FileText
} from 'lucide-react'
import api from '../../lib/axios'

type TabType =
  | 'basic'
  | 'address'
  | 'developer'
  | 'detail'
  | 'facility'
  | 'financial'
  | 'contact'
  | 'ads_meta'
  | 'images'

// State interface covering the FULL JSON schema
interface FormData {
  // 1. Basic Info (info, general, property_type)
  title_th: string
  title_en: string
  code: string
  search_keyword: string
  property_type: string
  status: string
  mgnt_status: string
  building_amount: string

  // 2. Address & Location (address, location)
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

  // 4. Detail (detail)
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

export default function CreateProject() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [provincesList, setProvincesList] = useState<
    { id: string; title_th: string }[]
  >([])

  useEffect(() => {
    api
      .get('/provinces')
      .then((res) => {
        if (res.data?.data) {
          setProvincesList(
            res.data.data.map((item: any) => ({
              id: item.data?.id || item.id,
              title_th: item.data?.title?.title_th || item.title_th
            }))
          )
        }
      })
      .catch((err) => console.error('Failed to fetch provinces', err))
  }, [])

  const [formData, setFormData] = useState<FormData>({
    title_th: '',
    title_en: '',
    code: '',
    search_keyword: '',
    property_type: '',
    status: 'on-sale',
    mgnt_status: 'none',
    building_amount: 'None',
    address_th: '',
    address_en: '',
    subdistrict_th: '',
    subdistrict_en: '',
    subdistrict_id: '',
    district_th: '',
    district_en: '',
    district_id: '',
    province_th: '',
    province_en: '',
    province_id: '',
    postcode: '',
    transport: '',
    nearby: '',
    neighbors: '',
    landzone_name: '',
    lat: '',
    lon: '',
    heading: '',
    dev_display_name: '',
    dev_title_th: '',
    dev_title_en: '',
    dev_capital: '',
    dev_reg_num: '',
    dev_director: '',
    dev_address: '',
    dev_branch: '',
    dev_department: '',
    dev_email: '',
    dev_website: '',
    dev_contact_info: '',
    dev_business_segment: '',
    area_rai: '',
    area_ngan: '',
    area_wa: '',
    num_unit: '',
    num_floor: '',
    num_lift: '',
    num_lift_service: '',
    ratio_parking: '',
    num_parking: '',
    insurance_condition: '',
    area_shared: '',
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
    info_other_fac: '',
    price_start: '',
    price_end: '',
    price_land: '',
    price_start_per_unit: '',
    price_end_per_unit: '',
    price_facility: '',
    unitof_price_facility: '',
    ratio_yield: '',
    num_yield: '',
    insurance_cost: '',
    slogan: '',
    highlight: '',
    detail: '',
    promotion: '',
    promotion_start: '',
    promotion_stop: '',
    start_price_not_found: false,
    not_show_start_price: false,
    email: '',
    facebook: '',
    website: '',
    line: '',
    selloffice_contact_number: '',
    selloffice_address: '',
    meta_keywords: '',
    meta_description: '',
    retarget_google: '',
    retarget_facebook: '',
    retarget_price: ''
  })

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'ข้อมูลพื้นฐาน', icon: <User className='w-4 h-4' /> },
    { id: 'address', label: 'ที่ตั้ง', icon: <MapPin className='w-4 h-4' /> },
    {
      id: 'developer',
      label: 'ผู้พัฒนา',
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
      label: 'การเงิน & โปรโมชั่น',
      icon: <Tag className='w-4 h-4' />
    },
    { id: 'contact', label: 'ติดต่อ', icon: <Phone className='w-4 h-4' /> },
    {
      id: 'ads_meta',
      label: 'SEO & โฆษณา',
      icon: <Globe className='w-4 h-4' />
    },
    { id: 'images', label: 'รูปภาพ', icon: <ImageIcon className='w-4 h-4' /> }
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
    if (!formData.title_th || !formData.property_type) {
      alert('กรุณากรอกชื่อโครงการ (TH) และเลือกประเภทโครงการ')
      setActiveTab('basic')
      return
    }

    setIsSubmitting(true)
    try {
      const keyId = `PRJ-${Date.now()}`
      const timestamp = Math.floor(Date.now() / 1000)
      const latNum = parseFloat(formData.lat) || 0
      const lonNum = parseFloat(formData.lon) || 0

      // จัด Payload ให้ตรงตาม JSON ตัวอย่างแบบ 100%
      const payload = {
        created: timestamp.toString(),
        data: {
          address: {
            subdistrict_en: formData.subdistrict_en,
            province_en: formData.province_en,
            postcode: parseInt(formData.postcode) || 0,
            transport: formData.transport,
            district_en: formData.district_en,
            nearby: formData.nearby,
            subdistrict_id: parseInt(formData.subdistrict_id) || 0,
            address_th: formData.address_th,
            district_th: formData.district_th,
            province_id: parseInt(formData.province_id) || 0,
            neighbors: formData.neighbors,
            subdistrict_th: formData.subdistrict_th,
            address_en: formData.address_en,
            district_id: parseInt(formData.district_id) || 0,
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
          created: timestamp,
          detail: {
            area_total: {
              wa: parseInt(formData.area_wa) || 0,
              ngan: parseInt(formData.area_ngan) || 0,
              rai: parseInt(formData.area_rai) || 0
            },
            num_lift_service: formData.num_lift_service,
            num_unit_type: '',
            num_lift: formData.num_lift,
            num_unit: parseInt(formData.num_unit) || 0,
            area_shared: formData.area_shared,
            num_floor: parseInt(formData.num_floor) || 0,
            ratio_parking: formData.ratio_parking,
            insurance_condition: formData.insurance_condition,
            num_parking: formData.num_parking
          },
          developer: {
            image: { thumbnail: '', alt: '', title: '', url: '' },
            capital: parseInt(formData.dev_capital) || 0,
            website: formData.dev_website,
            address: formData.dev_address,
            reg_num: formData.dev_reg_num,
            director: formData.dev_director,
            keyId: '',
            business_segment: formData.dev_business_segment,
            contact_info: formData.dev_contact_info,
            display_name: formData.dev_display_name,
            branch: formData.dev_branch,
            title_th: formData.dev_title_th || formData.dev_display_name,
            bank_id: '',
            location: {
              bottom: '',
              lon: '',
              right: '',
              top: '',
              left: '',
              lat: ''
            },
            title_en: formData.dev_title_en,
            id: '',
            department: formData.dev_department,
            email: formData.dev_email
          },
          email: formData.email,
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
            info_other_fac: formData.info_other_fac
          },
          financial: {
            price_land: formData.price_land,
            price_start: parseFloat(formData.price_start) || 0,
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
            info_landlord: '',
            info_shared_prop: '',
            info_landzone: '',
            info_designer: '',
            info_land_id: '',
            info_license_id: '',
            info_financial: ''
          },
          general: {
            building_amount: formData.building_amount,
            highlight: formData.highlight,
            mgnt_status: formData.mgnt_status,
            promotion: formData.promotion,
            promotion_start: formData.promotion_start,
            promotion_stop: formData.promotion_stop,
            slogan: formData.slogan,
            status: formData.status,
            detail: formData.detail
          },
          id: keyId,
          images: {
            project: { thumbnail: '', title: '', url: '' },
            main: {
              thumbnail:
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=320&h=240&fit=crop',
              title: '',
              url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1024&h=768&fit=crop',
              webp_main: '',
              webp_thumbnail: ''
            },
            nearby: '',
            overall: [],
            map: { thumbnail: '', title: '', url: '' }
          },
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
            lon: lonNum,
            right: '',
            top: '',
            left: '',
            lat: latNum
          },
          meta: {
            meta_keywords: formData.meta_keywords,
            meta_description: formData.meta_description
          },
          progress: {
            progress_overall: '',
            progress_system: '',
            date_start: '',
            progress_architect: '',
            date_finish: '',
            progress_structure: '',
            progress_wiring: ''
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
          property_type: [
            { title_th: formData.property_type, title_en: '', id: 0 }
          ],
          published: 1,
          selloffice: {
            contact_number: formData.selloffice_contact_number,
            address_selloffice: formData.selloffice_address
          },
          transaction: [],
          uid: 'admin_user',
          unittype: [],
          updated: timestamp,
          url: { alias_th: formData.title_th, alias_en: formData.title_en },
          video: {
            video: { thumbnail: '', title: '', url: '' },
            aerial: { thumbnail: '', title: '', url: '' },
            customer: { thumbnail: '', title: '', url: '' }
          },
          website: formData.website,
          exreview: '',
          livingscore: ''
        },
        geopoint: { coordinates: [lonNum, latNum], type: 'Point' },
        isShouldUpdate: '0',
        keyId: keyId,
        updated: timestamp.toString(),
        deletedAt: ''
      }

      console.log('Sending Payload:', payload)
      await api.post('/projectread/add', payload)
      alert('บันทึกโครงการสำเร็จ!')
      navigate('/projects')
    } catch (error: any) {
      console.error('Save error:', error)
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setIsSubmitting(false)
    }
  }

  // UI Helpers
  const renderInput = (
    label: string,
    name: keyof FormData,
    placeholder: string = '',
    type: string = 'text',
    required: boolean = false
  ) => (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] as string}
        onChange={handleInputChange}
        placeholder={placeholder}
        className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm'
      />
    </div>
  )

  const renderTextarea = (
    label: string,
    name: keyof FormData,
    placeholder: string = '',
    rows: number = 3
  ) => (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label}
      </label>
      <textarea
        name={name}
        value={formData[name] as string}
        onChange={handleInputChange}
        placeholder={placeholder}
        rows={rows}
        className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm'
      />
    </div>
  )

  const renderFacilityCheck = (
    label: string,
    checkName: keyof FormData,
    infoName: keyof FormData
  ) => (
    <div className='p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors'>
      <label className='flex items-center gap-3 cursor-pointer mb-3'>
        <div className='relative flex items-center'>
          <input
            type='checkbox'
            name={checkName}
            checked={formData[checkName] as boolean}
            onChange={handleInputChange}
            className='peer sr-only'
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
        <span className='text-sm font-bold text-slate-700'>{label}</span>
      </label>
      {formData[checkName] && (
        <input
          type='text'
          name={infoName}
          value={formData[infoName] as string}
          onChange={handleInputChange}
          placeholder={`รายละเอียด ${label}...`}
          className='w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500'
        />
      )}
    </div>
  )

  return (
    <div className='max-w-6xl mx-auto py-8 px-4 pb-24'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-slate-900 tracking-tight'>
          สร้างโครงการใหม่
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
          {/* TAB 1: Basic Info */}
          {activeTab === 'basic' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                ข้อมูลหลักโครงการ
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {renderInput(
                  'ชื่อโครงการ (TH)',
                  'title_th',
                  'เช่น บริทาเนีย วงแหวน - จตุโชติ',
                  'text',
                  true
                )}
                {renderInput(
                  'ชื่อโครงการ (EN)',
                  'title_en',
                  'เช่น Britania Wongwaen - Chatuchot'
                )}
                {renderInput('รหัสโครงการ (Code)', 'code', '')}
                {renderInput(
                  'คำค้นหา (Search Keyword)',
                  'search_keyword',
                  'คีย์เวิร์ดสำหรับให้คนค้นเจอ'
                )}

                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    ประเภทโครงการ <span className='text-red-500'>*</span>
                  </label>
                  <select
                    name='property_type'
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500'
                  >
                    <option value=''>เลือกประเภท</option>
                    <option value='ทาวน์โฮม'>ทาวน์โฮม (Townhome)</option>
                    <option value='บ้านเดี่ยว'>บ้านเดี่ยว (House)</option>
                    <option value='คอนโดมิเนียม'>คอนโดมิเนียม (Condo)</option>
                    <option value='ที่ดิน'>ที่ดิน (Land)</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    สถานะการขาย
                  </label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500'
                  >
                    <option value='on-sale'>กำลังเปิดขาย (On Sale)</option>
                    <option value='presale'>พรีเซล (Presale)</option>
                    <option value='sold-out'>ปิดโครงการ (Sold Out)</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    สถานะการก่อสร้าง (Mgnt Status)
                  </label>
                  <select
                    name='mgnt_status'
                    value={formData.mgnt_status}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500'
                  >
                    <option value='none'>None</option>
                    <option value='under-construction'>กำลังก่อสร้าง</option>
                    <option value='completed'>สร้างเสร็จพร้อมอยู่</option>
                  </select>
                </div>
                {renderInput(
                  'จำนวนอาคาร (Building Amount)',
                  'building_amount',
                  'เช่น None หรือ 3 อาคาร'
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Address & Location */}
          {activeTab === 'address' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                ที่ตั้งโครงการ
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {renderTextarea(
                  'ที่อยู่ / ถนน (TH)',
                  'address_th',
                  'เช่น ถนน หทัยราษฎร์',
                  2
                )}
                {renderTextarea(
                  'ที่อยู่ / ถนน (EN)',
                  'address_en',
                  'เช่น Hatairat Rd.',
                  2
                )}
                {renderInput(
                  'ตำบล / แขวง (TH)',
                  'subdistrict_th',
                  'เช่น บึงคำพร้อย'
                )}
                {renderInput(
                  'ตำบล / แขวง (EN)',
                  'subdistrict_en',
                  'เช่น BUENG KHAM PHROI'
                )}
                {renderInput(
                  'รหัสตำบล (Subdistrict ID)',
                  'subdistrict_id',
                  'เช่น 3642',
                  'number'
                )}
                {renderInput('อำเภอ / เขต (TH)', 'district_th', 'เช่น ลำลูกกา')}
                {renderInput(
                  'อำเภอ / เขต (EN)',
                  'district_en',
                  'เช่น LAM LUK KA'
                )}
                {renderInput(
                  'รหัสอำเภอ (District ID)',
                  'district_id',
                  'เช่น 3638',
                  'number'
                )}
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    จังหวัด (TH)
                  </label>
                  <select
                    name='province_th'
                    value={formData.province_th}
                    onChange={(e) => {
                      const title = e.target.value
                      const selected = provincesList.find(
                        (p) => p.title_th === title
                      )
                      setFormData((prev) => ({
                        ...prev,
                        province_th: title,
                        province_id: selected ? selected.id : ''
                      }))
                    }}
                    className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500'
                  >
                    <option value=''>เลือกจังหวัด</option>
                    {provincesList.map((p) => (
                      <option key={p.id} value={p.title_th}>
                        {p.title_th}
                      </option>
                    ))}
                  </select>
                </div>
                {renderInput(
                  'จังหวัด (EN)',
                  'province_en',
                  'เช่น Pathum Thani'
                )}
                {renderInput(
                  'รหัสจังหวัด (Province ID)',
                  'province_id',
                  'เช่น 3599',
                  'number'
                )}
                {renderInput(
                  'รหัสไปรษณีย์',
                  'postcode',
                  'เช่น 12150',
                  'number'
                )}
                {renderInput(
                  'การเดินทาง (Transport)',
                  'transport',
                  'เช่น ใกล้รถไฟฟ้าสายสีชมพู'
                )}
                {renderInput(
                  'สถานที่ใกล้เคียง (Nearby)',
                  'nearby',
                  'เช่น ห้างสรรพสินค้า'
                )}
                {renderInput('เพื่อนบ้าน (Neighbors)', 'neighbors', '')}
                {renderInput(
                  'ผังเมือง (Landzone)',
                  'landzone_name',
                  'เช่น พื้นที่สีเหลือง'
                )}
              </div>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
                พิกัดบนแผนที่
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {renderInput('ละติจูด (Lat)', 'lat', 'เช่น 13.91822353')}
                {renderInput('ลองจิจูด (Lon)', 'lon', 'เช่น 100.7164826')}
                {renderInput('มุมมอง (Heading)', 'heading', '')}
              </div>
            </div>
          )}

          {/* TAB 3: Developer */}
          {activeTab === 'developer' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                ข้อมูลบริษัทผู้พัฒนาโครงการ
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {renderInput(
                  'ชื่อที่แสดง (Display Name)',
                  'dev_display_name',
                  'เช่น บริษัท บริทาเนีย จำกัด'
                )}
                {renderInput('ชื่อทางการ (TH)', 'dev_title_th', '')}
                {renderInput(
                  'ชื่อทางการ (EN)',
                  'dev_title_en',
                  'เช่น BRITANIA CO., LTD.'
                )}
                {renderInput(
                  'ทุนจดทะเบียน (Capital)',
                  'dev_capital',
                  'เช่น 300000000',
                  'number'
                )}
                {renderInput(
                  'เลขทะเบียนนิติบุคคล',
                  'dev_reg_num',
                  'เช่น 0115559016801'
                )}
                {renderInput('แผนก (Department)', 'dev_department', '')}
                {renderInput(
                  'สาขา (Branch)',
                  'dev_branch',
                  'เช่น เปลี่ยนแปลงชื่อบริษัทเดิม...'
                )}
                {renderInput('อีเมลผู้พัฒนา', 'dev_email', 'email@dev.com')}
                {renderInput('เว็บไซต์ผู้พัฒนา', 'dev_website', 'https://...')}
                {renderInput('เซกเมนต์ธุรกิจ', 'dev_business_segment', '')}
              </div>
              {renderTextarea(
                'รายนามกรรมการบริษัท (Director)',
                'dev_director',
                'ชื่อ-นามสกุล',
                2
              )}
              {renderTextarea(
                'ที่อยู่บริษัท',
                'dev_address',
                'รายละเอียดที่ตั้งสำนักงานใหญ่...',
                2
              )}
              {renderTextarea(
                'ข้อมูลติดต่ออื่นๆ (Contact Info)',
                'dev_contact_info',
                '',
                2
              )}
            </div>
          )}

          {/* TAB 4: Detail */}
          {activeTab === 'detail' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                ข้อมูลสเกลโครงการ
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
                {renderInput('พื้นที่ส่วนกลาง', 'area_shared', '')}
                {renderInput('พื้นที่ (ไร่)', 'area_rai', 'เช่น 31', 'number')}
                {renderInput('พื้นที่ (งาน)', 'area_ngan', 'เช่น 3', 'number')}
                {renderInput('พื้นที่ (วา)', 'area_wa', 'เช่น 93', 'number')}
                {renderInput(
                  'จำนวนยูนิตทั้งหมด',
                  'num_unit',
                  'เช่น 288',
                  'number'
                )}
                {renderInput('จำนวนชั้น', 'num_floor', 'เช่น 2', 'number')}
                {renderInput('จำนวนลิฟต์', 'num_lift', 'เช่น 2', 'number')}
                {renderInput(
                  'ลิฟต์ขนของ',
                  'num_lift_service',
                  'เช่น 1',
                  'number'
                )}
                {renderInput('อัตราส่วนที่จอดรถ', 'ratio_parking', 'เช่น 40%')}
                {renderInput('จำนวนที่จอดรถ', 'num_parking', 'เช่น 100 คัน')}
                <div className='col-span-2'>
                  {renderInput(
                    'เงื่อนไขประกัน (Insurance Condition)',
                    'insurance_condition',
                    'รายละเอียดการรับประกันโครงสร้าง'
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Facilities */}
          {activeTab === 'facility' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                สิ่งอำนวยความสะดวกในโครงการ
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {renderFacilityCheck('สระว่ายน้ำ', 'has_pool', 'info_pool')}
                {renderFacilityCheck('ฟิตเนส', 'has_fitness', 'info_fitness')}
                {renderFacilityCheck(
                  'สวนสาธารณะ / สวนหย่อม',
                  'has_park',
                  'info_park'
                )}
                {renderFacilityCheck(
                  'สนามเด็กเล่น',
                  'has_playground',
                  'info_playground'
                )}
                {renderFacilityCheck(
                  'คลับเฮ้าส์',
                  'has_clubhouse',
                  'info_clubhouse'
                )}
                {renderFacilityCheck(
                  'ระบบรักษาความปลอดภัย',
                  'has_security',
                  'info_security'
                )}
                {renderFacilityCheck(
                  'ห้องประชุม / Co-working',
                  'has_meeting',
                  'info_meeting'
                )}
                {renderFacilityCheck(
                  'รถรับส่ง (Shuttle Bus)',
                  'has_service_bus',
                  'info_other_fac'
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Financial & Promotions */}
          {activeTab === 'financial' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                ราคาและการเงิน
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {renderInput(
                  'ราคาเริ่มต้น (บาท)',
                  'price_start',
                  'เช่น 3190000',
                  'number'
                )}
                {renderInput(
                  'ราคาสูงสุด (บาท)',
                  'price_end',
                  'เช่น 5000000',
                  'number'
                )}
                {renderInput(
                  'ราคาที่ดิน',
                  'price_land',
                  'ราคาที่ดินเปล่า',
                  'number'
                )}
                {renderInput(
                  'ราคาเริ่มต้น/ยูนิต',
                  'price_start_per_unit',
                  'เช่น 50000'
                )}
                {renderInput(
                  'ราคาสูงสุด/ยูนิต',
                  'price_end_per_unit',
                  'เช่น 80000'
                )}
                {renderInput('ค่าส่วนกลาง', 'price_facility', 'เช่น 35')}
                {renderInput(
                  'หน่วยค่าส่วนกลาง',
                  'unitof_price_facility',
                  'เช่น b-meter (บาท/ตร.ม.)'
                )}
                {renderInput(
                  'อัตราผลตอบแทน (Yield %)',
                  'ratio_yield',
                  'เช่น 5%'
                )}
                {renderInput('จำนวนผลตอบแทน', 'num_yield', '')}
                {renderInput(
                  'ค่าประกันภัย',
                  'insurance_cost',
                  'ค่าใช้จ่ายประกันภัย'
                )}
              </div>
              <div className='flex gap-4 mb-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    name='start_price_not_found'
                    checked={formData.start_price_not_found}
                    onChange={handleInputChange}
                  />{' '}
                  ไม่พบราคาเริ่มต้น
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    name='not_show_start_price'
                    checked={formData.not_show_start_price}
                    onChange={handleInputChange}
                  />{' '}
                  ไม่แสดงราคาเริ่มต้น
                </label>
              </div>

              <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
                การโปรโมทและจุดเด่น
              </h2>
              {renderTextarea(
                'สโลแกน (Slogan)',
                'slogan',
                'เช่น พรีเมียมทาวน์โฮมสไตล์อังกฤษ...',
                2
              )}
              {renderTextarea(
                'จุดเด่น (Highlight - HTML)',
                'highlight',
                'เช่น <p>* อยู่ในทำเลดี...</p>',
                3
              )}
              {renderTextarea(
                'รายละเอียด (Detail - HTML)',
                'detail',
                'เช่น <p>ติดต่อฝ่ายขาย...</p>',
                3
              )}
              {renderTextarea(
                'โปรโมชั่น (Promotion - HTML)',
                'promotion',
                'เช่น <p>* ส่วนลดสูงสุด...</p>',
                3
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {renderInput(
                  'วันเริ่มโปรโมชั่น',
                  'promotion_start',
                  'เช่น 2025-10-27T17:00:00.000Z'
                )}
                {renderInput(
                  'วันสิ้นสุดโปรโมชั่น',
                  'promotion_stop',
                  'เช่น 2026-01-27T17:00:00.000Z'
                )}
              </div>
            </div>
          )}

          {/* TAB 7: Contact */}
          {activeTab === 'contact' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                ช่องทางติดต่อทางการ
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {renderInput('อีเมล (Email)', 'email', 'info@...', 'email')}
                {renderInput('เว็บไซต์หลัก', 'website', 'https://...', 'url')}
                {renderInput(
                  'Facebook URL',
                  'facebook',
                  'https://facebook.com/...',
                  'url'
                )}
                {renderInput(
                  'Line Official URL',
                  'line',
                  'https://line.me/...',
                  'url'
                )}
              </div>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
                สำนักงานขาย (Selloffice)
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {renderInput(
                  'เบอร์โทรศัพท์ฝ่ายขาย',
                  'selloffice_contact_number',
                  'เช่น 1509'
                )}
                {renderTextarea(
                  'ที่ตั้งสำนักงานขาย',
                  'selloffice_address',
                  'หากไม่ได้ตั้งอยู่ที่เดียวกับโครงการ',
                  2
                )}
              </div>
            </div>
          )}

          {/* TAB 8: Ads & Meta */}
          {activeTab === 'ads_meta' && (
            <div className='space-y-6 animate-in fade-in'>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
                การทำ SEO บนเว็บ
              </h2>
              {renderTextarea(
                'Keywords (Meta Keywords)',
                'meta_keywords',
                'บ้านจัดสรร, ทาวน์โฮม, ปทุมธานี',
                2
              )}
              {renderTextarea(
                'Description (Meta Description)',
                'meta_description',
                'คำอธิบายโครงการแบบย่อสำหรับ Google Search',
                2
              )}

              <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
                การยิงโฆษณา (Ads Retargeting)
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {renderInput('Google Content Type', 'retarget_google', '')}
                {renderInput('Facebook Content Type', 'retarget_facebook', '')}
                {renderInput('Retarget Price Start', 'retarget_price', '')}
              </div>
            </div>
          )}

          {/* TAB 9: Images */}
          {activeTab === 'images' && (
            <div className='space-y-6 animate-in fade-in'>
              <div className='bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center'>
                <ImageIcon className='w-10 h-10 text-slate-400 mx-auto mb-4' />
                <h3 className='text-lg font-bold text-slate-800'>
                  Mock Images
                </h3>
                <p className='text-slate-500 mt-2 text-sm max-w-md mx-auto'>
                  ระบบการอัปโหลดไฟล์จริงกำลังอยู่ในช่วงพัฒนา
                  ขณะนี้การบันทึกข้อมูลจะแนบรูปภาพตัวอย่างไปให้อัตโนมัติในฐานข้อมูล
                </p>
              </div>
            </div>
          )}
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

          {activeTab === 'images' ? (
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
