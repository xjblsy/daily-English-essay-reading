import { useState, useMemo } from 'react';
import type { Paper, PaperFilter } from '../types';
import { fallbackPapers } from '../data/mockPapers';
import PaperCard from '../components/papers/PaperCard';
import PaperFilters from '../components/papers/PaperFilters';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function PapersPage() {
  const [filter, setFilter] = useState<PaperFilter>({
    sources: ['arxiv', 'nature'],
    categories: ['ai', 'nlp', 'bigdata'],
    searchQuery: '',
  });

  const { isFavorited, toggleFavorite } = useFavorites();
  const { recordView } = useHistory();

  // 筛选逻辑
  const filteredPapers = useMemo(() => {
    return fallbackPapers.filter(paper => {
      if (!filter.sources.includes(paper.source)) return false;
      if (!filter.categories.includes(paper.category)) return false;
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        return (
          paper.title.toLowerCase().includes(q) ||
          paper.abstract.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PaperFilters filter={filter} onChange={setFilter} />

      <div className="mt-5">
        {filteredPapers.length === 0 ? (
          <EmptyState
            title="No papers found"
            description="Try adjusting your search or filters to find more results."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPapers.map(paper => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isFavorited={isFavorited(paper.id)}
                onToggleFavorite={() => toggleFavorite('paper', paper.id)}
                onView={() => recordView('paper', paper.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
