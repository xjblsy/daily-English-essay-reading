import type { ReadingMaterial } from '../types';
import { mockReadings } from '../data/mockReadings';
import ReadingCard from '../components/reading/ReadingCard';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import EmptyState from '../components/common/EmptyState';

export default function ReadingPage() {
  const { isFavorited, toggleFavorite } = useFavorites();
  const { recordView } = useHistory();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-white mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          English Reading Practice
        </h2>
        <p className="text-sm text-slate-400">
          Cambridge IELTS reading materials and professional technical articles
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', 'ai', 'nlp', 'bigdata', 'general'].map(cat => (
          <span
            key={cat}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 hover:border-white/20 cursor-pointer transition-colors capitalize"
          >
            {cat === 'all' ? 'All Categories' : cat.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Reading list */}
      {mockReadings.length === 0 ? (
        <EmptyState
          title="No reading materials available"
          description="Check back later for new content."
        />
      ) : (
        <div className="space-y-3">
          {mockReadings.map(reading => (
            <ReadingCard
              key={reading.id}
              reading={reading}
              isFavorited={isFavorited(reading.id)}
              onToggleFavorite={() => toggleFavorite('reading', reading.id)}
              onView={() => recordView('reading', reading.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
