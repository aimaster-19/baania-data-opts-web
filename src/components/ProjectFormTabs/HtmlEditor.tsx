import React, { useEffect, useRef, useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Heading2,
  Heading3,
  Eraser,
  Code2,
  Eye
} from 'lucide-react'

interface HtmlEditorProps {
  label: string
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

type ToolButton = {
  icon: React.ReactNode
  title: string
  command: string
  value?: string
}

const TOOL_GROUPS: ToolButton[][] = [
  [
    { icon: <Bold className='w-4 h-4' />, title: 'ตัวหนา', command: 'bold' },
    {
      icon: <Italic className='w-4 h-4' />,
      title: 'ตัวเอียง',
      command: 'italic'
    },
    {
      icon: <Underline className='w-4 h-4' />,
      title: 'ขีดเส้นใต้',
      command: 'underline'
    }
  ],
  [
    {
      icon: <Heading2 className='w-4 h-4' />,
      title: 'หัวข้อใหญ่',
      command: 'formatBlock',
      value: '<h2>'
    },
    {
      icon: <Heading3 className='w-4 h-4' />,
      title: 'หัวข้อย่อย',
      command: 'formatBlock',
      value: '<h3>'
    }
  ],
  [
    {
      icon: <List className='w-4 h-4' />,
      title: 'รายการจุด',
      command: 'insertUnorderedList'
    },
    {
      icon: <ListOrdered className='w-4 h-4' />,
      title: 'รายการตัวเลข',
      command: 'insertOrderedList'
    }
  ]
]

export const HtmlEditor: React.FC<HtmlEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  minHeight = 160
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const isFocusedRef = useRef(false)
  const [showSource, setShowSource] = useState(false)

  // Sync external value into the editable div, but never while the user is
  // typing (that would reset the caret). This handles loading project data.
  useEffect(() => {
    const el = editorRef.current
    if (el && !isFocusedRef.current && el.innerHTML !== value) {
      el.innerHTML = value || ''
    }
  }, [value, showSource])

  const emitChange = () => {
    onChange(editorRef.current?.innerHTML || '')
  }

  const exec = (command: string, val?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, val)
    emitChange()
  }

  const addLink = () => {
    const url = window.prompt('ใส่ลิงก์ URL (เช่น https://...)')
    if (url) exec('createLink', url)
  }

  const clearFormat = () => {
    exec('removeFormat')
    exec('unlink')
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-1.5'>
        <label className='block text-sm font-semibold text-slate-700'>
          {label}
        </label>
        <button
          type='button'
          onClick={() => setShowSource((s) => !s)}
          className='flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors'
          title={showSource ? 'กลับไปโหมดแก้ไข' : 'แก้ไข HTML ดิบ'}
        >
          {showSource ? (
            <>
              <Eye className='w-3.5 h-3.5' /> โหมดแก้ไข
            </>
          ) : (
            <>
              <Code2 className='w-3.5 h-3.5' /> HTML
            </>
          )}
        </button>
      </div>

      <div className='rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all'>
        {!showSource && (
          <div className='flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-2 py-1.5'>
            {TOOL_GROUPS.map((group, gi) => (
              <React.Fragment key={gi}>
                {group.map((btn) => (
                  <button
                    key={btn.title}
                    type='button'
                    title={btn.title}
                    // preventDefault keeps the current text selection alive
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => exec(btn.command, btn.value)}
                    className='p-1.5 rounded-md text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all'
                  >
                    {btn.icon}
                  </button>
                ))}
                <span className='mx-1 h-5 w-px bg-slate-200' />
              </React.Fragment>
            ))}
            <button
              type='button'
              title='แทรกลิงก์'
              onMouseDown={(e) => e.preventDefault()}
              onClick={addLink}
              className='p-1.5 rounded-md text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all'
            >
              <Link2 className='w-4 h-4' />
            </button>
            <button
              type='button'
              title='ล้างการจัดรูปแบบ'
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearFormat}
              className='p-1.5 rounded-md text-slate-600 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all'
            >
              <Eraser className='w-4 h-4' />
            </button>
          </div>
        )}

        {showSource ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            style={{ minHeight }}
            className='w-full px-4 py-3 text-sm font-mono text-slate-700 outline-none resize-y bg-slate-50/50'
          />
        ) : (
          <>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={emitChange}
              onFocus={() => (isFocusedRef.current = true)}
              onBlur={() => {
                isFocusedRef.current = false
                emitChange()
              }}
              data-placeholder={placeholder}
              style={{ minHeight }}
              className='html-editor-content w-full px-4 py-3 text-sm text-slate-700 outline-none overflow-y-auto'
            />
            <style>{`
              .html-editor-content:empty:before {
                content: attr(data-placeholder);
                color: #94a3b8;
                pointer-events: none;
              }
              .html-editor-content ul { list-style: disc; margin: 0.25rem 0 0.25rem 1.5rem; }
              .html-editor-content ol { list-style: decimal; margin: 0.25rem 0 0.25rem 1.5rem; }
              .html-editor-content h2 { font-size: 1.125rem; font-weight: 700; margin: 0.5rem 0; }
              .html-editor-content h3 { font-size: 1rem; font-weight: 600; margin: 0.4rem 0; }
              .html-editor-content a { color: #2563eb; text-decoration: underline; }
              .html-editor-content p { margin: 0.25rem 0; }
            `}</style>
          </>
        )}
      </div>
    </div>
  )
}
