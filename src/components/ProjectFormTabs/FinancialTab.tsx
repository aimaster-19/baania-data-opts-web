import React from 'react'
import { type ProjectTabProps } from '../../types/project/form'
import { ProjectInput } from './FormHelpers'

export const FinancialTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange,
  setFormData
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        ราคาและการเงิน
      </h2>

      {/* ── checkbox ขึ้นก่อน ── */}
      <div className='flex flex-wrap gap-6'>
        <label className='flex items-center gap-2 cursor-pointer text-sm text-slate-600'>
          <input
            type='checkbox'
            checked={!!formData.start_price_not_found}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                start_price_not_found: e.target.checked
              }))
            }
          />
          ไม่พบราคาเริ่มต้น
        </label>
        <label className='flex items-center gap-2 cursor-pointer text-sm text-slate-600'>
          <input
            type='checkbox'
            checked={!!formData.not_show_start_price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                not_show_start_price: e.target.checked
              }))
            }
          />
          ไม่แสดงราคาเริ่มต้น
        </label>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <ProjectInput
          label='ราคาเริ่มต้น (บาท)'
          name='price_start'
          placeholder='เช่น 3190000'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ราคาสูงสุด (บาท)'
          name='price_end'
          placeholder='เช่น 5000000'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ราคาที่ดิน'
          name='price_land'
          placeholder='ราคาที่ดินเปล่า'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ราคาเริ่มต้นเฉลี่ย/ยูนิต'
          name='price_start_per_unit'
          placeholder='เช่น 50000'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ราคาสูงสุดเฉลี่ย/ยูนิต'
          name='price_end_per_unit'
          placeholder='เช่น 80000'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        {/* ค่าส่วนกลาง + หน่วย อยู่บรรทัดเดียวกัน */}
        <div className='grid grid-cols-2 gap-3'>
          <ProjectInput
            label='ค่าส่วนกลาง'
            name='price_facility'
            placeholder='เช่น 35'
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <ProjectInput
            label='หน่วยค่าส่วนกลาง'
            name='unitof_price_facility'
            placeholder='เช่น บาท/ตร.ม.'
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
        <ProjectInput
          label='อัตราผลตอบแทน (Yield %)'
          name='ratio_yield'
          placeholder='เช่น 5'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='จำนวนผลตอบแทน'
          name='num_yield'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ค่าประกันภัย'
          name='insurance_cost'
          placeholder='ค่าใช้จ่ายประกันภัย'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
