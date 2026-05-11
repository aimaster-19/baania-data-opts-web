import React from 'react'
import { type ProjectTabProps } from '../../types/project'
import { ImageUpload } from './ImageUpload'
import { Image as ImageIcon, Camera, LayoutGrid } from 'lucide-react'

export const ImagesTab: React.FC<ProjectTabProps> = ({
  formData,
  setFormData
}) => {
  const handleMainImageUpload = (files: File[]) => {
    console.log('Main image uploaded:', files)
    // ในโปรเจกต์จริง คุณอาจจะอัปโหลดขึ้น Cloud (S3/Cloudinary)
    // แล้วเก็บ URL ลงใน formData
  }

  const handleGalleryUpload = (files: File[]) => {
    console.log('Gallery images uploaded:', files)
  }

  return (
    <div className='space-y-10 animate-in fade-in duration-500'>
      <div className='flex items-center gap-3 border-b border-slate-100 pb-4'>
        <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'>
          <ImageIcon className='w-5 h-5' />
        </div>
        <div>
          <h2 className='text-lg font-bold text-slate-800'>จัดการรูปภาพ</h2>
          <p className='text-xs text-slate-500'>
            อัปโหลดรูปภาพโครงการเพื่อดึงดูดผู้ซื้อ
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        {/* Main Image Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-slate-700'>
            <Camera className='w-4 h-4' />
            <span className='font-bold text-sm uppercase tracking-wider'>
              รูปภาพหลัก (Main Image)
            </span>
          </div>
          <ImageUpload
            label='รูปภาพหน้าปกที่จะแสดงเป็นรูปแรก'
            onUpload={handleMainImageUpload}
            maxFiles={1}
          />
          <p className='text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100'>
            💡 ข้อแนะนำ: ควรใช้รูปภาพแนวนอน อัตราส่วน 4:3 หรือ 16:9
            และมีความละเอียดอย่างน้อย 1024x768px
          </p>
        </div>

        {/* Gallery Section */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-slate-700'>
            <LayoutGrid className='w-4 h-4' />
            <span className='font-bold text-sm uppercase tracking-wider'>
              รูปภาพเพิ่มเติม (Gallery)
            </span>
          </div>
          <ImageUpload
            label='รูปภาพบรรยากาศภายในและภายนอก'
            onUpload={handleGalleryUpload}
            maxFiles={10}
          />
          <p className='text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100'>
            💡 ข้อแนะนำ: คุณสามารถเลือกรูปภาพพร้อมกันได้หลายรูป (รองรับสูงสุด 10
            รูป)
          </p>
        </div>
      </div>
    </div>
  )
}
