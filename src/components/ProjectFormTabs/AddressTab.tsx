import React, { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { type ProjectTabProps } from '../../types/project/form'
import type { BaaniaDocument } from '../../types/common'
import type { District } from '../../types/district'
import type { Subdistrict } from '../../types/subdistrict'
import { ProjectInput, ProjectTextarea } from './FormHelpers'

interface AddressTabProps extends ProjectTabProps {
  provincesList: { id: string; title_th: string; title_en: string }[]
}

export const AddressTab: React.FC<AddressTabProps> = ({
  formData,
  handleInputChange,
  setFormData,
  provincesList
}) => {
  const [districtsList, setDistrictsList] = useState<
    { id: string; title_th: string; title_en: string }[]
  >([])
  const [subdistrictsList, setSubdistrictsList] = useState<
    { id: string; title_th: string; title_en: string }[]
  >([])

  useEffect(() => {
    if (formData.province_id) {
      api
        .get(`/districts?provinceCode=${formData.province_id}`)
        .then((res) => {
          if (res.data) {
            setDistrictsList(
              (res.data.data as BaaniaDocument<District>[]).map((doc) => ({
                id: String(doc.data.id),
                title_th: doc.data.title?.title_th || '',
                title_en: doc.data.title?.title_en || ''
              }))
            )
          }
        })
        .catch((err) => console.error('Failed to fetch districts', err))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDistrictsList([])
    }
  }, [formData.province_id])

  useEffect(() => {
    if (formData.district_id) {
      api
        .get(`/subdistricts?districtCode=${formData.district_id}`)
        .then((res) => {
          if (res.data) {
            setSubdistrictsList(
              (res.data.data as BaaniaDocument<Subdistrict>[]).map((doc) => ({
                id: String(doc.data.id),
                title_th: doc.data.title?.title_th || '',
                title_en: doc.data.title?.title_en || ''
              }))
            )
          }
        })
        .catch((err) => console.error('Failed to fetch subdistricts', err))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubdistrictsList([])
    }
  }, [formData.district_id])
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
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
            ตำบล / แขวง (TH)
          </label>
          <select
            name='subdistrict_th'
            value={formData.subdistrict_th}
            onChange={(e) => {
              const title = e.target.value
              const selected = subdistrictsList.find(
                (s) => s.title_th === title
              )
              setFormData((prev) => ({
                ...prev,
                subdistrict_th: title,
                subdistrict_en: selected ? selected.title_en : '',
                subdistrict_id: selected ? parseInt(selected.id) : 0
              }))
            }}
            disabled={!formData.district_id}
            className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400'
          >
            <option value=''>เลือกตำบล / แขวง</option>
            {subdistrictsList.map((s) => (
              <option key={s.id} value={s.title_th}>
                {s.title_th}
              </option>
            ))}
          </select>
        </div>
        <ProjectInput
          label='ตำบล / แขวง (EN)'
          name='subdistrict_en'
          placeholder='เช่น BUENG KHAM PHROI'
          formData={formData}
          handleInputChange={handleInputChange}
          readOnly
        />
        <ProjectInput
          label='รหัสตำบล (Subdistrict ID)'
          name='subdistrict_id'
          placeholder='เช่น 3642'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
          readOnly
        />
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
            อำเภอ / เขต (TH)
          </label>
          <select
            name='district_th'
            value={formData.district_th}
            onChange={(e) => {
              const title = e.target.value
              const selected = districtsList.find((d) => d.title_th === title)
              setFormData((prev) => ({
                ...prev,
                district_th: title,
                district_en: selected ? selected.title_en : '',
                district_id: selected ? parseInt(selected.id) : 0,
                // Clear child fields
                subdistrict_th: '',
                subdistrict_en: '',
                subdistrict_id: 0
              }))
            }}
            disabled={!formData.province_id}
            className='w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400'
          >
            <option value=''>เลือกอำเภอ / เขต</option>
            {districtsList.map((d) => (
              <option key={d.id} value={d.title_th}>
                {d.title_th}
              </option>
            ))}
          </select>
        </div>
        <ProjectInput
          label='อำเภอ / เขต (EN)'
          name='district_en'
          placeholder='เช่น LAM LUK KA'
          formData={formData}
          handleInputChange={handleInputChange}
          readOnly
        />
        <ProjectInput
          label='รหัสอำเภอ (District ID)'
          name='district_id'
          placeholder='เช่น 3638'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
          readOnly
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
                province_en: selected ? selected.title_en : '',
                province_id: selected ? parseInt(selected.id) : 0,
                // Clear child fields
                district_th: '',
                district_en: '',
                district_id: 0,
                subdistrict_th: '',
                subdistrict_en: '',
                subdistrict_id: 0
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
          readOnly
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
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='ลองจิจูด (Lon)'
          name='lon'
          placeholder='เช่น 100.7164826'
          type='number'
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
