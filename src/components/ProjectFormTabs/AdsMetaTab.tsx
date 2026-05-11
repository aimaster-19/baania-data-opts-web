import React from 'react'
import { type ProjectTabProps } from '../../types/project/form'
import { ProjectInput, ProjectTextarea } from './FormHelpers'

export const AdsMetaTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        การทำ SEO บนเว็บ
      </h2>
      <ProjectTextarea
        label='Keywords (Meta Keywords)'
        name='meta_keywords'
        placeholder='บ้านจัดสรร, ทาวน์โฮม, ปทุมธานี'
        rows={2}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <ProjectTextarea
        label='Description (Meta Description)'
        name='meta_description'
        placeholder='คำอธิบายโครงการแบบย่อสำหรับ Google Search'
        rows={2}
        formData={formData}
        handleInputChange={handleInputChange}
      />

      <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
        การยิงโฆษณา (Ads Retargeting)
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <ProjectInput
          label='Google Content Type'
          name='retarget_google'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='Facebook Content Type'
          name='retarget_facebook'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='Retarget Price Start'
          name='retarget_price'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
