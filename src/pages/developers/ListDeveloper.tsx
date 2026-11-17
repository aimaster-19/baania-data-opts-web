import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Building2,
  Plus,
  Pencil,
  Search,
  X,
  Loader2,
  Save,
  RefreshCw
} from 'lucide-react'
import api from '../../lib/axios'
import { getApiErrorMessage } from '../../lib/errors'
import type { DeveloperDoc } from '../../types/developer'

const SEARCH_DEBOUNCE_MS = 400

// ── ตัวเลือกจังหวัด/อำเภอ/ตำบล ───────────────────────────────────────────
interface RegionOption {
  id: string
  title_th: string
  title_en: string
}
interface RegionDoc {
  data: {
    id: string | number
    title?: { title_th?: string; title_en?: string }
  }
}
const mapRegion = (docs: RegionDoc[]): RegionOption[] =>
  docs.map((doc) => ({
    id: String(doc.data.id),
    title_th: doc.data.title?.title_th || '',
    title_en: doc.data.title?.title_en || ''
  }))

const selectClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400'

// ── ฟอร์มแก้ไข/สร้าง ─────────────────────────────────────────────────────
interface DeveloperFormState {
  display_name: string
  title_th: string
  title_alt: string
  capital: string
  reg_num: string
  director: string
  department: string
  branch: string
  email: string
  website: string
  facebook_link: string
  business_segment: string
  address: string
  contact_info: string
  loc_lat: string
  loc_lon: string
  province_id: string
  province_th: string
  province_en: string
  district_id: string
  district_th: string
  district_en: string
  subdistrict_id: string
  subdistrict_th: string
  subdistrict_en: string
}

const emptyForm: DeveloperFormState = {
  display_name: '',
  title_th: '',
  title_alt: '',
  capital: '',
  reg_num: '',
  director: '',
  department: '',
  branch: '',
  email: '',
  website: '',
  facebook_link: '',
  business_segment: '',
  address: '',
  contact_info: '',
  loc_lat: '',
  loc_lon: '',
  province_id: '',
  province_th: '',
  province_en: '',
  district_id: '',
  district_th: '',
  district_en: '',
  subdistrict_id: '',
  subdistrict_th: '',
  subdistrict_en: ''
}

function docToForm(doc: DeveloperDoc): DeveloperFormState {
  const d = doc.data || {}
  const loc = (d.location || {}) as Record<string, unknown>
  const s = (v: unknown) => (v == null ? '' : String(v))
  return {
    display_name: String(d.display_name || ''),
    title_th: String(d.title_th || ''),
    title_alt: s(d.title_alt ?? d.title_en),
    capital: d.capital != null ? String(d.capital) : '',
    reg_num: String(d.reg_num || ''),
    director: String(d.director || ''),
    department: String(d.department || ''),
    branch: String(d.branch || ''),
    email: String(d.email || ''),
    website: String(d.website || ''),
    facebook_link: String(d.facebook_link || ''),
    business_segment: String(d.business_segment || ''),
    address: String(d.address || ''),
    contact_info: String(d.contact_info || ''),
    loc_lat: s(loc.latitude ?? loc.lat),
    loc_lon: s(loc.longitude ?? loc.lon),
    province_id: s(loc.province_id ?? d.province_id),
    province_th: s(loc.province_th ?? d.province_th),
    province_en: s(loc.province_en ?? d.province_en),
    district_id: s(loc.district_id ?? d.district_id),
    district_th: s(loc.district_th ?? d.district_th),
    district_en: s(loc.district_en ?? d.district_en),
    subdistrict_id: s(loc.subdistrict_id ?? d.subdistrict_id),
    subdistrict_th: s(loc.subdistrict_th ?? d.subdistrict_th),
    subdistrict_en: s(loc.subdistrict_en ?? d.subdistrict_en)
  }
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm bg-white'

function Field({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

export default function ListDeveloper() {
  const [developers, setDevelopers] = useState<DeveloperDoc[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // modal state
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [originalData, setOriginalData] = useState<DeveloperDoc['data']>({})
  const [form, setForm] = useState<DeveloperFormState>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  // cascade จังหวัด/อำเภอ/ตำบล
  const [provincesList, setProvincesList] = useState<RegionOption[]>([])
  const [districtsList, setDistrictsList] = useState<RegionOption[]>([])
  const [subdistrictsList, setSubdistrictsList] = useState<RegionOption[]>([])

  useEffect(() => {
    api
      .get('/provinces')
      .then((res) => setProvincesList(mapRegion(res.data?.data || [])))
      .catch((err) => console.error('Failed to fetch provinces', err))
  }, [])

  useEffect(() => {
    if (!form.province_id) {
      setDistrictsList([])
      return
    }
    api
      .get(`/districts?provinceCode=${form.province_id}`)
      .then((res) => setDistrictsList(mapRegion(res.data?.data || [])))
      .catch((err) => console.error('Failed to fetch districts', err))
  }, [form.province_id])

  useEffect(() => {
    if (!form.district_id) {
      setSubdistrictsList([])
      return
    }
    api
      .get(`/subdistricts?districtCode=${form.district_id}`)
      .then((res) => setSubdistrictsList(mapRegion(res.data?.data || [])))
      .catch((err) => console.error('Failed to fetch subdistricts', err))
  }, [form.district_id])

  const fetchDevelopers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get('/developers', {
        params: { title_th: searchQuery || undefined, limit: 50 }
      })
      setDevelopers(res.data?.data || [])
    } catch (err) {
      setError(getApiErrorMessage(err, 'ไม่สามารถโหลดข้อมูลผู้พัฒนาได้'))
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchDevelopers()
  }, [fetchDevelopers])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () => setSearchQuery(value.trim()),
      SEARCH_DEBOUNCE_MS
    )
  }

  const openCreate = () => {
    setEditingId(null)
    setOriginalData({})
    setForm(emptyForm)
    setIsOpen(true)
  }

  const openEdit = (doc: DeveloperDoc) => {
    setEditingId(doc._id)
    setOriginalData(doc.data || {})
    setForm(docToForm(doc))
    setIsOpen(true)
  }

  const setField = (key: keyof DeveloperFormState) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const handleSave = async () => {
    if (!form.display_name.trim() && !form.title_th.trim()) {
      alert('กรุณาระบุชื่อที่แสดง หรือ ชื่อทางการ (TH) อย่างน้อย 1 ช่อง')
      return
    }

    setIsSaving(true)
    try {
      const title = form.display_name.trim() || form.title_th.trim()
      // คง bottom/left/right/top เดิมของ location ไว้
      const prevLoc = (originalData.location || {}) as Record<string, unknown>
      // รวมกับ data เดิมเพื่อไม่ทับฟิลด์ที่ไม่ได้แก้ (image, bank_id ฯลฯ)
      const data = {
        ...originalData,
        // ประเภทธุรกิจ: สร้างใหม่ใช้ค่า default, แก้ไขคงของเดิมถ้ามี
        business_type: originalData.business_type || {
          key: 'developer',
          name_th: 'พัฒนาอสังหาริมทรัพย์',
          name_en: 'developer',
          bank: null,
          service: []
        },
        title, // ฟิลด์ที่ใช้ค้นหา/เรียงลำดับ
        display_name: form.display_name.trim(),
        title_th: form.title_th.trim(),
        title_alt: form.title_alt.trim(),
        capital: form.capital === '' ? 0 : Number(form.capital),
        reg_num: form.reg_num.trim(),
        director: form.director.trim(),
        department: form.department.trim(),
        branch: form.branch.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        facebook_link: form.facebook_link.trim(),
        business_segment: form.business_segment.trim(),
        address: form.address.trim(),
        contact_info: form.contact_info.trim(),
        location: {
          latitude: form.loc_lat.trim(),
          longitude: form.loc_lon.trim(),
          bottom: String(prevLoc.bottom ?? ''),
          left: String(prevLoc.left ?? ''),
          right: String(prevLoc.right ?? ''),
          top: String(prevLoc.top ?? ''),
          province_id: form.province_id.trim(),
          province_th: form.province_th.trim(),
          province_en: form.province_en.trim(),
          district_id: form.district_id.trim(),
          district_th: form.district_th.trim(),
          district_en: form.district_en.trim(),
          subdistrict_id: form.subdistrict_id.trim(),
          subdistrict_th: form.subdistrict_th.trim(),
          subdistrict_en: form.subdistrict_en.trim()
        }
      }

      if (editingId) {
        await api.put(`/developers/${editingId}`, { data })
      } else {
        await api.post('/developers', { data })
      }
      setIsOpen(false)
      fetchDevelopers()
    } catch (err) {
      alert(getApiErrorMessage(err, 'บันทึกผู้พัฒนาไม่สำเร็จ'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      {/* Header */}
      <div className='flex items-center justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-slate-900 tracking-tight'>
            ผู้พัฒนาโครงการ
          </h1>
          <p className='text-slate-500 mt-2'>
            จัดการข้อมูลบริษัทผู้พัฒนาโครงการ (สร้าง / แก้ไข)
          </p>
        </div>
        <button
          onClick={openCreate}
          className='flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 shrink-0'
        >
          <Plus className='w-5 h-5' /> เพิ่มผู้พัฒนา
        </button>
      </div>

      {/* Search */}
      <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-3 mb-6 flex items-center gap-2'>
        <Search className='w-5 h-5 text-slate-400 ml-2' />
        <input
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder='ค้นหาชื่อผู้พัฒนา...'
          className='flex-1 outline-none text-sm bg-transparent py-1.5'
        />
        <button
          onClick={fetchDevelopers}
          className='p-2 text-slate-400 hover:text-blue-600 transition-colors'
          title='รีเฟรช'
        >
          <RefreshCw className='w-4 h-4' />
        </button>
      </div>

      {/* Table */}
      <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-slate-100'>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                ชื่อที่แสดง
              </th>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                ชื่อทางการ
              </th>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                เลขทะเบียน
              </th>
              <th className='text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-50'>
            {isLoading ? (
              <tr>
                <td colSpan={4} className='text-center py-16'>
                  <Loader2 className='w-8 h-8 animate-spin text-blue-600 mx-auto' />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className='text-center py-16 text-red-600'>
                  {error}
                </td>
              </tr>
            ) : developers.length === 0 ? (
              <tr>
                <td colSpan={4} className='text-center py-16'>
                  <div className='flex flex-col items-center gap-3'>
                    <div className='w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center'>
                      <Building2 className='w-8 h-8 text-slate-300' />
                    </div>
                    <p className='text-slate-500 font-medium'>
                      ไม่พบผู้พัฒนาโครงการ
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              developers.map((doc) => (
                <tr
                  key={doc._id}
                  className='group hover:bg-blue-50/30 transition-colors'
                >
                  <td className='px-6 py-3'>
                    <div className='flex items-center gap-3'>
                      {doc.data?.image?.url || doc.data?.image?.thumbnail ? (
                        <img
                          src={doc.data.image.url || doc.data.image.thumbnail}
                          alt={doc.data?.display_name || ''}
                          className='w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0'
                          loading='lazy'
                        />
                      ) : (
                        <div className='w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0'>
                          {(doc.data?.display_name || doc.data?.title_th || '?')
                            .toString()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <span className='text-sm font-semibold text-slate-800'>
                        {doc.data?.display_name ||
                          doc.data?.title ||
                          doc.data?.title_th ||
                          '-'}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-3 text-sm text-slate-600'>
                    {doc.data?.title_th || '-'}
                  </td>
                  <td className='px-6 py-3 text-sm text-slate-500 font-mono'>
                    {doc.data?.reg_num || '-'}
                  </td>
                  <td className='px-6 py-3'>
                    <div className='flex justify-center'>
                      <button
                        onClick={() => openEdit(doc)}
                        className='flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      >
                        <Pencil className='w-4 h-4' /> แก้ไข
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-slate-100'>
              <h2 className='text-lg font-bold text-slate-800'>
                {editingId ? 'แก้ไขผู้พัฒนา' : 'เพิ่มผู้พัฒนาใหม่'}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-6 overflow-y-auto space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <Field
                  label='ชื่อที่แสดง (Display Name)'
                  value={form.display_name}
                  onChange={setField('display_name')}
                  placeholder='เช่น บริษัท บริทาเนีย จำกัด'
                  required
                />
                <Field
                  label='ชื่อทางการ (TH)'
                  value={form.title_th}
                  onChange={setField('title_th')}
                />
                <Field
                  label='ชื่อรอง (Title Alt)'
                  value={form.title_alt}
                  onChange={setField('title_alt')}
                  placeholder='เช่น BRITANIA CO., LTD.'
                />
                <Field
                  label='ทุนจดทะเบียน (Capital)'
                  value={form.capital}
                  onChange={setField('capital')}
                  type='number'
                  placeholder='เช่น 300000000'
                />
                <Field
                  label='เลขทะเบียนนิติบุคคล'
                  value={form.reg_num}
                  onChange={setField('reg_num')}
                  placeholder='เช่น 0115559016801'
                />
                <Field
                  label='แผนก (Department)'
                  value={form.department}
                  onChange={setField('department')}
                />
                <Field
                  label='สาขา (Branch)'
                  value={form.branch}
                  onChange={setField('branch')}
                  placeholder='เช่น สำนักงานใหญ่'
                />
                <Field
                  label='อีเมล'
                  value={form.email}
                  onChange={setField('email')}
                  type='email'
                  placeholder='email@dev.com'
                />
                <Field
                  label='เว็บไซต์'
                  value={form.website}
                  onChange={setField('website')}
                  placeholder='https://...'
                />
                <Field
                  label='Facebook'
                  value={form.facebook_link}
                  onChange={setField('facebook_link')}
                  placeholder='https://facebook.com/...'
                />
                <Field
                  label='เซกเมนต์ธุรกิจ'
                  value={form.business_segment}
                  onChange={setField('business_segment')}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  รายนามกรรมการบริษัท (Director)
                </label>
                <textarea
                  value={form.director}
                  onChange={(e) => setField('director')(e.target.value)}
                  rows={2}
                  placeholder='ชื่อ-นามสกุล'
                  className={inputClass + ' resize-y'}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  ที่อยู่บริษัท
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => setField('address')(e.target.value)}
                  rows={2}
                  placeholder='รายละเอียดที่ตั้งสำนักงานใหญ่...'
                  className={inputClass + ' resize-y'}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  ข้อมูลติดต่ออื่นๆ (Contact Info)
                </label>
                <textarea
                  value={form.contact_info}
                  onChange={(e) => setField('contact_info')(e.target.value)}
                  rows={2}
                  className={inputClass + ' resize-y'}
                />
              </div>

              {/* ── ตำแหน่งที่ตั้ง (Location) ── */}
              <div className='pt-2 border-t border-slate-100'>
                <h3 className='text-sm font-bold text-slate-700 mb-3'>
                  ตำแหน่งที่ตั้ง (Location)
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <Field
                    label='ละติจูด (Lat)'
                    value={form.loc_lat}
                    onChange={setField('loc_lat')}
                    placeholder='เช่น 13.7563'
                  />
                  <Field
                    label='ลองจิจูด (Lon)'
                    value={form.loc_lon}
                    onChange={setField('loc_lon')}
                    placeholder='เช่น 100.5018'
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-3'>
                  {/* จังหวัด */}
                  <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                      จังหวัด
                    </label>
                    <select
                      value={form.province_th}
                      onChange={(e) => {
                        const title = e.target.value
                        const sel = provincesList.find(
                          (p) => p.title_th === title
                        )
                        setForm((prev) => ({
                          ...prev,
                          province_th: title,
                          province_en: sel?.title_en || '',
                          province_id: sel?.id || '',
                          district_th: '',
                          district_en: '',
                          district_id: '',
                          subdistrict_th: '',
                          subdistrict_en: '',
                          subdistrict_id: ''
                        }))
                      }}
                      className={selectClass}
                    >
                      <option value=''>เลือกจังหวัด</option>
                      {provincesList.map((p) => (
                        <option key={p.id} value={p.title_th}>
                          {p.title_th}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* อำเภอ */}
                  <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                      อำเภอ / เขต
                    </label>
                    <select
                      value={form.district_th}
                      disabled={!form.province_id}
                      onChange={(e) => {
                        const title = e.target.value
                        const sel = districtsList.find(
                          (d) => d.title_th === title
                        )
                        setForm((prev) => ({
                          ...prev,
                          district_th: title,
                          district_en: sel?.title_en || '',
                          district_id: sel?.id || '',
                          subdistrict_th: '',
                          subdistrict_en: '',
                          subdistrict_id: ''
                        }))
                      }}
                      className={selectClass}
                    >
                      <option value=''>เลือกอำเภอ / เขต</option>
                      {districtsList.map((d) => (
                        <option key={d.id} value={d.title_th}>
                          {d.title_th}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* ตำบล */}
                  <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                      ตำบล / แขวง
                    </label>
                    <select
                      value={form.subdistrict_th}
                      disabled={!form.district_id}
                      onChange={(e) => {
                        const title = e.target.value
                        const sel = subdistrictsList.find(
                          (s) => s.title_th === title
                        )
                        setForm((prev) => ({
                          ...prev,
                          subdistrict_th: title,
                          subdistrict_en: sel?.title_en || '',
                          subdistrict_id: sel?.id || ''
                        }))
                      }}
                      className={selectClass}
                    >
                      <option value=''>เลือกตำบล / แขวง</option>
                      {subdistrictsList.map((s) => (
                        <option key={s.id} value={s.title_th}>
                          {s.title_th}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className='px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3'>
              <button
                onClick={() => setIsOpen(false)}
                className='px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-white transition-colors'
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {isSaving ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' /> กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className='w-5 h-5' /> บันทึก
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
