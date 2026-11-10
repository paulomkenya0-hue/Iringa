import { Building2, X } from 'lucide-react';
import { NAV_ITEMS, APP_NAME, APP_FULL_NAME, APP_REGION, type UserRole } from '@/types/navigation';

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activePage, onNavigate, userRole, isOpen, onClose }: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-64 flex-shrink-0
          bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 flex-shrink-0">
          <div className="ccm-logo w-10 h-10 text-lg flex-shrink-0">
            <Building2 size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{APP_NAME}</p>
            <p className="text-xs text-gray-500 truncate">{APP_FULL_NAME}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menyu Kuu
          </p>
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`nav-link w-full ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <p className="text-xs text-gray-400">{APP_REGION}</p>
          <p className="text-xs text-gray-300 mt-0.5">v1.0.0 — Phase 1: Design</p>
        </div>
      </aside>
    </>
  );
}
