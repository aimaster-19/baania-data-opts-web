import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { ProjectInput, ProjectTextarea } from './FormHelpers'

export const ContactTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        ช่องทางติดต่อทางการ
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <ProjectInput
          label='อีเมล (Email)'
          name='email'
          placeholder='info@...'
          type='email'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='เว็บไซต์หลัก'
          name='website'
          placeholder='https://...'
          type='url'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='Facebook URL'
          name='facebook'
          placeholder='https://facebook.com/...'
          type='url'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='Line Official URL'
          name='line'
          placeholder='https://line.me/...'
          type='url'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
        สำนักงานขาย (Selloffice)
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <ProjectInput
          label='เบอร์โทรศัพท์ฝ่ายขาย'
          name='selloffice_contact_number'
          placeholder='เช่น 1509'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectTextarea
          label='ที่ตั้งสำนักงานขาย'
          name='selloffice_address'
          placeholder='หากไม่ได้ตั้งอยู่ที่เดียวกับโครงการ'
          rows={2}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
