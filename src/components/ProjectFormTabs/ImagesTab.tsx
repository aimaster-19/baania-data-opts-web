import React, { useState } from 'react'
import { type ProjectTabProps } from '../../types/project/form'
import { ImageUpload } from './ImageUpload'
import {
  Image as ImageIcon,
  Camera,
  LayoutGrid,
  Map,
  MapPin
} from 'lucide-react'
import api from '../../lib/axios'

export const ImagesTab: React.FC<ProjectTabProps> = ({
  formData,
  setFormData
}) => {
  const [isUploading, setIsUploading] = useState(false)

  // Upload files to S3 via the API and return their public URLs.
  const uploadToServer = async (files: File[]): Promise<string[]> => {
    const fd = new FormData()
    files.forEach((file) => fd.append('images', file))
    fd.append('type', 'project')

    const res = await api.post('/upload/images', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const data: { url?: string }[] = res.data?.data || []
    return data.map((d) => d.url || '').filter(Boolean)
  }

  const handleMainImageUpload = async (files: File[]) => {
    if (files.length === 0) return
    setIsUploading(true)
    try {
      const [url] = await uploadToServer(files)
      if (!url) return
      setFormData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          main: { ...prev.images.main, url, thumbnail: url }
        }
      }))
    } catch (err) {
      console.error('Upload main image failed:', err)
      alert('อัปโหลดรูปภาพหลักไม่สำเร็จ')
    } finally {
      setIsUploading(false)
    }
  }

  const handleGalleryUpload = async (files: File[]) => {
    if (files.length === 0) return
    setIsUploading(true)
    try {
      const urls = await uploadToServer(files)
      if (urls.length === 0) return
      setFormData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          overall: [
            ...prev.images.overall,
            ...urls.map((url) => ({
              title: '',
              url,
              thumbnail: url,
              webp_main: '',
              webp_thumbnail: ''
            }))
          ]
        }
      }))
    } catch (err) {
      console.error('Upload gallery images failed:', err)
      alert('อัปโหลดรูปภาพเพิ่มเติมไม่สำเร็จ')
    } finally {
      setIsUploading(false)
    }
  }

  const handleMainRemove = () => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        main: {
          ...prev.images.main,
          url: '',
          thumbnail: '',
          webp_main: '',
          webp_thumbnail: ''
        }
      }
    }))
  }

  const handleGalleryRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        overall: prev.images.overall.filter((_, i) => i !== index)
      }
    }))
  }

  // ภาพเดี่ยว: แปลน (project) / แผนที่ (map)
  const handleSimpleUpload =
    (field: 'project' | 'map') => async (files: File[]) => {
      if (files.length === 0) return
      setIsUploading(true)
      try {
        const [url] = await uploadToServer(files)
        if (!url) return
        setFormData((prev) => ({
          ...prev,
          images: {
            ...prev.images,
            [field]: { ...prev.images[field], url, thumbnail: url }
          }
        }))
      } catch (err) {
        console.error(`Upload ${field} image failed:`, err)
        alert('อัปโหลดรูปภาพไม่สำเร็จ')
      } finally {
        setIsUploading(false)
      }
    }

  const handleSimpleRemove = (field: 'project' | 'map') => () => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [field]: { ...prev.images[field], url: '', thumbnail: '' }
      }
    }))
  }

  // Existing images (shown when editing). Keys force ImageUpload to re-seed
  // its previews once the project data finishes loading.
  const mainInitial = formData.images.main.url ? [formData.images.main.url] : []
  const galleryInitial = formData.images.overall.map((o) => o.url)
  const planInitial = formData.images.project.url
    ? [formData.images.project.url]
    : []
  const mapInitial = formData.images.map.url ? [formData.images.map.url] : []

  return (
    <div className='space-y-10 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between gap-3 border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-3'>
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
        {isUploading && (
          <span className='text-xs font-medium text-blue-600 animate-pulse'>
            กำลังอัปโหลด...
          </span>
        )}
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
            key={`main-${formData.images.main.url}`}
            label='รูปภาพหน้าปกที่จะแสดงเป็นรูปแรก'
            onUpload={handleMainImageUpload}
            onRemove={handleMainRemove}
            maxFiles={1}
            initialImages={mainInitial}
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
            key={`gallery-${galleryInitial.join('|')}`}
            label='รูปภาพบรรยากาศภายในและภายนอก'
            onUpload={handleGalleryUpload}
            onRemove={handleGalleryRemove}
            maxFiles={10}
            initialImages={galleryInitial}
          />
          <p className='text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100'>
            💡 ข้อแนะนำ: คุณสามารถเลือกรูปภาพพร้อมกันได้หลายรูป (รองรับสูงสุด 10
            รูป)
          </p>
        </div>

        {/* Plan Image Section (project) */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-slate-700'>
            <Map className='w-4 h-4' />
            <span className='font-bold text-sm uppercase tracking-wider'>
              ภาพแปลน (Plan)
            </span>
          </div>
          <ImageUpload
            key={`plan-${formData.images.project.url}`}
            label='ภาพผังโครงการ / แปลนยูนิต'
            onUpload={handleSimpleUpload('project')}
            onRemove={handleSimpleRemove('project')}
            maxFiles={1}
            initialImages={planInitial}
          />
        </div>

        {/* Map Image Section (map) */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-slate-700'>
            <MapPin className='w-4 h-4' />
            <span className='font-bold text-sm uppercase tracking-wider'>
              ภาพแผนที่ (Map)
            </span>
          </div>
          <ImageUpload
            key={`map-${formData.images.map.url}`}
            label='ภาพแผนที่ที่ตั้งโครงการ'
            onUpload={handleSimpleUpload('map')}
            onRemove={handleSimpleRemove('map')}
            maxFiles={1}
            initialImages={mapInitial}
          />
        </div>
      </div>
    </div>
  )
}
