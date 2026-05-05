import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { ProjectInput, ProjectTextarea } from './FormHelpers'

export const FinancialTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        ราคาและการเงิน
      </h2>
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
          label='ราคาเริ่มต้น/ยูนิต'
          name='price_start_per_unit'
          placeholder='เช่น 50000'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ราคาสูงสุด/ยูนิต'
          name='price_end_per_unit'
          placeholder='เช่น 80000'
          formData={formData}
          handleInputChange={handleInputChange}
        />
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
          placeholder='เช่น b-meter (บาท/ตร.ม.)'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='อัตราผลตอบแทน (Yield %)'
          name='ratio_yield'
          placeholder='เช่น 5%'
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
      <div className='flex gap-4 mb-4'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            name='start_price_not_found'
            checked={!!formData.start_price_not_found}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: 'start_price_not_found',
                  value: e.target.checked as any,
                  type: 'checkbox'
                }
              } as any)
            }
          />{' '}
          ไม่พบราคาเริ่มต้น
        </label>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            name='not_show_start_price'
            checked={!!formData.not_show_start_price}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: 'not_show_start_price',
                  value: e.target.checked as any,
                  type: 'checkbox'
                }
              } as any)
            }
          />{' '}
          ไม่แสดงราคาเริ่มต้น
        </label>
      </div>

      <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
        การโปรโมทและจุดเด่น
      </h2>
      <ProjectTextarea
        label='สโลแกน (Slogan)'
        name='slogan'
        placeholder='เช่น พรีเมียมทาวน์โฮมสไตล์อังกฤษ...'
        rows={2}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <ProjectTextarea
        label='จุดเด่น (Highlight - HTML)'
        name='highlight'
        placeholder='เช่น <p>* อยู่ในทำเลดี...</p>'
        rows={3}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <ProjectTextarea
        label='รายละเอียด (Detail - HTML)'
        name='detail'
        placeholder='เช่น <p>ติดต่อฝ่ายขาย...</p>'
        rows={3}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <ProjectTextarea
        label='โปรโมชั่น (Promotion - HTML)'
        name='promotion'
        placeholder='เช่น <p>* ส่วนลดสูงสุด...</p>'
        rows={3}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <ProjectInput
          label='วันเริ่มโปรโมชั่น'
          name='promotion_start'
          placeholder='เช่น 2025-10-27T17:00:00.000Z'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='วันสิ้นสุดโปรโมชั่น'
          name='promotion_stop'
          placeholder='เช่น 2026-01-27T17:00:00.000Z'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
