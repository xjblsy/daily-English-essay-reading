import { format } from 'date-fns';
import { Sparkles } from 'lucide-react';

export default function WelcomeBanner() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = format(now, 'EEEE, MMMM d, yyyy');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 mb-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-amber-400" />
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Daily Learning</span>
        </div>
        <h1
          className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {greeting}, Researcher
        </h1>
        <p className="text-sm text-slate-400">{dateStr}</p>
      </div>
    </div>
  );
}
