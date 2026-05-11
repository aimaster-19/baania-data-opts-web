import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, FileWarning } from 'lucide-react'

interface ImageUploadProps {
  label: string
  onUpload: (files: File[]) => void
  onRemove?: (index: number) => void
  maxFiles?: number
  initialImages?: string[]
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onUpload,
  onRemove,
  maxFiles = 1,
  initialImages = []
}) => {
  const [previews, setPreviews] = useState<string[]>(initialImages)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
      setPreviews((prev) => {
        const updated = [...prev, ...newPreviews].slice(0, maxFiles)
        return updated
      })
      onUpload(acceptedFiles)
    },
    [maxFiles, onUpload]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { 'image/*': [] },
      maxFiles
    })

  const removeImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    if (onRemove) onRemove(index)
  }

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      })
    }
  }, [previews])

  return (
    <div className='space-y-3'>
      <label className='block text-sm font-semibold text-slate-700'>
        {label}
      </label>

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer text-center
          ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[0.99]' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center'>
          <div
            className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mb-3 transition-colors ${isDragActive ? 'bg-blue-500 text-white' : 'bg-white text-slate-400'}`}
          >
            <Upload className='w-6 h-6' />
          </div>
          <h4 className='text-sm font-bold text-slate-800'>
            {isDragActive ? 'วางไฟล์ได้เลย!' : 'ลากไฟล์รูปภาพมาวางที่นี่'}
          </h4>
          <p className='text-slate-400 mt-1 text-xs'>
            PNG, JPG หรือ WebP (สูงสุด {maxFiles} รูป)
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-2'>
          {previews.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className='relative group aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100'
            >
              <img
                src={url}
                alt={`preview-${index}`}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                <button
                  type='button'
                  onClick={(e) => removeImage(e, index)}
                  className='p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:scale-110 transition-all duration-200'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
              {index === 0 && (
                <div className='absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-[10px] font-bold text-white rounded-md shadow-sm'>
                  รูปหลัก
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
