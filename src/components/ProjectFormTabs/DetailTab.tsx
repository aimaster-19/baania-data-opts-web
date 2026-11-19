import React from 'react'
import { type ProjectTabProps } from '../../types/project/form'
import { ProjectInput, ProjectTextarea } from './FormHelpers'
import { HtmlEditor } from './HtmlEditor'

// unix seconds <-> yyyy-mm-dd (local) สำหรับ input ปฏิทิน
const toDateInput = (sec: number) => {
  if (!sec) return ''
  const d = new Date(sec * 1000)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const fromDateInput = (v: string) =>
  v ? Math.floor(new Date(v + 'T00:00:00').getTime() / 1000) : 0

const areaInputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm bg-white'

export const DetailTab: React.FC<ProjectTabProps> = ({
  formData,
  handleInputChange,
  setFormData
}) => {
  // งาน: จำนวนเต็ม 0–4 / วา: 0–100
  const setArea =
    (name: 'area_ngan' | 'area_wa', max: number, integer: boolean) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      let n = raw === '' ? 0 : Number(raw)
      if (isNaN(n)) n = 0
      if (integer) n = Math.floor(n)
      n = Math.max(0, Math.min(max, n))
      setFormData((prev) => ({ ...prev, [name]: n }))
    }
  const setHtmlField =
    (name: 'highlight' | 'detail' | 'promotion' | 'info_rationeccomend') =>
    (html: string) =>
      setFormData((prev) => ({ ...prev, [name]: html }))

  const dateInputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

  return (
    <div className='space-y-6 animate-in fade-in'>
      {/* ── การโปรโมทและจุดเด่น (ขึ้นก่อน) ── */}
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
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
      <HtmlEditor
        label='จุดเด่น (Highlight)'
        value={formData.highlight}
        onChange={setHtmlField('highlight')}
        placeholder='หากไม่กรอก ระบบจะใส่ "* ติดต่อฝ่ายขายโครงการ" ให้อัตโนมัติ'
      />
      <HtmlEditor
        label='รายละเอียด (Detail)'
        value={formData.detail}
        onChange={setHtmlField('detail')}
        placeholder='หากไม่กรอก ระบบจะใส่ "* ติดต่อฝ่ายขายโครงการ" ให้อัตโนมัติ'
      />
      <HtmlEditor
        label='โปรโมชั่น (Promotion)'
        value={formData.promotion}
        onChange={setHtmlField('promotion')}
        placeholder='หากไม่กรอก ระบบจะใส่ "* ติดต่อฝ่ายขายโครงการ" ให้อัตโนมัติ'
      />
      <HtmlEditor
        label='ข้อแนะนำการซื้อ (Buying Recommendation)'
        value={formData.info_rationeccomend}
        onChange={setHtmlField('info_rationeccomend')}
        placeholder='เช่น ข้อแนะนำสำหรับผู้ซื้อ เงื่อนไขการจอง...'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
            วันเริ่มโปรโมชั่น
          </label>
          <input
            type='date'
            value={toDateInput(formData.promotion_start)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                promotion_start: fromDateInput(e.target.value)
              }))
            }
            className={dateInputClass}
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
            วันสิ้นสุดโปรโมชั่น
          </label>
          <input
            type='date'
            value={toDateInput(formData.promotion_stop)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                promotion_stop: fromDateInput(e.target.value)
              }))
            }
            className={dateInputClass}
          />
        </div>
      </div>

      {/* ── ข้อมูลสเกลโครงการ ── */}
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
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
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
            พื้นที่ (งาน)
          </label>
          <input
            type='number'
            min={0}
            max={3}
            step={1}
            value={formData.area_ngan || ''}
            onChange={setArea('area_ngan', 3, true)}
            placeholder='0–3'
            className={areaInputClass}
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
            พื้นที่ (วา)
          </label>
          <input
            type='number'
            min={0}
            max={99.99}
            step={0.01}
            value={formData.area_wa || ''}
            onChange={setArea('area_wa', 99.99, false)}
            placeholder='0–99.99'
            className={areaInputClass}
          />
        </div>
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
          label='จำนวนอาคาร (Building Amount)'
          name='building_amount'
          placeholder='เช่น None หรือ 3 อาคาร'
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
          placeholder='เช่น 40'
          type='number'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='จำนวนที่จอดรถ'
          name='num_parking'
          placeholder='เช่น 100'
          type='number'
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
      <ProjectTextarea
        label='คำอธิบายอาคาร (Building Description)'
        name='building_description'
        placeholder='เช่น อาคารสูง 8 ชั้น จำนวน 3 อาคาร...'
        rows={3}
        formData={formData}
        handleInputChange={handleInputChange}
      />

      {/* ── ความคืบหน้าโครงการ (Progress) ── */}
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mt-6'>
        ความคืบหน้าโครงการ (Progress)
      </h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
        <ProjectInput
          label='ความคืบหน้ารวม'
          name='progress_overall'
          placeholder='เช่น 80%'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='งานโครงสร้าง'
          name='progress_structure'
          placeholder='เช่น 90%'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='งานสถาปัตย์'
          name='progress_architect'
          placeholder='เช่น 70%'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='งานระบบ'
          name='progress_system'
          placeholder='เช่น 60%'
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <ProjectInput
          label='งานเดินสายไฟ'
          name='progress_wiring'
          placeholder='เช่น 50%'
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}
