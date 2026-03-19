import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Database } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/profile', icon: LayoutDashboard },
    { name: 'Users', href: '#', icon: Users },
    { name: 'Data Management', href: '#', icon: Database },
    { name: 'Settings', href: '#', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 border-r border-slate-200 bg-white">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex justify-center items-center gap-2">
          {/* Logo mock */}
          <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs shadow-md">
            BA
          </div>
          Baania Admin
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Navigation</p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <item.icon
                className={`flex-shrink-0 mr-3 h-5 w-5 ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
           <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white opacity-10"></div>
           <p className="text-sm font-semibold relative z-10">Pro Plan Active</p>
           <p className="text-xs text-blue-100 mt-1 relative z-10">Manage billing options</p>
           <button className="mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors relative z-10">
             Upgrade
           </button>
        </div>
      </div>
    </div>
  );
}
