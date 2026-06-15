import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Headphones,
  BookOpen,
  Heart,
  Clock,
  Settings,
  Activity,
  X,
} from 'lucide-react';
import { NAV_ITEMS } from '../../data/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  LayoutDashboard,
  FileText,
  Headphones,
  BookOpen,
  Heart,
  Clock,
  Settings,
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#0f172a] border-r border-white/10
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                EngLearn
              </h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">Academic English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-amber-400" />
                )}
                {Icon && <Icon size={18} />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-slate-600 text-center">
            Personal Learning Tool
          </p>
        </div>
      </aside>
    </>
  );
}
