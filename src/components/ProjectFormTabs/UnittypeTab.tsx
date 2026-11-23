import React from 'react'
import { useNavigate } from 'react-router-dom'
import { type ProjectTabProps } from '../../types/project/form'
import {
  LayoutList,
  Pencil,
  BedDouble,
  Bath,
  Ruler,
  Image as ImageIcon
} from 'lucide-react'

export const UnittypeTab: React.FC<ProjectTabProps> = ({ formData }) => {
  const navigate = useNavigate()
  const units = formData.unittype || []

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
              รายการแบบบ้านของโครงการนี้ — กด “แก้ไข” เพื่อเปิดหน้าแก้ไขแบบบ้าน
            </p>
          </div>
        </div>
      </div>

      {units.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl'>
          <LayoutList className='w-12 h-12 text-slate-300 mb-3' />
          <p className='text-slate-500 font-semibold'>ยังไม่มีแบบบ้าน</p>
          <p className='text-slate-400 text-sm mt-1'>
            สร้างแบบบ้านได้จากหน้ารายการโครงการ (ปุ่มรูปบ้าน)
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {units.map((unit, index) => {
            const editId = unit.unittype_keyId || unit.id || ''
            const thumb = unit.image?.thumbnail || unit.image?.url || ''
            return (
              <div
                key={unit.unittype_keyId || unit.id || index}
                className='flex items-center gap-4 px-4 py-3 border border-slate-200 rounded-2xl hover:shadow-sm transition-shadow bg-white'
              >
                <div className='w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0'>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={unit.title || ''}
                      className='w-full h-full object-cover'
                      loading='lazy'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <ImageIcon className='w-5 h-5 text-slate-300' />
                    </div>
                  )}
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-slate-800 truncate'>
                      {unit.title || `ยูนิตที่ ${index + 1}`}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        (unit.published ?? 0) !== 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {(unit.published ?? 0) !== 0 ? 'ออนไลน์' : 'ออฟไลน์'}
                    </span>
                    {unit.sold_out && (
                      <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-500'>
                        Sold Out
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-3 mt-0.5 text-xs text-slate-400 flex-wrap'>
                    {!!unit.num_bed && (
                      <span className='flex items-center gap-1'>
                        <BedDouble className='w-3 h-3' /> {unit.num_bed}
                      </span>
                    )}
                    {!!unit.num_bath && (
                      <span className='flex items-center gap-1'>
                        <Bath className='w-3 h-3' /> {unit.num_bath}
                      </span>
                    )}
                    {!!unit.area_usable && (
                      <span className='flex items-center gap-1'>
                        <Ruler className='w-3 h-3' /> {unit.area_usable} ตร.ม.
                      </span>
                    )}
                    {!!unit.price_start && (
                      <span className='font-medium text-slate-500'>
                        {Number(unit.price_start).toLocaleString()} บาท
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type='button'
                  disabled={!editId}
                  onClick={() => editId && navigate(`/edit-unittype/${editId}`)}
                  className='flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed'
                  title={
                    editId ? 'แก้ไขแบบบ้าน' : 'ไม่มีรหัสแบบบ้านสำหรับแก้ไข'
                  }
                >
                  <Pencil className='w-4 h-4' /> แก้ไข
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
