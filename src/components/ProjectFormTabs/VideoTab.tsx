import React from 'react'
import { type ProjectTabProps } from '../../types/project/form'
import type { ProjectVideoItem } from '../../types/project/form'
import { Video, Plane, Users } from 'lucide-react'

type VideoKey = 'video' | 'aerial' | 'customer'

// ดึง video id จากลิงก์ YouTube รูปแบบต่าง ๆ
const getYoutubeId = (url: string): string => {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )
  return m ? m[1] : ''
}
const youtubeThumb = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
// true ถ้า thumbnail ว่าง หรือเป็นของ YouTube ที่สร้างอัตโนมัติไว้ (จะเขียนทับได้)
const isAutoThumb = (thumb: string) =>
  thumb === '' || /i\.ytimg\.com\/vi\//.test(thumb)

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm bg-white'

export const VideoTab: React.FC<ProjectTabProps> = ({
  formData,
  setFormData
}) => {
  const setVideoField = (
    key: VideoKey,
    field: keyof ProjectVideoItem,
    value: string
  ) =>
    setFormData((prev) => ({
      ...prev,
      video: {
        ...prev.video,
        [key]: { ...prev.video[key], [field]: value }
      }
    }))

  // เมื่อใส่ลิงก์: อัปเดต url และ generate thumbnail จาก YouTube ให้อัตโนมัติ
  const onUrlChange = (key: VideoKey, url: string) =>
    setFormData((prev) => {
      const cur = prev.video[key]
      const id = getYoutubeId(url)
      const thumbnail =
        id && isAutoThumb(cur.thumbnail) ? youtubeThumb(id) : cur.thumbnail
      return {
        ...prev,
        video: { ...prev.video, [key]: { ...cur, url, thumbnail } }
      }
    })

  const groups: { key: VideoKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'video',
      label: 'วิดีโอโครงการ (Video)',
      icon: <Video className='w-4 h-4' />
    },
    {
      key: 'aerial',
      label: 'วิดีโอมุมสูง (Aerial)',
      icon: <Plane className='w-4 h-4' />
    },
    {
      key: 'customer',
      label: 'วิดีโอรีวิวลูกค้า (Customer)',
      icon: <Users className='w-4 h-4' />
    }
  ]

  return (
    <div className='space-y-8 animate-in fade-in'>
      <h2 className='text-lg font-bold text-slate-800 border-b pb-2'>
        วิดีโอโครงการ
      </h2>

      {groups.map((g) => {
        const item = formData.video[g.key]
        return (
          <div
            key={g.key}
            className='rounded-2xl border border-slate-200 p-5 space-y-4'
          >
            <div className='flex items-center gap-2 text-slate-700 font-bold text-sm'>
              {g.icon} {g.label}
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                ลิงก์วิดีโอ (URL)
              </label>
              <input
                type='url'
                value={item.url}
                onChange={(e) => onUrlChange(g.key, e.target.value)}
                placeholder='เช่น https://www.youtube.com/watch?v=...'
                className={inputClass}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  ชื่อวิดีโอ (Title)
                </label>
                <input
                  type='text'
                  value={item.title}
                  onChange={(e) =>
                    setVideoField(g.key, 'title', e.target.value)
                  }
                  placeholder='เช่น พฤกษ์ภิรมย์ ราชพฤกษ์'
                  className={inputClass}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  รูปภาพปก (Thumbnail URL)
                </label>
                <input
                  type='url'
                  value={item.thumbnail}
                  onChange={(e) =>
                    setVideoField(g.key, 'thumbnail', e.target.value)
                  }
                  placeholder='เช่น https://i.ytimg.com/vi/.../hqdefault.jpg'
                  className={inputClass}
                />
              </div>
            </div>
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title || g.label}
                className='w-48 aspect-video object-cover rounded-xl border border-slate-200'
                loading='lazy'
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
