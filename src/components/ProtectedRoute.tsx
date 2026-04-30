import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <div className='relative'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 border-t-4 border-t-transparent'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='h-8 w-8 rounded-full bg-blue-100'></div>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
