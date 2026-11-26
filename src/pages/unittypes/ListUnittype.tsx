import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home,
  Search,
  RefreshCw,
  Loader2,
  Trash2,
  Pencil,
  Image as ImageIcon,
  BedDouble,
  Bath,
  Maximize
} from 'lucide-react'
import api from '../../lib/axios'
import { getApiErrorMessage } from '../../lib/errors'
import type { PaginationMeta } from '../../types/common'

const ITEMS_PER_PAGE = 20

interface UnittypeRow {
  _id: string
  keyId?: string
  data?: {
    published?: number
    info?: { title_th?: string; title_en?: string }
    financial?: { price_start?: number }
    detail?: { num_bed?: number; num_bath?: number; area_usable?: number }
    images?: { main?: { thumbnail?: string } }
    project?: { project_keyId?: string; title_th?: string; code?: string }
  }
}

function PublishBadge({ published }: { published?: number }) {
  const online = (published ?? 0) !== 0
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        online
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-slate-100 text-slate-500'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-slate-400'}`}
      />
      {online ? 'ออนไลน์' : 'ออฟไลน์'}
    </span>
  )
}

export default function ListUnittype() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<UnittypeRow[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด') // ทั้งหมด | ออนไลน์ | ออฟไลน์ | ลบ
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUnittypes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: ITEMS_PER_PAGE
      }
      if (searchQuery.trim()) params.search = searchQuery.trim()
      if (selectedStatus === 'ออนไลน์') params.publishStatus = 'online'
      else if (selectedStatus === 'ออฟไลน์') params.publishStatus = 'offline'
      else if (selectedStatus === 'ลบ') params.deleted = 'true'
      const { data: res } = await api.get('/unittype/list', { params })
      setRows(res.data || [])
      setPagination(
        res.pagination || {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          total: (res.data || []).length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      )
    } catch (err) {
      setError(getApiErrorMessage(err, 'ไม่สามารถโหลดข้อมูลแบบบ้านได้'))
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery, selectedStatus])

  useEffect(() => {
    fetchUnittypes()
  }, [fetchUnittypes])

  // ค้นหาเมื่อกดปุ่ม/Enter เท่านั้น (ไม่ auto search ระหว่างพิมพ์)
  const handleSearchSubmit = () => {
    const q = searchInput.trim()
    setCurrentPage(1)
    setSearchQuery(q)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบแบบบ้านนี้ใช่หรือไม่?')) return
    setDeletingId(id)
    try {
      await api.delete(`/unittype/delete/${id}`)
      fetchUnittypes()
    } catch (err) {
      alert(getApiErrorMessage(err, 'ลบไม่สำเร็จ'))
    } finally {
      setDeletingId(null)
    }
  }

  const { page, totalPages, total, hasNextPage, hasPrevPage } = pagination

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2'>
          <Home className='w-7 h-7 text-emerald-600' /> แบบบ้าน (Unit Type)
        </h1>
        <p className='text-slate-500 mt-2'>
          รายการแบบบ้านทั้งหมด ({total.toLocaleString()} รายการ)
        </p>
      </div>

      {/* Search */}
      <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-3 mb-6 flex items-center gap-2'>
        <Search className='w-5 h-5 text-slate-400 ml-2' />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchSubmit()
          }}
          placeholder='ค้นหาชื่อแบบบ้าน, Project KeyID, KeyID แบบบ้าน...'
          className='flex-1 outline-none text-sm bg-transparent py-1.5'
        />
        <button
          onClick={handleSearchSubmit}
          className='inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors'
        >
          <Search className='w-4 h-4' />
          ค้นหา
        </button>
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value)
            setCurrentPage(1)
          }}
          className='px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-500'
        >
          <option value='ทั้งหมด'>ทุกสถานะ</option>
          <option value='ออนไลน์'>ออนไลน์</option>
          <option value='ออฟไลน์'>ออฟไลน์</option>
          <option value='ลบ'>ลบ</option>
        </select>
        <button
          onClick={fetchUnittypes}
          className='p-2 text-slate-400 hover:text-blue-600 transition-colors'
          title='รีเฟรช'
        >
          <RefreshCw className='w-4 h-4' />
        </button>
      </div>

      {/* Table */}
      <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-slate-100'>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                รูป
              </th>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                ชื่อแบบบ้าน
              </th>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                โครงการ
              </th>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                รายละเอียด
              </th>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                ราคาเริ่มต้น
              </th>
              <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                สถานะ
              </th>
              <th className='text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-50'>
            {isLoading ? (
              <tr>
                <td colSpan={7} className='text-center py-16'>
                  <Loader2 className='w-8 h-8 animate-spin text-blue-600 mx-auto' />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className='text-center py-16 text-red-600'>
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className='text-center py-16'>
                  <div className='flex flex-col items-center gap-3'>
                    <div className='w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center'>
                      <Home className='w-8 h-8 text-slate-300' />
                    </div>
                    <p className='text-slate-500 font-medium'>ไม่พบแบบบ้าน</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const d = row.data || {}
                const thumb = d.images?.main?.thumbnail || ''
                return (
                  <tr
                    key={row._id}
                    className='group hover:bg-blue-50/30 transition-colors'
                  >
                    <td className='px-6 py-3'>
                      <div className='w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60'>
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={d.info?.title_th || ''}
                            className='w-full h-full object-cover'
                            loading='lazy'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <ImageIcon className='w-5 h-5 text-slate-300' />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-3'>
                      <p className='text-sm font-semibold text-slate-800'>
                        {d.info?.title_th || d.info?.title_en || '-'}
                      </p>
                      <p className='text-[11px] text-slate-400 font-mono mt-0.5'>
                        {row.keyId || '-'}
                      </p>
                    </td>
                    <td className='px-6 py-3'>
                      <p className='text-sm text-slate-600'>
                        {d.project?.title_th || '-'}
                      </p>
                      <p className='text-[11px] text-slate-400 font-mono mt-0.5'>
                        {d.project?.project_keyId || d.project?.code || '-'}
                      </p>
                    </td>
                    <td className='px-6 py-3'>
                      <div className='flex items-center gap-3 text-xs text-slate-600'>
                        <span className='inline-flex items-center gap-1'>
                          <BedDouble className='w-3.5 h-3.5 text-slate-400' />
                          {d.detail?.num_bed ?? '-'}
                        </span>
                        <span className='inline-flex items-center gap-1'>
                          <Bath className='w-3.5 h-3.5 text-slate-400' />
                          {d.detail?.num_bath ?? '-'}
                        </span>
                        <span className='inline-flex items-center gap-1'>
                          <Maximize className='w-3.5 h-3.5 text-slate-400' />
                          {d.detail?.area_usable ?? '-'} ตร.ม.
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-3 text-sm font-semibold text-slate-800'>
                      {d.financial?.price_start
                        ? Number(d.financial.price_start).toLocaleString()
                        : '-'}
                    </td>
                    <td className='px-6 py-3'>
                      <PublishBadge published={d.published} />
                    </td>
                    <td className='px-6 py-3'>
                      <div className='flex items-center justify-center gap-1'>
                        <button
                          title='แก้ไข'
                          onClick={() => navigate(`/edit-unittype/${row._id}`)}
                          className='p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all'
                        >
                          <Pencil className='w-4 h-4' />
                        </button>
                        <button
                          title='ลบ'
                          disabled={deletingId === row._id}
                          onClick={() => handleDelete(row._id)}
                          className='p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-wait'
                        >
                          {deletingId === row._id ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                          ) : (
                            <Trash2 className='w-4 h-4' />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between px-6 py-4 border-t border-slate-100'>
            <p className='text-sm text-slate-500'>
              หน้า {page} จาก {totalPages}
            </p>
            <div className='flex gap-2'>
              <button
                disabled={!hasPrevPage}
                onClick={() => setCurrentPage((p) => p - 1)}
                className='px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'
              >
                ก่อนหน้า
              </button>
              <button
                disabled={!hasNextPage}
                onClick={() => setCurrentPage((p) => p + 1)}
                className='px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
