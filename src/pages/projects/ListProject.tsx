import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
  Image as ImageIcon,
  X,
  SlidersHorizontal,
  Loader2,
  RefreshCw
} from 'lucide-react'
import api from '../../lib/axios'

// ── Types ──────────────────────────────────────────────────────────────

interface ProjectRead {
  _id: string
  keyId: string
  data: {
    info?: { code?: string; title_th?: string; title_en?: string }
    property_type?: { title_th?: string; title_en?: string; id?: number }[]
    images?: { main?: { thumbnail?: string; url?: string } }
    general?: { status?: string }
    developer?: { display_name?: string }
    address?: { province_th?: string }
  }
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface Project {
  id: string
  code: string
  name: string
  type: string
  developer: string
  image: string
  province: string
  status: 'active' | 'inactive' | 'draft'
}

// ── Constants ──────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  'ทั้งหมด',
  'บ้านเดี่ยว',
  'คอนโดมิเนียม',
  'ทาวน์โฮม',
  'ที่ดิน'
]
const ITEMS_PER_PAGE = 20
const SEARCH_DEBOUNCE_MS = 400

// ── Helpers ────────────────────────────────────────────────────────────

function mapStatus(raw?: string): Project['status'] {
  if (!raw) return 'draft'
  const l = raw.toLowerCase()
  if (['active', 'เผยแพร่', 'publish'].includes(l)) return 'active'
  if (['inactive', 'ปิดใช้งาน'].includes(l)) return 'inactive'
  return 'draft'
}

function mapApiToProject(item: ProjectRead): Project {
  const d = item.data || {}
  return {
    id: item._id || item.keyId || '',
    code: item.keyId || d.info?.code || '-',
    name: d.info?.title_th || d.info?.title_en || '-',
    type: d.property_type?.[0]?.title_th || '-',
    developer: d.developer?.display_name || '-',
    image: d.images?.main?.thumbnail || d.images?.main?.url || '',
    province: d.address?.province_th || '-',
    status: mapStatus(d.general?.status)
  }
}

// ── Sub-components ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Project['status'] }) {
  const cfg = {
    active: {
      label: 'เผยแพร่',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500'
    },
    inactive: {
      label: 'ปิดใช้งาน',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500'
    },
    draft: {
      label: 'แบบร่าง',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      dot: 'bg-slate-400'
    }
  }
  const c = cfg[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

// ── Main Component ─────────────────────────────────────────────────────

export default function ListProject() {
  const navigate = useNavigate()

  // Server-side state
  const [projects, setProjects] = useState<Project[]>([])
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

  // Query params — these drive the API call
  const [searchInput, setSearchInput] = useState('') // what user types (instant)
  const [searchQuery, setSearchQuery] = useState('') // debounced value sent to API
  const [selectedType, setSelectedType] = useState('ทั้งหมด')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // ── Debounce search ──────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value)
      setCurrentPage(1)
    }, SEARCH_DEBOUNCE_MS)
  }

  // ── Fetch from API (server-side pagination + search + filter) ────────
  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: ITEMS_PER_PAGE
      }
      if (searchQuery.trim()) params.search = searchQuery.trim()
      if (selectedType !== 'ทั้งหมด') params.propertyType = selectedType

      const { data: res } = await api.get('/projectread/list', { params })

      const list: ProjectRead[] = res.data || []
      setProjects(list.map(mapApiToProject))
      setPagination(
        res.pagination || {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          total: list.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      )
    } catch (err: any) {
      console.error('Failed to fetch projects:', err)
      setError(
        err?.response?.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลได้'
      )
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery, selectedType])

  // Re-fetch whenever query params change
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // ── Derived ──────────────────────────────────────────────────────────
  const activeFilterCount = selectedType !== 'ทั้งหมด' ? 1 : 0

  const clearFilters = () => {
    setSelectedType('ทั้งหมด')
    setSearchInput('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบโครงการนี้ใช่หรือไม่?')) return
    try {
      await api.delete(`/projectread/delete/${id}`)
      fetchProjects() // re-fetch to stay in sync with server
    } catch (err: any) {
      alert(err?.response?.data?.message || 'ลบไม่สำเร็จ')
    }
  }

  // ── Pagination helpers ───────────────────────────────────────────────
  const { page, totalPages, total, hasNextPage, hasPrevPage } = pagination
  const startItem = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(page * ITEMS_PER_PAGE, total)

  const maxButtons = 5
  const pageNumbers: number[] = []
  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    let start = Math.max(1, page - Math.floor(maxButtons / 2))
    const end = Math.min(totalPages, start + maxButtons - 1)
    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1)
    for (let i = start; i <= end; i++) pageNumbers.push(i)
  }

  // ── Loading state ────────────────────────────────────────────────────
  if (isLoading && projects.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-32 gap-4'>
        <Loader2 className='w-10 h-10 text-blue-600 animate-spin' />
        <p className='text-slate-500 text-sm'>กำลังโหลดข้อมูลโครงการ...</p>
      </div>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────
  if (error && projects.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-32 gap-4'>
        <div className='w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center'>
          <X className='w-8 h-8 text-red-400' />
        </div>
        <p className='text-slate-700 font-medium'>เกิดข้อผิดพลาด</p>
        <p className='text-slate-500 text-sm'>{error}</p>
        <button
          onClick={fetchProjects}
          className='mt-2 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer'
        >
          <RefreshCw className='w-4 h-4' /> ลองใหม่
        </button>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
            รายการโครงการ
          </h1>
          <p className='text-slate-500 mt-1 text-sm'>
            จัดการข้อมูลโครงการทั้งหมด ({total.toLocaleString()} โครงการ)
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={fetchProjects}
            disabled={isLoading}
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50'
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />{' '}
            รีเฟรช
          </button>
          <button
            onClick={() => navigate('/create-project')}
            className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.97] cursor-pointer'
          >
            <Plus className='w-4 h-4' /> สร้างโครงการใหม่
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className='bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4'>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <input
              type='text'
              placeholder='ค้นหาชื่อโครงการ, รหัส, ผู้พัฒนา...'
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-slate-400'
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('')
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${showFilters || activeFilterCount > 0 ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <SlidersHorizontal className='w-4 h-4' /> ตัวกรอง
            {activeFilterCount > 0 && (
              <span className='bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold'>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100'>
            <div className='flex-1'>
              <label className='block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5'>
                <Filter className='w-3 h-3 inline mr-1' />
                ประเภทโครงการ
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {activeFilterCount > 0 && (
              <div className='flex items-end'>
                <button
                  onClick={clearFilters}
                  className='inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer'
                >
                  <X className='w-3.5 h-3.5' /> ล้างตัวกรอง
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className='bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative'>
        {/* Inline loading overlay */}
        {isLoading && projects.length > 0 && (
          <div className='absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center'>
            <Loader2 className='w-8 h-8 text-blue-600 animate-spin' />
          </div>
        )}

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-slate-100'>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                  รูปภาพ
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                  รหัส
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                  ชื่อโครงการ
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                  ประเภท
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4'>
                  ผู้พัฒนา
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
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className='text-center py-16'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center'>
                        <Building2 className='w-8 h-8 text-slate-300' />
                      </div>
                      <p className='text-slate-500 font-medium'>ไม่พบโครงการ</p>
                      <p className='text-slate-400 text-sm mt-1'>
                        ลองเปลี่ยนคำค้นหาหรือตัวกรอง
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className='group hover:bg-blue-50/30 transition-colors duration-150'
                  >
                    <td className='px-6 py-3'>
                      <div className='w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shadow-sm group-hover:shadow-md transition-shadow'>
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
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
                      <span className='inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-mono font-semibold tracking-wide'>
                        {project.code}
                      </span>
                    </td>
                    <td className='px-6 py-3'>
                      <p className='text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors'>
                        {project.name}
                      </p>
                      <p className='text-xs text-slate-400 mt-0.5'>
                        {project.province}
                      </p>
                    </td>
                    <td className='px-6 py-3'>
                      <span className='inline-flex items-center gap-1.5 text-sm text-slate-600'>
                        <Building2 className='w-3.5 h-3.5 text-slate-400' />
                        {project.type}
                      </span>
                    </td>
                    <td className='px-6 py-3'>
                      <span className='inline-flex items-center gap-1.5 text-sm text-slate-600'>
                        <Home className='w-3.5 h-3.5 text-slate-400' />
                        {project.developer}
                      </span>
                    </td>
                    <td className='px-6 py-3'>
                      <StatusBadge status={project.status} />
                    </td>
                    <td className='px-6 py-3'>
                      <div className='flex items-center justify-center gap-1'>
                        <button
                          title='ดูรายละเอียด'
                          className='p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer'
                        >
                          <Eye className='w-4 h-4' />
                        </button>
                        <button
                          title='แก้ไข'
                          onClick={() => navigate(`/edit-project/${project.id}`)}
                          className='p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer'
                        >
                          <Pencil className='w-4 h-4' />
                        </button>
                        <button
                          title='ลบ'
                          onClick={() => handleDelete(project.id)}
                          className='p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50'>
            <p className='text-xs text-slate-500'>
              แสดง{' '}
              <span className='font-semibold text-slate-700'>
                {startItem.toLocaleString()}
              </span>{' '}
              –{' '}
              <span className='font-semibold text-slate-700'>
                {endItem.toLocaleString()}
              </span>{' '}
              จาก{' '}
              <span className='font-semibold text-slate-700'>
                {total.toLocaleString()}
              </span>{' '}
              โครงการ
            </p>
            <div className='flex items-center gap-1'>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrevPage}
                className='p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
              {pageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className='w-9 h-9 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all cursor-pointer'
                  >
                    1
                  </button>
                  {pageNumbers[0] > 2 && (
                    <span className='text-slate-400 text-sm px-1'>…</span>
                  )}
                </>
              )}
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${p === page ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'}`}
                >
                  {p}
                </button>
              ))}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className='text-slate-400 text-sm px-1'>…</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className='w-9 h-9 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all cursor-pointer'
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={!hasNextPage}
                className='p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer'
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
