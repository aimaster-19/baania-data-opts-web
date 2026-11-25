import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Home,
  Loader2,
  Save,
  ChevronLeft,
  Building2,
  FileText,
  Tag,
  Settings,
  Image as ImageIcon,
  Video as VideoIcon,
  Search,
  X,
  Power,
  ChevronRight
} from 'lucide-react'
import api from '../../lib/axios'
import { getApiErrorMessage } from '../../lib/errors'
import { ImageUpload } from '../../components/ProjectFormTabs/ImageUpload'
import { usePropertyTypes } from '../../hooks/usePropertyTypes'
import type { DeveloperDoc } from '../../types/developer'

type AnyObj = Record<string, unknown>

// ── สร้าง snapshot (ref) ของโครงการ ──
function buildProjectRef(projectDoc: AnyObj) {
  const keyId = String(projectDoc._id || projectDoc.keyId || '')
  const d = (projectDoc.data || {}) as AnyObj
  const g = (d.general || {}) as AnyObj
  const fn = (d.footnote || {}) as AnyObj
  const vid = (d.video || {}) as AnyObj
  const info = (d.info || {}) as AnyObj
  return {
    id: String(d.id || ''),
    project_keyId: keyId,
    code: String(info.code || ''),
    title_th: String(info.title_th || ''),
    title_en: String(info.title_en || ''),
    grade: String(g.grade || ''),
    slogan: String(g.slogan || ''),
    livingscore: String(d.livingscore || ''),
    info_landlord: String(fn.info_landlord || ''),
    info_shared_prop: String(fn.info_shared_prop || ''),
    info_designer: String(fn.info_designer || ''),
    info_land_id: String(fn.info_land_id || ''),
    info_license_id: String(fn.info_license_id || ''),
    info_financial: String(fn.info_financial || ''),
    project_facebook: String(d.facebook || ''),
    project_website: String(d.website || ''),
    project_email: String(d.email || ''),
    images: d.images || {},
    footnote: d.footnote || {},
    video: vid.video || { thumbnail: '', title: '', url: '' },
    url: d.url || { alias_th: '', alias_en: '' },
    unit_type: Array.isArray(d.unittype) ? d.unittype : []
  }
}

// ── facility config (คีย์ตรงตามตัวอย่างข้อมูล) ──
const FACILITY_GROUPS: {
  title: string
  info: string
  items: { key: string; label: string }[]
}[] = [
  {
    title: 'สไตล์ (Style)',
    info: 'info_style',
    items: [
      { key: 'style_contemporary', label: 'คอนเทมโพรารี' },
      { key: 'style_loft', label: 'ลอฟท์' },
      { key: 'style_bungalow', label: 'บังกะโล' },
      { key: 'style_french', label: 'ฝรั่งเศส' },
      { key: 'style_thai', label: 'ไทย' },
      { key: 'style_colonial', label: 'โคโลเนียล' },
      { key: 'style_spanish', label: 'สแปนิช' },
      { key: 'style_modern', label: 'โมเดิร์น' },
      { key: 'style_other', label: 'อื่นๆ' }
    ]
  },
  {
    title: 'โครงสร้าง (Structure)',
    info: 'info_structure',
    items: [
      { key: 'struct_wood', label: 'ไม้' },
      { key: 'struct_steel', label: 'เหล็ก' },
      { key: 'struct_brick', label: 'อิฐ' },
      { key: 'struct_concrete', label: 'คอนกรีต' },
      { key: 'struct_lconcrete', label: 'คอนกรีตเบา' },
      { key: 'struct_precast', label: 'พรีคาสท์' },
      { key: 'struct_other', label: 'อื่นๆ' }
    ]
  },
  {
    title: 'ระบบ (System)',
    info: 'info_system',
    items: [
      { key: 'system_cooling', label: 'ระบบทำความเย็น' },
      { key: 'system_cfans', label: 'พัดลมเพดาน' },
      { key: 'system_intercom', label: 'อินเตอร์คอม' },
      { key: 'system_cable', label: 'เคเบิลทีวี' },
      { key: 'system_security', label: 'รักษาความปลอดภัย' },
      { key: 'system_internet', label: 'อินเทอร์เน็ต' },
      { key: 'system_other', label: 'อื่นๆ' }
    ]
  },
  {
    title: 'พื้น (Flooring)',
    info: 'info_floor_material',
    items: [
      { key: 'floor_hardwood', label: 'ไม้จริง' },
      { key: 'floor_tile', label: 'กระเบื้อง' },
      { key: 'floor_rtile', label: 'กระเบื้องยาง' },
      { key: 'floor_carpet', label: 'พรม' },
      { key: 'floor_laminate', label: 'ลามิเนต' },
      { key: 'floor_vinyl', label: 'ไวนิล' },
      { key: 'floor_marble', label: 'หินอ่อน' },
      { key: 'floor_granite', label: 'แกรนิต' },
      { key: 'floor_concrete', label: 'คอนกรีต' },
      { key: 'floor_other', label: 'อื่นๆ' }
    ]
  },
  {
    title: 'เครื่องใช้ไฟฟ้า (Appliances)',
    info: 'info_appliance',
    items: [
      { key: 'appl_washer', label: 'เครื่องซักผ้า' },
      { key: 'appl_wheater', label: 'เครื่องทำน้ำอุ่น' },
      { key: 'appl_heater', label: 'ฮีตเตอร์' },
      { key: 'appl_air', label: 'เครื่องปรับอากาศ' },
      { key: 'appl_frige', label: 'ตู้เย็น' },
      { key: 'appl_oven', label: 'เตาอบ' },
      { key: 'appl_microwave', label: 'ไมโครเวฟ' },
      { key: 'appl_dwasher', label: 'เครื่องล้างจาน' },
      { key: 'appl_dryer', label: 'เครื่องอบผ้า' },
      { key: 'appl_other', label: 'อื่นๆ' }
    ]
  },
  {
    title: 'ภายนอก (Exterior)',
    info: 'info_exterior',
    items: [
      { key: 'ext_shelter', label: 'ที่จอดรถมีหลังคา' },
      { key: 'ext_playground', label: 'สนามเด็กเล่น' },
      { key: 'ext_garden', label: 'สวน' },
      { key: 'ext_veranda', label: 'ระเบียง' },
      { key: 'ext_lawn', label: 'สนามหญ้า' },
      { key: 'ext_garage', label: 'โรงรถ' },
      { key: 'ext_rgate', label: 'ประตูรีโมท' },
      { key: 'ext_pond', label: 'บ่อน้ำ' },
      { key: 'ext_pool', label: 'สระว่ายน้ำ' },
      { key: 'ext_other', label: 'อื่นๆ' }
    ]
  }
]

// รวม facility ทุกคีย์ให้ครบ: ที่ไม่เลือกให้ส่ง false ไปหลังบ้านด้วย
const buildFacilityBools = (
  selected: Record<string, boolean>
): Record<string, boolean> => {
  const result: Record<string, boolean> = {}
  FACILITY_GROUPS.forEach((g) => {
    g.items.forEach((it) => {
      result[it.key] = !!selected[it.key]
    })
  })
  return result
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm bg-white'

const num = (v: string) => (v === '' ? 0 : Number(v) || 0)

type TabKey = 'detail' | 'price' | 'facility' | 'images' | 'video' | 'status'
type DeveloperSel = { id: number; name_th: string; name_en: string }
type ImageItem = { title: string; url: string; thumbnail: string }

// YouTube thumbnail helper
const getYoutubeId = (url: string) => {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )
  return m ? m[1] : ''
}

export default function CreateUnittype() {
  const { projectId, id } = useParams()
  const navigate = useNavigate()
  const { propertyTypes } = usePropertyTypes()

  const [ready, setReady] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [projectRef, setProjectRef] = useState<AnyObj>({})
  const [refTitle, setRefTitle] = useState('')
  const [unitAddress, setUnitAddress] = useState<AnyObj>({})
  const [unitLocation, setUnitLocation] = useState({
    heading: '',
    lat: 0,
    lon: 0
  })
  const [unitSelloffice, setUnitSelloffice] = useState({
    contact_number: '',
    address_selloffice: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('detail')
  const [previewJson, setPreviewJson] = useState<string | null>(null)

  // ── form state ──
  const [info, setInfo] = useState({
    title_th: '',
    title_en: '',
    code: '',
    search_keyword: ''
  })
  const [propertyTypeId, setPropertyTypeId] = useState('') // เลือกได้ 1
  const [developer, setDeveloper] = useState<DeveloperSel>({
    id: 0,
    name_th: '',
    name_en: ''
  })
  const [general, setGeneral] = useState({
    num_unit: '',
    status: 'on-sale',
    highlight: '',
    detail: ''
  })
  const [detail, setDetail] = useState({
    num_bed: '',
    num_bath: '',
    num_floor: '',
    num_parking: '',
    area_usable: '',
    num_maid: '',
    num_kitchen: '',
    num_living: '',
    num_dinning: '',
    num_guest: '',
    num_aircond: '',
    num_util: '',
    num_storage: '',
    is_half_floor: false
  })
  const [meta, setMeta] = useState({ meta_keywords: '', meta_description: '' })
  const [financial, setFinancial] = useState({
    price_start: '',
    not_show_start_price: false,
    start_price_not_found: false
  })
  const [facilityBool, setFacilityBool] = useState<Record<string, boolean>>({})
  const [facilityInfo, setFacilityInfo] = useState<Record<string, string>>({
    info_style: '',
    info_structure: '',
    info_system: '',
    info_floor_material: '',
    info_appliance: '',
    info_exterior: '',
    info_interior: ''
  })
  const [mainImage, setMainImage] = useState('')
  const [overall, setOverall] = useState<ImageItem[]>([])
  const [video, setVideo] = useState({ thumbnail: '', title: '', url: '' })
  const [published, setPublished] = useState(0) // 0 = offline, 1 = online

  const s = (v: unknown) => (v == null ? '' : String(v))

  // เติมค่าในฟอร์มจากข้อมูล unittype เดิม (โหมดแก้ไข)
  const prefillFromUnittype = useCallback((d: AnyObj) => {
    const info0 = (d.info || {}) as AnyObj
    setInfo({
      title_th: s(info0.title_th),
      title_en: s(info0.title_en),
      code: s(info0.code),
      search_keyword: s(info0.search_keyword)
    })
    const pt = (
      Array.isArray(d.property_type) ? d.property_type[0] : null
    ) as AnyObj | null
    setPropertyTypeId(pt ? s(pt.id) : '')
    const dev = (d.developer || {}) as AnyObj
    setDeveloper({
      id: Number(dev.id) || 0,
      name_th: s(dev.name_th),
      name_en: s(dev.name_en)
    })
    const g = (d.general || {}) as AnyObj
    setGeneral({
      num_unit: s(g.num_unit),
      status: s(g.status) || 'on-sale',
      highlight: s(g.highlight),
      detail: s(g.detail)
    })
    const dt = (d.detail || {}) as AnyObj
    setDetail({
      num_bed: s(dt.num_bed),
      num_bath: s(dt.num_bath),
      num_floor: s(dt.num_floor),
      num_parking: s(dt.num_parking),
      area_usable: s(dt.area_usable),
      num_maid: s(dt.num_maid),
      num_kitchen: s(dt.num_kitchen),
      num_living: s(dt.num_living),
      num_dinning: s(dt.num_dinning),
      num_guest: s(dt.num_guest),
      num_aircond: s(dt.num_aircond),
      num_util: s(dt.num_util),
      num_storage: s(dt.num_storage),
      is_half_floor: !!dt.is_half_floor
    })
    const m = (d.meta || {}) as AnyObj
    setMeta({
      meta_keywords: s(m.meta_keywords),
      meta_description: s(m.meta_description)
    })
    const f = (d.financial || {}) as AnyObj
    setFinancial({
      price_start: s(f.price_start),
      not_show_start_price: !!f.not_show_start_price,
      start_price_not_found: !!f.start_price_not_found
    })
    const fac = (d.facility || {}) as AnyObj
    const bools: Record<string, boolean> = {}
    const infos: Record<string, string> = {}
    Object.entries(fac).forEach(([k, v]) => {
      if (k.startsWith('info_')) infos[k] = s(v)
      else bools[k] = !!v
    })
    setFacilityBool(bools)
    setFacilityInfo((prev) => ({ ...prev, ...infos }))
    const img = (d.images || {}) as AnyObj
    const mainImg = (img.main || {}) as AnyObj
    setMainImage(s(mainImg.url) || s(mainImg.thumbnail))
    setOverall(
      (Array.isArray(img.overall) ? (img.overall as AnyObj[]) : []).map(
        (o) => ({
          title: s(o.title),
          url: s(o.url),
          thumbnail: s(o.thumbnail) || s(o.url)
        })
      )
    )
    const v = (d.video || {}) as AnyObj
    setVideo({ thumbnail: s(v.thumbnail), title: s(v.title), url: s(v.url) })
    setPublished(Number(d.published) || 0)
  }, [])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      if (id) {
        // โหมดแก้ไข
        const res = await api.get(`/unittype/id/${id}`)
        const doc = (res.data?.data || {}) as AnyObj
        const d = (doc.data || {}) as AnyObj
        // ใช้ _id จริงสำหรับ PUT (ลิงก์อาจส่ง keyId เข้ามา)
        setEditingId(String(doc._id || id))
        prefillFromUnittype(d)
        setProjectRef((d.project || {}) as AnyObj)
        const proj = (d.project || {}) as AnyObj
        setRefTitle(s(proj.title_th) || s(proj.title_en))
        setUnitAddress((d.address || {}) as AnyObj)
        const loc = (d.location || {}) as AnyObj
        setUnitLocation({
          heading: s(loc.heading),
          lat: Number(loc.lat) || 0,
          lon: Number(loc.lon) || 0
        })
        const so = (d.selloffice || {}) as AnyObj
        setUnitSelloffice({
          contact_number: s(so.contact_number),
          address_selloffice: s(so.address_selloffice)
        })
        setReady(true)
      } else if (projectId) {
        // โหมดสร้าง (ref จากโครงการ)
        const res = await api.get(`/projectread/id/${projectId}`)
        const pdoc = (res.data?.data || {}) as AnyObj
        const pd = (pdoc.data || {}) as AnyObj
        const addr = (pd.address || {}) as AnyObj
        const loc = (pd.location || {}) as AnyObj
        const so = (pd.selloffice || {}) as AnyObj
        const pinfo = (pd.info || {}) as AnyObj
        setProjectRef(buildProjectRef(pdoc))
        setRefTitle(s(pinfo.title_th) || s(pinfo.title_en))
        setUnitAddress({
          province_th: s(addr.province_th),
          province_en: s(addr.province_en),
          province_id: Number(addr.province_id) || 0,
          district_th: s(addr.district_th),
          district_en: s(addr.district_en),
          district_id: Number(addr.district_id) || 0,
          subdistrict_th: s(addr.subdistrict_th),
          subdistrict_en: s(addr.subdistrict_en),
          subdistrict_id: Number(addr.subdistrict_id) || 0,
          postcode: Number(addr.postcode) || 0,
          name_th: s(addr.address_th),
          name_en: s(addr.address_en),
          neighbors: s(addr.neighbors)
        })
        setUnitLocation({
          heading: s(loc.heading),
          lat: Number(loc.lat) || 0,
          lon: Number(loc.lon) || 0
        })
        setUnitSelloffice({
          contact_number: s(so.contact_number),
          address_selloffice: s(so.address_selloffice)
        })
        setReady(true)
      }
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'ไม่สามารถโหลดข้อมูลได้'))
    } finally {
      setIsLoading(false)
    }
  }, [id, projectId, prefillFromUnittype])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ── upload helpers ──
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const fd = new FormData()
    files.forEach((f) => fd.append('images', f))
    fd.append('type', 'unittype')
    const res = await api.post('/upload/images', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const data: { url?: string }[] = res.data?.data || []
    return data.map((d) => d.url || '').filter(Boolean)
  }

  const handleMainUpload = async (files: File[]) => {
    if (!files.length) return
    setIsUploading(true)
    try {
      const [url] = await uploadFiles(files)
      if (url) setMainImage(url)
    } catch (err) {
      alert(getApiErrorMessage(err, 'อัปโหลดรูปภาพไม่สำเร็จ'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleOverallUpload = async (files: File[]) => {
    if (!files.length) return
    setIsUploading(true)
    try {
      const urls = await uploadFiles(files)
      setOverall((prev) => [
        ...prev,
        ...urls.map((url) => ({ title: '', url, thumbnail: url }))
      ])
    } catch (err) {
      alert(getApiErrorMessage(err, 'อัปโหลดรูปภาพไม่สำเร็จ'))
    } finally {
      setIsUploading(false)
    }
  }

  const onVideoUrl = (url: string) => {
    const id = getYoutubeId(url)
    setVideo((prev) => ({
      ...prev,
      url,
      thumbnail:
        id &&
        (prev.thumbnail === '' || /i\.ytimg\.com\/vi\//.test(prev.thumbnail))
          ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
          : prev.thumbnail
    }))
  }

  const validate = () => {
    if (!info.title_th.trim() && !info.title_en.trim()) {
      alert('กรุณาระบุชื่อแบบบ้าน (TH หรือ EN) อย่างน้อย 1 ช่อง')
      setActiveTab('detail')
      return false
    }
    return true
  }

  const buildPayload = () => {
    if (!ready) return null
    const selectedType = propertyTypes.find(
      (t) => String(t.id) === propertyTypeId
    )
    const lat = unitLocation.lat
    const lon = unitLocation.lon

    return {
      data: {
        info: {
          title_th: info.title_th.trim(),
          title_en: info.title_en.trim(),
          code: info.code.trim(),
          search_keyword: info.search_keyword.trim()
        },
        property_type: selectedType
          ? [
              {
                name_th: selectedType.name_th,
                name_en: selectedType.name_en,
                id: Number(selectedType.id) || 0
              }
            ]
          : [],
        developer: {
          id: developer.id,
          name_th: developer.name_th,
          name_en: developer.name_en
        },
        general: {
          num_unit: num(general.num_unit),
          highlight: general.highlight,
          detail: general.detail,
          status: general.status
        },
        detail: {
          num_bed: num(detail.num_bed),
          num_bath: num(detail.num_bath),
          num_floor: num(detail.num_floor),
          num_parking: num(detail.num_parking),
          area_usable: num(detail.area_usable),
          num_maid: num(detail.num_maid),
          num_kitchen: num(detail.num_kitchen),
          num_living: num(detail.num_living),
          num_dinning: num(detail.num_dinning),
          num_guest: num(detail.num_guest),
          num_aircond: num(detail.num_aircond),
          num_util: num(detail.num_util),
          num_storage: num(detail.num_storage),
          is_half_floor: detail.is_half_floor,
          area_land: {}
        },
        meta: {
          meta_keywords: meta.meta_keywords,
          meta_description: meta.meta_description
        },
        financial: {
          // ราคาเริ่มต้น กรอก 0 หรือว่าง -> ส่ง null
          price_start:
            num(financial.price_start) > 0 ? num(financial.price_start) : null,
          not_show_start_price: financial.not_show_start_price,
          start_price_not_found: financial.start_price_not_found
        },
        facility: { ...buildFacilityBools(facilityBool), ...facilityInfo },
        images: {
          main: {
            thumbnail: mainImage,
            alt: info.title_th.trim(),
            title: info.title_th.trim(),
            url: mainImage,
            webp_main: '',
            webp_thumbnail: ''
          },
          overall: overall.map((o) => ({
            title: o.title,
            alt: '',
            url: o.url,
            thumbnail: o.thumbnail,
            webp_main: '',
            webp_thumbnail: ''
          }))
        },
        video,
        // inherit จากโครงการ (หรือค่าเดิมในโหมดแก้ไข)
        address: unitAddress,
        location: { heading: unitLocation.heading, lat, lon },
        selloffice: unitSelloffice,
        url: {
          alias_th: info.title_th.trim(),
          alias_en: info.title_en.trim()
        },
        project: projectRef,
        published
      },
      geopoint: { type: 'Point', coordinates: [lon, lat] },
      // published = 1 (ออนไลน์) -> isShouldUpdate = 1
      isShouldUpdate: published === 1 ? 1 : 0
    }
  }

  // ดู payload ที่จะส่ง โดยยังไม่บันทึกลงฐานข้อมูล
  const handlePreview = () => {
    if (!validate()) return
    const payload = buildPayload()
    if (payload) setPreviewJson(JSON.stringify(payload, null, 2))
  }

  const handleSave = async () => {
    if (!validate()) return
    const payload = buildPayload()
    if (!payload) return
    setIsSaving(true)
    try {
      if (editingId) {
        await api.put(`/unittype/update/${editingId}`, payload)
        alert('แก้ไขแบบบ้านสำเร็จ!')
      } else {
        const res = await api.post('/unittype/add', payload)
        // สร้างสำเร็จแล้วเปลี่ยนเป็นโหมดแก้ไข เพื่อให้กดบันทึกซ้ำได้โดยไม่สร้างซ้ำ
        const newId = res?.data?.data?._id
        if (newId) setEditingId(newId)
        alert('สร้างแบบบ้านสำเร็จ!')
      }
      // ค้างอยู่หน้าบันทึกเหมือนเดิม ไม่กลับไปหน้ารายการ
    } catch (err) {
      alert(getApiErrorMessage(err, 'บันทึกแบบบ้านไม่สำเร็จ'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-32'>
        <Loader2 className='w-10 h-10 animate-spin text-blue-600' />
      </div>
    )
  }
  if (loadError || !ready) {
    return (
      <div className='max-w-3xl mx-auto py-16 px-4 text-center'>
        <p className='text-red-600 mb-4'>{loadError || 'ไม่พบข้อมูล'}</p>
        <button
          onClick={() => navigate('/unittypes')}
          className='text-blue-600 hover:underline'
        >
          กลับไปหน้ารายการแบบบ้าน
        </button>
      </div>
    )
  }

  const tabs: { id: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      id: 'detail',
      label: 'รายละเอียด',
      icon: <FileText className='w-4 h-4' />
    },
    { id: 'price', label: 'ราคา', icon: <Tag className='w-4 h-4' /> },
    {
      id: 'facility',
      label: 'Facility',
      icon: <Settings className='w-4 h-4' />
    },
    {
      id: 'images',
      label: 'รูปภาพ & แปลน',
      icon: <ImageIcon className='w-4 h-4' />
    },
    { id: 'video', label: 'Video', icon: <VideoIcon className='w-4 h-4' /> },
    { id: 'status', label: 'สถานะ', icon: <Power className='w-4 h-4' /> }
  ]

  const tabIndex = tabs.findIndex((t) => t.id === activeTab)
  const isLastTab = tabIndex === tabs.length - 1
  const goNext = () => {
    const next = tabs[tabIndex + 1]
    if (next) setActiveTab(next.id)
  }
  const goPrev = () => {
    const prev = tabs[tabIndex - 1]
    if (prev) setActiveTab(prev.id)
  }

  return (
    <div className='max-w-5xl mx-auto py-8 px-4 pb-24'>
      <button
        onClick={() => navigate(editingId ? '/unittypes' : '/projects')}
        className='flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-4'
      >
        <ChevronLeft className='w-4 h-4' />{' '}
        {editingId ? 'กลับไปรายการแบบบ้าน' : 'กลับไปรายการโครงการ'}
      </button>

      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2'>
          <Home className='w-7 h-7 text-emerald-600' />{' '}
          {editingId ? 'แก้ไขแบบบ้าน (Unit Type)' : 'สร้างแบบบ้าน (Unit Type)'}
        </h1>
        <div className='mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl'>
          <Building2 className='w-4 h-4 text-blue-500' />
          <span className='text-sm text-blue-900'>
            โครงการอ้างอิง: <span className='font-bold'>{refTitle || '-'}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6 flex flex-wrap gap-1'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[400px]'>
        {/* ── รายละเอียด ── */}
        {activeTab === 'detail' && (
          <div className='space-y-6'>
            <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
              ข้อมูลพื้นฐาน
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Field
                label='ชื่อแบบบ้าน (TH)'
                value={info.title_th}
                onChange={(v) => setInfo((p) => ({ ...p, title_th: v }))}
                required
              />
              <Field
                label='ชื่อแบบบ้าน (EN)'
                value={info.title_en}
                onChange={(v) => setInfo((p) => ({ ...p, title_en: v }))}
              />
              <Field
                label='รหัสแบบบ้าน (Code)'
                value={info.code}
                onChange={(v) => setInfo((p) => ({ ...p, code: v }))}
              />
              <Field
                label='คำค้นหา (Search Keyword)'
                value={info.search_keyword}
                onChange={(v) => setInfo((p) => ({ ...p, search_keyword: v }))}
              />
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  ประเภทโครงการ (เลือก 1)
                </label>
                <select
                  value={propertyTypeId}
                  onChange={(e) => setPropertyTypeId(e.target.value)}
                  className={inputClass}
                >
                  <option value=''>เลือกประเภท</option>
                  {propertyTypes.map((t) => (
                    <option key={t.id} value={String(t.id)}>
                      {t.name_th}
                    </option>
                  ))}
                </select>
              </div>
              <DeveloperPicker value={developer} onSelect={setDeveloper} />
            </div>

            <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-2'>
              รายละเอียดห้อง
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
              <NumField
                label='ห้องนอน'
                value={detail.num_bed}
                onChange={(v) => setDetail((p) => ({ ...p, num_bed: v }))}
              />
              <NumField
                label='ห้องน้ำ'
                value={detail.num_bath}
                onChange={(v) => setDetail((p) => ({ ...p, num_bath: v }))}
              />
              <NumField
                label='จำนวนชั้น'
                value={detail.num_floor}
                onChange={(v) => setDetail((p) => ({ ...p, num_floor: v }))}
              />
              <NumField
                label='ที่จอดรถ'
                value={detail.num_parking}
                onChange={(v) => setDetail((p) => ({ ...p, num_parking: v }))}
              />
              <NumField
                label='พื้นที่ใช้สอย (ตร.ม.)'
                value={detail.area_usable}
                onChange={(v) => setDetail((p) => ({ ...p, area_usable: v }))}
              />
              <NumField
                label='ห้องแม่บ้าน'
                value={detail.num_maid}
                onChange={(v) => setDetail((p) => ({ ...p, num_maid: v }))}
              />
              <NumField
                label='ห้องครัว'
                value={detail.num_kitchen}
                onChange={(v) => setDetail((p) => ({ ...p, num_kitchen: v }))}
              />
              <NumField
                label='ห้องนั่งเล่น'
                value={detail.num_living}
                onChange={(v) => setDetail((p) => ({ ...p, num_living: v }))}
              />
              <NumField
                label='ห้องรับประทานอาหาร'
                value={detail.num_dinning}
                onChange={(v) => setDetail((p) => ({ ...p, num_dinning: v }))}
              />
              <NumField
                label='ห้องรับแขก'
                value={detail.num_guest}
                onChange={(v) => setDetail((p) => ({ ...p, num_guest: v }))}
              />
              <NumField
                label='เครื่องปรับอากาศ'
                value={detail.num_aircond}
                onChange={(v) => setDetail((p) => ({ ...p, num_aircond: v }))}
              />
              <NumField
                label='ห้องอเนกประสงค์'
                value={detail.num_util}
                onChange={(v) => setDetail((p) => ({ ...p, num_util: v }))}
              />
              <NumField
                label='ห้องเก็บของ'
                value={detail.num_storage}
                onChange={(v) => setDetail((p) => ({ ...p, num_storage: v }))}
              />
              <label className='flex items-center gap-2 text-sm text-slate-600 cursor-pointer mt-7'>
                <input
                  type='checkbox'
                  checked={detail.is_half_floor}
                  onChange={(e) =>
                    setDetail((p) => ({
                      ...p,
                      is_half_floor: e.target.checked
                    }))
                  }
                />
                มีชั้นลอย
              </label>
            </div>

            <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-2'>
              ทั่วไป
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <NumField
                label='จำนวนยูนิต'
                value={general.num_unit}
                onChange={(v) => setGeneral((p) => ({ ...p, num_unit: v }))}
              />
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  สถานะการขาย
                </label>
                <select
                  value={general.status}
                  onChange={(e) =>
                    setGeneral((p) => ({ ...p, status: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value='on-sale'>เปิดขาย</option>
                  <option value='sold-out'>ปิดการขาย</option>
                  <option value='coming-soon'>เปิดขายเร็ว ๆ นี้</option>
                  <option value='pre-sale'>พรีเซล</option>
                </select>
              </div>
            </div>
            <TextArea
              label='จุดเด่น (Highlight)'
              value={general.highlight}
              onChange={(v) => setGeneral((p) => ({ ...p, highlight: v }))}
            />
            <TextArea
              label='รายละเอียด (Detail)'
              value={general.detail}
              onChange={(v) => setGeneral((p) => ({ ...p, detail: v }))}
              rows={3}
            />

            <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-2'>
              SEO
            </h2>
            <div className='grid grid-cols-1 gap-5'>
              <Field
                label='Meta Keywords'
                value={meta.meta_keywords}
                onChange={(v) => setMeta((p) => ({ ...p, meta_keywords: v }))}
              />
              <TextArea
                label='Meta Description'
                value={meta.meta_description}
                onChange={(v) =>
                  setMeta((p) => ({ ...p, meta_description: v }))
                }
              />
            </div>
          </div>
        )}

        {/* ── ราคา ── */}
        {activeTab === 'price' && (
          <div className='space-y-6'>
            <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
              ราคา
            </h2>
            <NumField
              label='ราคาเริ่มต้น (บาท)'
              value={financial.price_start}
              onChange={(v) => setFinancial((p) => ({ ...p, price_start: v }))}
              placeholder='เช่น 3890000'
            />
            <div className='flex flex-wrap gap-6'>
              <label className='flex items-center gap-2 text-sm text-slate-600 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={financial.start_price_not_found}
                  onChange={(e) =>
                    setFinancial((p) => ({
                      ...p,
                      start_price_not_found: e.target.checked
                    }))
                  }
                />
                ไม่พบราคาเริ่มต้น
              </label>
              <label className='flex items-center gap-2 text-sm text-slate-600 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={financial.not_show_start_price}
                  onChange={(e) =>
                    setFinancial((p) => ({
                      ...p,
                      not_show_start_price: e.target.checked
                    }))
                  }
                />
                ไม่แสดงราคาเริ่มต้น
              </label>
            </div>
          </div>
        )}

        {/* ── facility ── */}
        {activeTab === 'facility' && (
          <div className='space-y-8'>
            <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
              Facility
            </h2>
            {FACILITY_GROUPS.map((g) => (
              <div key={g.info} className='space-y-3'>
                <div className='font-bold text-sm text-slate-700'>
                  {g.title}
                </div>
                <div className='flex flex-wrap gap-2'>
                  {g.items.map((it) => {
                    const checked = !!facilityBool[it.key]
                    return (
                      <button
                        key={it.key}
                        type='button'
                        onClick={() =>
                          setFacilityBool((prev) => ({
                            ...prev,
                            [it.key]: !prev[it.key]
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          checked
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {it.label}
                      </button>
                    )
                  })}
                </div>
                <input
                  type='text'
                  value={facilityInfo[g.info] || ''}
                  onChange={(e) =>
                    setFacilityInfo((prev) => ({
                      ...prev,
                      [g.info]: e.target.value
                    }))
                  }
                  placeholder={`รายละเอียดเพิ่มเติม (${g.title})`}
                  className={inputClass}
                />
              </div>
            ))}
            <div className='space-y-2'>
              <div className='font-bold text-sm text-slate-700'>
                ภายใน (Interior)
              </div>
              <input
                type='text'
                value={facilityInfo.info_interior}
                onChange={(e) =>
                  setFacilityInfo((prev) => ({
                    ...prev,
                    info_interior: e.target.value
                  }))
                }
                placeholder='รายละเอียดภายใน'
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* ── รูปภาพ & แปลน ── */}
        {activeTab === 'images' && (
          <div className='space-y-8'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-bold text-slate-800'>
                รูปภาพ & แปลน
              </h2>
              {isUploading && (
                <span className='text-xs font-medium text-blue-600 animate-pulse'>
                  กำลังอัปโหลด...
                </span>
              )}
            </div>
            <div>
              <p className='font-bold text-sm text-slate-700 mb-2'>
                รูปภาพหลัก / แปลน (Main)
              </p>
              <ImageUpload
                key={`unit-main-${mainImage}`}
                label='รูปภาพหลักของแบบบ้าน'
                onUpload={handleMainUpload}
                onRemove={() => setMainImage('')}
                maxFiles={1}
                initialImages={mainImage ? [mainImage] : []}
              />
            </div>
            <div>
              <p className='font-bold text-sm text-slate-700 mb-2'>
                รูปภาพเพิ่มเติม (Gallery)
              </p>
              <ImageUpload
                key={`unit-overall-${overall.map((o) => o.url).join('|')}`}
                label='รูปภาพบรรยากาศ / แปลนเพิ่มเติม'
                onUpload={handleOverallUpload}
                onRemove={(i) =>
                  setOverall((prev) => prev.filter((_, idx) => idx !== i))
                }
                maxFiles={15}
                initialImages={overall.map((o) => o.url)}
              />
            </div>
          </div>
        )}

        {/* ── video ── */}
        {activeTab === 'video' && (
          <div className='space-y-5'>
            <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
              วิดีโอแบบบ้าน
            </h2>
            <Field
              label='ลิงก์วิดีโอ (URL)'
              value={video.url}
              onChange={onVideoUrl}
              placeholder='เช่น https://www.youtube.com/watch?v=...'
            />
            <Field
              label='ชื่อวิดีโอ (Title)'
              value={video.title}
              onChange={(v) => setVideo((p) => ({ ...p, title: v }))}
            />
            <Field
              label='รูปภาพปก (Thumbnail URL)'
              value={video.thumbnail}
              onChange={(v) => setVideo((p) => ({ ...p, thumbnail: v }))}
            />
            {video.thumbnail && (
              <img
                src={video.thumbnail}
                alt={video.title}
                className='w-48 aspect-video object-cover rounded-xl border border-slate-200'
                loading='lazy'
              />
            )}
          </div>
        )}

        {/* ── สถานะ ── */}
        {activeTab === 'status' && (
          <div className='space-y-6'>
            <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
              สถานะการเผยแพร่
            </h2>
            <div className='flex items-center gap-4 p-5 rounded-2xl border border-slate-200'>
              <button
                type='button'
                onClick={() => setPublished((p) => (p === 1 ? 0 : 1))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  published === 1 ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    published === 1 ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div>
                <p
                  className={`text-sm font-bold ${
                    published === 1 ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {published === 1
                    ? 'ออนไลน์ (เผยแพร่)'
                    : 'ออฟไลน์ (ไม่เผยแพร่)'}
                </p>
                <p className='text-xs text-slate-400 mt-0.5'>
                  เปิด = published 1, isShouldUpdate 1 / ปิด = published 0,
                  isShouldUpdate 0
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* footer actions */}
      <div className='mt-6 flex items-center justify-between gap-3'>
        <button
          onClick={goPrev}
          disabled={tabIndex === 0}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-0 disabled:pointer-events-none'
        >
          <ChevronLeft className='w-5 h-5' /> ย้อนกลับ
        </button>

        {isLastTab ? (
          <div className='flex gap-3'>
            <button
              onClick={handlePreview}
              className='flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95'
            >
              <FileText className='w-5 h-5' /> ดู Payload
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isSaving ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' /> กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className='w-5 h-5' /> บันทึกแบบบ้าน
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={goNext}
            className='flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95'
          >
            ถัดไป <ChevronRight className='w-5 h-5' />
          </button>
        )}
      </div>

      {/* Payload preview modal (ไม่บันทึกลงฐานข้อมูล) */}
      {previewJson !== null && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-slate-100'>
              <h2 className='text-lg font-bold text-slate-800'>
                Payload (Preview) — ยังไม่บันทึกลงฐานข้อมูล
              </h2>
              <button
                onClick={() => setPreviewJson(null)}
                className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <pre className='flex-1 overflow-auto p-5 text-xs font-mono text-slate-700 bg-slate-50 whitespace-pre'>
              {previewJson}
            </pre>
            <div className='px-6 py-4 border-t border-slate-100 flex justify-end gap-3'>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(previewJson)
                }}
                className='px-5 py-2.5 rounded-xl font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50'
              >
                คัดลอก JSON
              </button>
              <button
                onClick={() => setPreviewJson(null)}
                className='px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700'
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── reusable field components ──
function Field({
  label,
  value,
  onChange,
  placeholder = '',
  required = false
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

function NumField({
  label,
  value,
  onChange,
  placeholder = ''
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label}
      </label>
      <input
        type='number'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 2
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={inputClass + ' resize-y'}
      />
    </div>
  )
}

// ── developer picker (ค้นหาเลือกเอง) ──
function DeveloperPicker({
  value,
  onSelect
}: {
  value: { id: number; name_th: string; name_en: string }
  onSelect: (d: { id: number; name_th: string; name_en: string }) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DeveloperDoc[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const search = (q: string) => {
    setQuery(q)
    clearTimeout(debounceRef.current)
    if (!q.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await api.get('/developers', {
          params: { title_th: q.trim(), limit: 15 }
        })
        setResults(res.data?.data || [])
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  if (value.id) {
    return (
      <div>
        <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
          ผู้พัฒนา
        </label>
        <div className='flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl'>
          <Building2 className='w-4 h-4 text-blue-500 shrink-0' />
          <span className='text-sm font-bold text-blue-900 flex-1 truncate'>
            {value.name_th || value.name_en}
          </span>
          <button
            type='button'
            onClick={() => onSelect({ id: 0, name_th: '', name_en: '' })}
            className='text-slate-400 hover:text-red-500'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='relative'>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        ผู้พัฒนา
      </label>
      <div className='relative'>
        <Search className='w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2' />
        <input
          type='text'
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder='ค้นหาผู้พัฒนา...'
          className={inputClass + ' pl-9'}
        />
      </div>
      {open && (
        <div className='absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto'>
          {loading ? (
            <div className='px-4 py-3 text-sm text-slate-400'>
              กำลังค้นหา...
            </div>
          ) : results.length === 0 ? (
            <div className='px-4 py-3 text-sm text-slate-400'>
              ไม่พบผู้พัฒนา
            </div>
          ) : (
            results.map((doc) => {
              const d = doc.data || {}
              const name_th = String(d.display_name || d.title_th || '-')
              return (
                <button
                  key={doc._id}
                  type='button'
                  onClick={() => {
                    onSelect({
                      id: Number(d.id) || 0,
                      name_th,
                      name_en: String(d.title_en || '')
                    })
                    setOpen(false)
                    setQuery('')
                  }}
                  className='w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors'
                >
                  {name_th}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
