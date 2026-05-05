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

import { ProjectFormData, TabType } from '../types/project'
import { BasicInfoTab } from './ProjectFormTabs/BasicInfoTab'
import { AddressTab } from './ProjectFormTabs/AddressTab'
import { DeveloperTab } from './ProjectFormTabs/DeveloperTab'
import { DetailTab } from './ProjectFormTabs/DetailTab'
import { FacilityTab } from './ProjectFormTabs/FacilityTab'
import { FinancialTab } from './ProjectFormTabs/FinancialTab'
import { ContactTab } from './ProjectFormTabs/ContactTab'
import { AdsMetaTab } from './ProjectFormTabs/AdsMetaTab'
import { ImagesTab } from './ProjectFormTabs/ImagesTab'

export default function ProjectForm({ projectId }: { projectId?: string }) {
  const navigate = useNavigate()
  const [isLoadingMock, setIsLoadingMock] = useState(false)
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

  useEffect(() => {
    if (projectId) {
      // Mock data loading for Update mode
      setIsLoadingMock(true)
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          title_th: 'โครงการตัวอย่าง (Mock Data)',
          title_en: 'Sample Project (Mock)',
          code: 'PRJ-MOCK-001',
          property_type: 'ทาวน์โฮม',
          status: 'on-sale',
          address_th: 'ถนนจำลอง',
          province_th: 'กรุงเทพมหานคร',
          price_start: '2500000',
          dev_display_name: 'บริษัท ทดสอบ จำกัด'
        }))
        setIsLoadingMock(false)
      }, 1000)
    }
  }, [projectId])

  const [formData, setFormData] = useState<ProjectFormData>({
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
      if (projectId) {
        // Mock update API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log('Mock Updating Project ID:', projectId, formData)
        alert('อัปเดตข้อมูลโครงการสำเร็จ! (Mock)')
        navigate('/projects')
        return
      }

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

  // Tab Props Helper
  const tabProps = { formData, handleInputChange, setFormData }

  return (
    <div className='max-w-6xl mx-auto py-8 px-4 pb-24'>
      {isLoadingMock && (
        <div className='fixed inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm'>
          <div className='flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-xl'>
            <Loader2 className='w-10 h-10 animate-spin text-blue-600' />
            <p className='text-slate-700 font-medium'>กำลังโหลดข้อมูลจำลอง...</p>
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
          {activeTab === 'address' && <AddressTab {...tabProps} provincesList={provincesList} />}
          {activeTab === 'developer' && <DeveloperTab {...tabProps} />}
          {activeTab === 'detail' && <DetailTab {...tabProps} />}
          {activeTab === 'facility' && <FacilityTab {...tabProps} />}
          {activeTab === 'financial' && <FinancialTab {...tabProps} />}
          {activeTab === 'contact' && <ContactTab {...tabProps} />}
          {activeTab === 'ads_meta' && <AdsMetaTab {...tabProps} />}
          {activeTab === 'images' && <ImagesTab {...tabProps} />}
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
