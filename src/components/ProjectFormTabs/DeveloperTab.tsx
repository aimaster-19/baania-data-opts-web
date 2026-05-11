import React from 'react'
import { type ProjectTabProps } from '../../types/project/form'
import { ProjectInput, ProjectTextarea } from './FormHelpers'

export const DeveloperTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        ข้อมูลบริษัทผู้พัฒนาโครงการ
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <ProjectInput
          label='ชื่อที่แสดง (Display Name)'
          name='dev_display_name'
          placeholder='เช่น บริษัท บริทาเนีย จำกัด'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ชื่อทางการ (TH)'
          name='dev_title_th'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ชื่อทางการ (EN)'
          name='dev_title_en'
          placeholder='เช่น BRITANIA CO., LTD.'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ทุนจดทะเบียน (Capital)'
          name='dev_capital'
          placeholder='เช่น 300000000'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='เลขทะเบียนนิติบุคคล'
          name='dev_reg_num'
          placeholder='เช่น 0115559016801'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='แผนก (Department)'
          name='dev_department'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='สาขา (Branch)'
          name='dev_branch'
          placeholder='เช่น เปลี่ยนแปลงชื่อบริษัทเดิม...'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='อีเมลผู้พัฒนา'
          name='dev_email'
          placeholder='email@dev.com'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='เว็บไซต์ผู้พัฒนา'
          name='dev_website'
          placeholder='https://...'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='เซกเมนต์ธุรกิจ'
          name='dev_business_segment'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
      <ProjectTextarea
        label='รายนามกรรมการบริษัท (Director)'
        name='dev_director'
        placeholder='ชื่อ-นามสกุล'
        rows={2}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <ProjectTextarea
        label='ที่อยู่บริษัท'
        name='dev_address'
        placeholder='รายละเอียดที่ตั้งสำนักงานใหญ่...'
        rows={2}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <ProjectTextarea
        label='ข้อมูลติดต่ออื่นๆ (Contact Info)'
        name='dev_contact_info'
        rows={2}
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  )
}
