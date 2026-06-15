import { FileText, ArrowRight } from 'lucide-react';
import type { Paper } from '../../types';
import PaperCard from '../papers/PaperCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useHistory } from '../../hooks/useHistory';

interface TodayPapersProps {
  papers: Paper[];
}

export default function TodayPapers({ papers }: TodayPapersProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const { recordView } = useHistory();

  if (papers.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-red-500" />
          <h2 className="text-base font-semibold text-white">Today's Papers</h2>
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
            {papers.length}
          </span>
        </div>
        <a
          href="/papers"
          onClick={(e) => { e.preventDefault(); window.location.href = '/papers'; }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          View All <ArrowRight size={12} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {papers.map(paper => (
          <PaperCard
            key={paper.id}
            paper={paper}
            isFavorited={isFavorited(paper.id)}
            onToggleFavorite={() => toggleFavorite('paper', paper.id)}
            onView={() => recordView('paper', paper.id)}
          />
        ))}
      </div>
    </section>
  );
}
