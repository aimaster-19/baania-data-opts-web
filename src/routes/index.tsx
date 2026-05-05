import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import CreateProject from '../pages/projects/CreateProject'
import ListProject from '../pages/projects/ListProject'
import UpdateProject from '../pages/projects/UpdateProject'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/' element={<Navigate to='/profile' replace />} />
          <Route path='/projects' element={<ListProject />} />
          <Route path='/create-project' element={<CreateProject />} />
          <Route path='/edit-project/:id' element={<UpdateProject />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  )
}
