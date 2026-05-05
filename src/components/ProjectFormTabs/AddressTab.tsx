import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { ProjectInput, ProjectTextarea } from './FormHelpers'

interface AddressTabProps extends ProjectTabProps {
  provincesList: { id: string; title_th: string }[]
}

export const AddressTab: React.FC<AddressTabProps> = ({
  formData,
  handleInputChange,
  setFormData,
  provincesList
}) => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        ที่ตั้งโครงการ
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <ProjectTextarea
          label='ที่อยู่ / ถนน (TH)'
          name='address_th'
          placeholder='เช่น ถนน หทัยราษฎร์'
          rows={2}
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectTextarea
          label='ที่อยู่ / ถนน (EN)'
          name='address_en'
          placeholder='เช่น Hatairat Rd.'
          rows={2}
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ตำบล / แขวง (TH)'
          name='subdistrict_th'
          placeholder='เช่น บึงคำพร้อย'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ตำบล / แขวง (EN)'
          name='subdistrict_en'
          placeholder='เช่น BUENG KHAM PHROI'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='รหัสตำบล (Subdistrict ID)'
          name='subdistrict_id'
          placeholder='เช่น 3642'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='อำเภอ / เขต (TH)'
          name='district_th'
          placeholder='เช่น ลำลูกกา'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='อำเภอ / เขต (EN)'
          name='district_en'
          placeholder='เช่น LAM LUK KA'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='รหัสอำเภอ (District ID)'
          name='district_id'
          placeholder='เช่น 3638'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
            จังหวัด (TH)
          </label>
          <select
            name='province_th'
            value={formData.province_th}
            onChange={(e) => {
              const title = e.target.value
              const selected = provincesList.find((p) => p.title_th === title)
              setFormData((prev) => ({
                ...prev,
                province_th: title,
                province_id: selected ? selected.id : ''
              }))
            }}
            className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500'
          >
            <option value=''>เลือกจังหวัด</option>
            {provincesList.map((p) => (
              <option key={p.id} value={p.title_th}>
                {p.title_th}
              </option>
            ))}
          </select>
        </div>
        <ProjectInput
          label='จังหวัด (EN)'
          name='province_en'
          placeholder='เช่น Pathum Thani'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='รหัสจังหวัด (Province ID)'
          name='province_id'
          placeholder='เช่น 3599'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='รหัสไปรษณีย์'
          name='postcode'
          placeholder='เช่น 12150'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='การเดินทาง (Transport)'
          name='transport'
          placeholder='เช่น ใกล้รถไฟฟ้าสายสีชมพู'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='สถานที่ใกล้เคียง (Nearby)'
          name='nearby'
          placeholder='เช่น ห้างสรรพสินค้า'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='เพื่อนบ้าน (Neighbors)'
          name='neighbors'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ผังเมือง (Landzone)'
          name='landzone_name'
          placeholder='เช่น พื้นที่สีเหลือง'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
        พิกัดบนแผนที่
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <ProjectInput
          label='ละติจูด (Lat)'
          name='lat'
          placeholder='เช่น 13.91822353'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ลองจิจูด (Lon)'
          name='lon'
          placeholder='เช่น 100.7164826'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='มุมมอง (Heading)'
          name='heading'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
