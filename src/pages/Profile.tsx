import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Mail, Database, Key } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-slate-50">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.email || 'Admin User'}</h2>
              <p className="text-sm font-medium text-indigo-600 flex items-center mt-1">
                <ShieldCheck className="w-4 h-4 mr-1" />
                Administrator
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-6 sm:px-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Security Information</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email address
              </dt>
              <dd className="mt-2 text-sm text-slate-900 font-medium">{user?.email}</dd>
            </div>
            <div className="sm:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Key className="w-4 h-4 mr-2" /> Role
              </dt>
              <dd className="mt-2 text-sm text-slate-900 font-semibold text-indigo-700 bg-indigo-50 inline-block px-2 py-0.5 rounded">Admin</dd>
            </div>
            <div className="sm:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Database className="w-4 h-4 mr-2" /> Data Access Scope
              </dt>
              <dd className="mt-2 text-sm text-slate-600 leading-relaxed">
                You have full access to all system options, data integrations, and billing management. 
                Please ensure you log out when accessing from a public device.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
