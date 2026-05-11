import React, { useState, useEffect, useRef, useCallback } from 'react'
import api from '../../lib/axios'
import { type ProjectTabProps } from '../../types/project'
import { ProjectInput } from './FormHelpers'
import { Building2, Loader2, Search, X, CheckCircle } from 'lucide-react'
import type { IDeveloper } from '../../types/developer'

const DEBOUNCE_MS = 350

// ── Autocomplete Developer Input ───────────────────────────────────────────
function DeveloperAutocomplete({
  value,
  onSelect
}: {
  value: string
  onSelect: (dev: IDeveloper) => void
}) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<IDeveloper[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchDevelopers = useCallback((q: string) => {
    setLoading(true)
    api
      .get('/developers', { params: { title_th: q, limit: 20 } })
      .then((res) => {
        const data: IDeveloper[] = res.data?.data || res.data || []
        setResults(
          data.map((item: IDeveloper) => ({
            id: item?.id ?? item.id ?? 0,
            display_name: item?.display_name || item.display_name || '-',
            title_th: item?.title_th || item.title_th || '-',
            title_en: item?.title_en || item.title_en || '-',
            image: item?.image || item.image || {},
            capital: item?.capital || item.capital || 0,
            website: item?.website || item.website || '',
            address: item?.address || item.address || '',
            reg_num: item?.reg_num || item.reg_num || '',
            director: item?.director || item.director || '',
            keyId: item?.keyId || item.keyId || '',
            business_segment:
              item?.business_segment || item.business_segment || '',
            contact_info: item?.contact_info || item.contact_info || '',
            branch: item?.branch || item.branch || '',
            bank_id: item?.bank_id || item.bank_id || '',
            location: item?.location || item.location || {},
            department: item?.department || item.department || '',
            email: item?.email || item.email || ''
          }))
        )
        setOpen(true)
        setHighlighted(-1)
      })
      .catch((err) => console.error('Developer search error', err))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    clearTimeout(debounceRef.current)
    if (q.trim().length === 0) {
      setResults([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(
      () => fetchDevelopers(q.trim()),
      DEBOUNCE_MS
    )
  }

  const handleSelect = (dev: IDeveloper) => {
    setQuery(dev.display_name)
    setOpen(false)
    onSelect(dev)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setOpen(false)
    inputRef.current?.focus()
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      handleSelect(results[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className='relative'>
      {/* Input */}
      <div className='relative'>
        <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 0 && results.length > 0) setOpen(true)
          }}
          placeholder='พิมพ์เพื่อค้นหาชื่อผู้พัฒนา...'
          autoComplete='off'
          className='w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all'
        />
        {/* Right indicator */}
        <div className='absolute right-3 top-1/2 -translate-y-1/2'>
          {loading ? (
            <Loader2 className='w-4 h-4 text-slate-400 animate-spin' />
          ) : query ? (
            <button
              type='button'
              onClick={handleClear}
              className='text-slate-300 hover:text-slate-500 transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className='absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden'
          style={{ animation: 'dropdownIn 0.15s ease' }}
        >
          {results.length === 0 && !loading ? (
            <div className='px-4 py-5 text-center text-slate-400 text-sm'>
              ไม่พบผู้พัฒนาที่ตรงกับ "
              <span className='font-medium text-slate-600'>{query}</span>"
            </div>
          ) : (
            <ul className='max-h-64 overflow-y-auto divide-y divide-slate-50'>
              {results.map((dev, idx) => (
                <li key={dev.id}>
                  <button
                    type='button'
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => handleSelect(dev)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors ${
                      highlighted === idx ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        highlighted === idx
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {dev.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p
                        className={`text-sm font-medium truncate transition-colors ${
                          highlighted === idx
                            ? 'text-blue-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {dev.display_name}
                      </p>
                      <p className='text-xs text-slate-400'>ID: {dev.id}</p>
                    </div>
                    {highlighted === idx && (
                      <CheckCircle className='w-4 h-4 text-blue-400 shrink-0' />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className='px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1'>
            <span>↑↓ เลือก</span>
            <span className='mx-1'>·</span>
            <span>Enter ยืนยัน</span>
            <span className='mx-1'>·</span>
            <span>Esc ปิด</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Main Tab ───────────────────────────────────────────────────────────────
export const BasicInfoTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange,
  setFormData
}) => {
  const handleDeveloperSelect = (dev: IDeveloper) => {
    setFormData((prev) => ({
      ...prev,
      developer: dev
    }))
  }

  const handleClearDeveloper = () => {
    setFormData((prev) => ({ ...prev, developer_id: 0, developer_name: '' }))
  }

  return (
    <div className='space-y-8 animate-in fade-in'>
      {/* ── Section 1: Project Info ── */}
      <div>
        <h2 className='text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5'>
          ข้อมูลหลักโครงการ
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <ProjectInput
            label='ชื่อโครงการ (TH)'
            name='title_th'
            placeholder='เช่น บริทาเนีย วงแหวน - จตุโชติ'
            required
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <ProjectInput
            label='ชื่อโครงการ (EN)'
            name='title_en'
            placeholder='เช่น Britania Wongwaen - Chatuchot'
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <ProjectInput
            label='รหัสโครงการ (Code)'
            name='code'
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <ProjectInput
            label='คำค้นหา (Search Keyword)'
            name='search_keyword'
            placeholder='คีย์เวิร์ดสำหรับให้คนค้นเจอ'
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
              ประเภทโครงการ <span className='text-red-500'>*</span>
            </label>
            <select
              name='property_type'
              value={formData.property_type}
              onChange={handleInputChange}
              className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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
              className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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
              className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            >
              <option value='none'>None</option>
              <option value='under-construction'>กำลังก่อสร้าง</option>
              <option value='completed'>สร้างเสร็จพร้อมอยู่</option>
            </select>
          </div>
          <ProjectInput
            label='จำนวนอาคาร (Building Amount)'
            name='building_amount'
            placeholder='เช่น None หรือ 3 อาคาร'
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>

      {/* ── Section 2: Developer ── */}
      <div>
        <h2 className='text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2'>
          <Building2 className='w-5 h-5 text-blue-500' />
          ผู้พัฒนาโครงการ
        </h2>

        {formData.developer.keyId ? (
          /* ── Selected state ── */
          <div className='flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-base shrink-0 shadow-sm'>
              {formData.developer.display_name.charAt(0).toUpperCase()}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-bold text-blue-900 truncate'>
                {formData.developer.display_name}
              </p>
              <p className='text-xs text-blue-400 mt-0.5'>
                Developer ID:{' '}
                <span className='font-mono'>{formData.developer.keyId}</span>
              </p>
            </div>
            <button
              type='button'
              onClick={handleClearDeveloper}
              className='flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-medium shrink-0'
            >
              <X className='w-3.5 h-3.5' />
              เปลี่ยน
            </button>
          </div>
        ) : (
          /* ── Search autocomplete ── */
          <div className='space-y-2'>
            <DeveloperAutocomplete
              value={formData.developer?.display_name || ''}
              onSelect={handleDeveloperSelect}
            />
            <p className='text-xs text-slate-400 pl-1'>
              พิมพ์อย่างน้อย 1 ตัวอักษรเพื่อค้นหาผู้พัฒนาโครงการ
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
