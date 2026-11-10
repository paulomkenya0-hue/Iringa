import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { ROLES, type AppRole } from '@/types/navigation';

interface HeaderProps {
  pageTitle: string;
  userRole: AppRole;
  userName: string;
  onMenuClick: () => void;
  onSignOut: () => void;
}

export default function Header({ pageTitle, userRole, userName, onMenuClick, onSignOut }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center px-4 lg:px-6 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-600 hover:text-gray-900 flex-shrink-0"
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold text-gray-900 truncate flex-1">{pageTitle}</h1>

      <div className="hidden md:flex items-center relative">
        <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Tafuta..."
          className="pl-9 pr-3 py-2 w-56 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ccm-green-500 focus:border-transparent focus:bg-white transition-all"
        />
      </div>

      <button className="relative text-gray-600 hover:text-gray-900 flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ccm-gold-500 rounded-full ring-2 ring-white" />
      </button>

      {/* User menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ccm-green-600 to-ccm-green-800 text-white flex items-center justify-center text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{userName}</p>
            <p className="text-xs text-gray-500 truncate max-w-[120px]">{ROLES[userRole].label}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{ROLES[userRole].label}</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
              >
                <UserIcon size={15} /> Wasifu Wangu
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50 text-left"
              >
                <LogOut size={15} /> Toka Mfumoni
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
