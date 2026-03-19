import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Bell, Search, Menu } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 transition-shadow hover:shadow-sm">
      <div className="flex items-center flex-1">
        <button className="text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden mr-4">
          <Menu className="h-6 w-6" />
        </button>
        <div className="max-w-md w-full lg:max-w-xs relative text-slate-400 focus-within:text-slate-600">
           <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
             <Search className="h-4 w-4" />
           </div>
           <input
             className="block w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:outline-none focus:text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
             placeholder="Search data..."
             type="search"
           />
        </div>
      </div>
      <div className="ml-4 flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
        
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-inner ring-2 ring-white outline outline-1 outline-slate-200">
            {user?.email?.[0].toUpperCase() || 'A'}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">{user?.email || 'Admin User'}</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
          
          <button 
            onClick={logout} 
            className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
