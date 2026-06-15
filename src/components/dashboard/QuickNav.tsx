import { useNavigate } from 'react-router-dom';
import { FileText, Headphones, BookOpen, Heart } from 'lucide-react';

const navItems = [
  { path: '/papers', label: 'Papers', icon: FileText, color: 'from-red-500 to-orange-500', desc: 'AI & NLP research' },
  { path: '/listening', label: 'Listening', icon: Headphones, color: 'from-green-500 to-emerald-500', desc: 'TED & BBC English' },
  { path: '/reading', label: 'Reading', icon: BookOpen, color: 'from-blue-500 to-indigo-500', desc: 'IELTS & Tech blogs' },
  { path: '/favorites', label: 'Favorites', icon: Heart, color: 'from-pink-500 to-rose-500', desc: 'Saved resources' },
];

export default function QuickNav() {
  const navigate = useNavigate();

  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold text-white mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
