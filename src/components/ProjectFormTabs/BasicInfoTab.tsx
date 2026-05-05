import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { ProjectInput } from './FormHelpers'

export const BasicInfoTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
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
        <ProjectInput
          label='จำนวนอาคาร (Building Amount)'
          name='building_amount'
          placeholder='เช่น None หรือ 3 อาคาร'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
