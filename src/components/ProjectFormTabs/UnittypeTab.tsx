import React, { useState } from 'react'
import { type ProjectTabProps, type UnitTypeItem } from '../../types/project'
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  BedDouble,
  Bath,
  Ruler,
  DollarSign,
  CheckCircle2,
  XCircle,
  LayoutList
} from 'lucide-react'

const EMPTY_UNIT: UnitTypeItem = {
  title: '',
  price_start: 0,
  price_end: 0,
  area_usable: 0,
  num_bed: 0,
  num_bath: 0,
  sold_out: false
}

export const UnittypeTab: React.FC<ProjectTabProps> = ({
  formData,
  setFormData
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const units = formData.unittype || []

  const addUnit = () => {
    const newUnits = [...units, { ...EMPTY_UNIT }]
    setFormData((prev) => ({ ...prev, unittype: newUnits }))
    setExpandedIndex(newUnits.length - 1)
  }

  const removeUnit = (index: number) => {
    const newUnits = units.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, unittype: newUnits }))
    if (expandedIndex === index) setExpandedIndex(null)
  }

  const updateUnit = (
    index: number,
    field: keyof UnitTypeItem,
    value: string | number | boolean
  ) => {
    const newUnits = units.map((u, i) =>
      i === index ? { ...u, [field]: value } : u
    )
    setFormData((prev) => ({ ...prev, unittype: newUnits }))
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className='space-y-6 animate-in fade-in'>
      <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-2'>
          <LayoutList className='w-5 h-5 text-blue-500' />
          <div>
            <h2 className='text-lg font-bold text-slate-800'>
              ประเภทยูนิต (Unit Types)
            </h2>
            <p className='text-xs text-slate-500'>
              กำหนดแต่ละแบบของโครงการ เช่น ขนาดห้อง ราคา และจำนวนห้องนอน
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={addUnit}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95'
        >
          <Plus className='w-4 h-4' />
          เพิ่มยูนิต
        </button>
      </div>

      {units.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl'>
          <LayoutList className='w-12 h-12 text-slate-300 mb-3' />
          <p className='text-slate-500 font-semibold'>ยังไม่มียูนิต</p>
          <p className='text-slate-400 text-sm mt-1'>
            กดปุ่ม "เพิ่มยูนิต" เพื่อเริ่มต้น
          </p>
          <button
            type='button'
            onClick={addUnit}
            className='mt-4 flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-blue-100 transition-colors'
          >
            <Plus className='w-4 h-4' />
            เพิ่มยูนิตแรก
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          {units.map((unit, index) => (
            <div
              key={index}
              className='border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md'
            >
              {/* Header Row */}
              <div
                className='flex items-center gap-3 px-5 py-4 bg-white cursor-pointer select-none'
                onClick={() => toggleExpand(index)}
              >
                <div className='w-8 h-8 bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center justify-center shrink-0'>
                  {index + 1}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-slate-800 truncate'>
                    {unit.title || `ยูนิตที่ ${index + 1}`}
                  </p>
                  <div className='flex items-center gap-3 mt-0.5 text-xs text-slate-400 flex-wrap'>
                    {unit.num_bed > 0 && (
                      <span className='flex items-center gap-1'>
                        <BedDouble className='w-3 h-3' /> {unit.num_bed} ห้องนอน
                      </span>
                    )}
                    {unit.num_bath > 0 && (
                      <span className='flex items-center gap-1'>
                        <Bath className='w-3 h-3' /> {unit.num_bath} ห้องน้ำ
                      </span>
                    )}
                    {unit.area_usable > 0 && (
                      <span className='flex items-center gap-1'>
                        <Ruler className='w-3 h-3' /> {unit.area_usable} ตร.ม.
                      </span>
                    )}
                    {unit.price_start > 0 && (
                      <span className='flex items-center gap-1'>
                        <DollarSign className='w-3 h-3' />{' '}
                        {unit.price_start.toLocaleString()} บาท
                      </span>
                    )}
                    {unit.sold_out && (
                      <span className='flex items-center gap-1 text-red-400 font-medium'>
                        <XCircle className='w-3 h-3' /> Sold Out
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      removeUnit(index)
                    }}
                    className='p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className='w-4 h-4 text-slate-400' />
                  ) : (
                    <ChevronDown className='w-4 h-4 text-slate-400' />
                  )}
                </div>
              </div>

              {/* Expanded Form */}
              {expandedIndex === index && (
                <div className='border-t border-slate-100 bg-slate-50/60 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {/* Title - full width */}
                  <div className='md:col-span-2 lg:col-span-3'>
                    <label className='block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider'>
                      ชื่อยูนิต / แบบบ้าน{' '}
                      <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={unit.title}
                      onChange={(e) =>
                        updateUnit(index, 'title', e.target.value)
                      }
                      placeholder='เช่น แบบ A1 - 3 ห้องนอน, ทาวน์โฮม 2 ชั้น'
                      className='w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    />
                  </div>

                  {/* Price Start */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider'>
                      ราคาเริ่มต้น (บาท)
                    </label>
                    <input
                      type='number'
                      value={unit.price_start || ''}
                      onChange={(e) =>
                        updateUnit(
                          index,
                          'price_start',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder='เช่น 2500000'
                      className='w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    />
                  </div>

                  {/* Price End */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider'>
                      ราคาสูงสุด (บาท)
                    </label>
                    <input
                      type='number'
                      value={unit.price_end || ''}
                      onChange={(e) =>
                        updateUnit(
                          index,
                          'price_end',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder='เช่น 3500000'
                      className='w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider'>
                      พื้นที่ใช้สอย (ตร.ม.)
                    </label>
                    <input
                      type='number'
                      value={unit.area_usable || ''}
                      onChange={(e) =>
                        updateUnit(
                          index,
                          'area_usable',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder='เช่น 120'
                      className='w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    />
                  </div>

                  {/* Beds */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider'>
                      จำนวนห้องนอน
                    </label>
                    <input
                      type='number'
                      value={unit.num_bed || ''}
                      onChange={(e) =>
                        updateUnit(
                          index,
                          'num_bed',
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder='เช่น 3'
                      min={0}
                      className='w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    />
                  </div>

                  {/* Baths */}
                  <div>
                    <label className='block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider'>
                      จำนวนห้องน้ำ
                    </label>
                    <input
                      type='number'
                      value={unit.num_bath || ''}
                      onChange={(e) =>
                        updateUnit(
                          index,
                          'num_bath',
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder='เช่น 2'
                      min={0}
                      className='w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    />
                  </div>

                  {/* Sold Out Toggle */}
                  <div className='flex items-center'>
                    <label className='flex items-center gap-3 cursor-pointer group'>
                      <div className='relative flex items-center'>
                        <input
                          type='checkbox'
                          checked={unit.sold_out}
                          onChange={(e) =>
                            updateUnit(index, 'sold_out', e.target.checked)
                          }
                          className='peer sr-only'
                        />
                        <div className="w-10 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-slate-700'>
                          Sold Out
                        </p>
                        <p className='text-xs text-slate-400'>
                          ยูนิตนี้ขายหมดแล้ว
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Summary Footer */}
          <div className='flex items-center justify-between px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl'>
            <div className='flex items-center gap-2 text-sm text-slate-600'>
              <CheckCircle2 className='w-4 h-4 text-green-500' />
              <span>
                ยูนิตทั้งหมด: <strong>{units.length}</strong> ประเภท
              </span>
            </div>
            <button
              type='button'
              onClick={addUnit}
              className='flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors'
            >
              <Plus className='w-4 h-4' />
              เพิ่มยูนิต
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
