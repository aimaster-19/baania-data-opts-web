import React from 'react'
import { type ProjectTabProps } from '../../types/project/form'
import type { IDeveloper } from '../../types/developer'

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm bg-white'

export const DeveloperTab: React.FC<ProjectTabProps> = ({
  formData,
  setFormData
}) => {
  const dev = formData.developer

  const setDev = (field: keyof IDeveloper, value: string | number) =>
    setFormData((prev) => ({
      ...prev,
      developer: { ...prev.developer, [field]: value }
    }))

  const renderField = (
    label: string,
    field: keyof IDeveloper,
    placeholder = '',
    type: 'text' | 'number' = 'text'
  ) => (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label}
      </label>
      <input
        type={type}
        value={
          type === 'number'
            ? (dev[field] as number) || ''
            : (dev[field] as string) || ''
        }
        onChange={(e) =>
          setDev(
            field,
            type === 'number'
              ? e.target.value === ''
                ? 0
                : Number(e.target.value)
              : e.target.value
          )
        }
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )

  const renderArea = (
    label: string,
    field: keyof IDeveloper,
    placeholder = '',
    rows = 2
  ) => (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
        {label}
      </label>
      <textarea
        value={(dev[field] as string) || ''}
        onChange={(e) => setDev(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={inputClass + ' resize-y'}
      />
    </div>
  )

  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        ข้อมูลบริษัทผู้พัฒนาโครงการ
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {renderField(
          'ชื่อที่แสดง (Display Name)',
          'display_name',
          'เช่น บริษัท บริทาเนีย จำกัด'
        )}
        {renderField('ชื่อทางการ (TH)', 'title_th')}
        {renderField('ชื่อทางการ (EN)', 'title_en', 'เช่น BRITANIA CO., LTD.')}
        {renderField(
          'ทุนจดทะเบียน (Capital)',
          'capital',
          'เช่น 300000000',
          'number'
        )}
        {renderField('เลขทะเบียนนิติบุคคล', 'reg_num', 'เช่น 0115559016801')}
        {renderField('แผนก (Department)', 'department')}
        {renderField('สาขา (Branch)', 'branch', 'เช่น สำนักงานใหญ่')}
        {renderField('อีเมลผู้พัฒนา', 'email', 'email@dev.com')}
        {renderField('เว็บไซต์ผู้พัฒนา', 'website', 'https://...')}
        {renderField('เซกเมนต์ธุรกิจ', 'business_segment')}
      </div>
      {renderArea('รายนามกรรมการบริษัท (Director)', 'director', 'ชื่อ-นามสกุล')}
      {renderArea(
        'ที่อยู่บริษัท',
        'address',
        'รายละเอียดที่ตั้งสำนักงานใหญ่...'
      )}
      {renderArea('ข้อมูลติดต่ออื่นๆ (Contact Info)', 'contact_info')}
    </div>
  )
}
