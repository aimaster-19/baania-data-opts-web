import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { FacilityCheck } from './FormHelpers'

export const FacilityTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        สิ่งอำนวยความสะดวกในโครงการ
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FacilityCheck
          label='สระว่ายน้ำ'
          checkName='has_pool'
          infoName='info_pool'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FacilityCheck
          label='ฟิตเนส'
          checkName='has_fitness'
          infoName='info_fitness'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FacilityCheck
          label='สวนสาธารณะ / สวนหย่อม'
          checkName='has_park'
          infoName='info_park'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FacilityCheck
          label='สนามเด็กเล่น'
          checkName='has_playground'
          infoName='info_playground'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FacilityCheck
          label='คลับเฮ้าส์'
          checkName='has_clubhouse'
          infoName='info_clubhouse'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FacilityCheck
          label='ระบบรักษาความปลอดภัย'
          checkName='has_security'
          infoName='info_security'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FacilityCheck
          label='ห้องประชุม / Co-working'
          checkName='has_meeting'
          infoName='info_meeting'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FacilityCheck
          label='รถรับส่ง (Shuttle Bus)'
          checkName='has_service_bus'
          infoName='info_other_fac'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
