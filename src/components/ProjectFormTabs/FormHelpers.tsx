import React from 'react'
import { type ProjectFormData } from '../../types/project'

interface FormInputProps {
  label: string
  name: keyof ProjectFormData
  placeholder?: string
  type?: string
  required?: boolean
  readOnly?: boolean
  disabled?: boolean
  formData: ProjectFormData
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export const ProjectInput: React.FC<FormInputProps> = ({
  label,
  name,
  placeholder = '',
  type = 'text',
  required = false,
  readOnly = false,
  disabled = false,
  formData,
  handleInputChange
}) => (
  <div>
    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
      {label} {required && <span className='text-red-500'>*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={
        formData[name] != null && formData[name] !== 0
          ? String(formData[name])
          : type === 'number'
            ? ''
            : ''
      }
      onChange={handleInputChange}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm ${
        readOnly || disabled
          ? 'bg-slate-50 cursor-not-allowed opacity-80'
          : 'bg-white'
      }`}
    />
  </div>
)

interface FormTextareaProps extends Omit<FormInputProps, 'type' | 'required'> {
  rows?: number
}

export const ProjectTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  placeholder = '',
  rows = 3,
  formData,
  handleInputChange
}) => (
  <div>
    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
      {label}
    </label>
    <textarea
      name={name}
      value={(formData[name] as string) || ''}
      onChange={handleInputChange}
      placeholder={placeholder}
      rows={rows}
      className='w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm'
    />
  </div>
)

interface FacilityCheckProps {
  label: string
  checkName: keyof ProjectFormData
  infoName: keyof ProjectFormData
  formData: ProjectFormData
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
}

export const FacilityCheck: React.FC<FacilityCheckProps> = ({
  label,
  checkName,
  infoName,
  formData,
  handleInputChange
}) => (
  <div className='p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors'>
    <label className='flex items-center gap-3 cursor-pointer mb-3'>
      <div className='relative flex items-center'>
        <input
          type='checkbox'
          name={checkName}
          checked={!!formData[checkName]}
          onChange={handleInputChange}
          className='peer sr-only'
        />
        <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
      </div>
      <span className='text-sm font-bold text-slate-700'>{label}</span>
    </label>
    {formData[checkName] && (
      <input
        type='text'
        name={infoName}
        value={(formData[infoName] as string) || ''}
        onChange={handleInputChange}
        placeholder={`รายละเอียด ${label}...`}
        className='w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500'
      />
    )}
  </div>
)
