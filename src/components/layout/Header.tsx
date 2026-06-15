import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export default function Header({ onMenuToggle, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          {title && (
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Daily Updated</span>
          </div>
        </div>
      </div>
    </header>
  );
}
