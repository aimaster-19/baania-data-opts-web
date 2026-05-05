import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { Image as ImageIcon } from 'lucide-react'

export const ImagesTab: React.FC<ProjectTabProps> = () => {
  return (
    <div className='space-y-6 animate-in fade-in'>
      <div className='bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center'>
        <ImageIcon className='w-10 h-10 text-slate-400 mx-auto mb-4' />
        <h3 className='text-lg font-bold text-slate-800'>Mock Images</h3>
        <p className='text-slate-500 mt-2 text-sm max-w-md mx-auto'>
          ระบบการอัปโหลดไฟล์จริงกำลังอยู่ในช่วงพัฒนา
          ขณะนี้การบันทึกข้อมูลจะแนบรูปภาพตัวอย่างไปให้อัตโนมัติในฐานข้อมูล
        </p>
      </div>
    </div>
  )
}
