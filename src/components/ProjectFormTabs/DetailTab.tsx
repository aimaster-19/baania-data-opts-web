import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { ProjectInput } from './FormHelpers'

export const DetailTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        ข้อมูลสเกลโครงการ
      </h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
        <ProjectInput
          label='พื้นที่ส่วนกลาง'
          name='area_shared'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='พื้นที่ (ไร่)'
          name='area_rai'
          placeholder='เช่น 31'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='พื้นที่ (งาน)'
          name='area_ngan'
          placeholder='เช่น 3'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='พื้นที่ (วา)'
          name='area_wa'
          placeholder='เช่น 93'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='จำนวนยูนิตทั้งหมด'
          name='num_unit'
          placeholder='เช่น 288'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='จำนวนชั้น'
          name='num_floor'
          placeholder='เช่น 2'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='จำนวนลิฟต์'
          name='num_lift'
          placeholder='เช่น 2'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ลิฟต์ขนของ'
          name='num_lift_service'
          placeholder='เช่น 1'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='อัตราส่วนที่จอดรถ'
          name='ratio_parking'
          placeholder='เช่น 40%'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='จำนวนที่จอดรถ'
          name='num_parking'
          placeholder='เช่น 100 คัน'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <div className='col-span-2'>
          <ProjectInput
            label='เงื่อนไขประกัน (Insurance Condition)'
            name='insurance_condition'
            placeholder='รายละเอียดการรับประกันโครงสร้าง'
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}
