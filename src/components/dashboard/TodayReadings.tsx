import { BookOpen, ArrowRight } from 'lucide-react';
import type { ReadingMaterial } from '../../types';
import ReadingCard from '../reading/ReadingCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useHistory } from '../../hooks/useHistory';

interface TodayReadingsProps {
  readings: ReadingMaterial[];
}

export default function TodayReadings({ readings }: TodayReadingsProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const { recordView } = useHistory();

  if (readings.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-blue-500" />
          <h2 className="text-base font-semibold text-white">Reading Materials</h2>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
            {readings.length}
          </span>
        </div>
        <a
          href="/reading"
          onClick={(e) => { e.preventDefault(); window.location.href = '/reading'; }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          View All <ArrowRight size={12} />
        </a>
      </div>

      <div className="space-y-3">
        {readings.map(reading => (
          <ReadingCard
            key={reading.id}
            reading={reading}
            isFavorited={isFavorited(reading.id)}
            onToggleFavorite={() => toggleFavorite('reading', reading.id)}
            onView={() => recordView('reading', reading.id)}
          />
        ))}
      </div>
    </section>
  );
}
