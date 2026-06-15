import type { PaperFilter } from '../../types';
import { SOURCE_LABELS, CATEGORY_LABELS } from '../../data/constants';

interface PaperFiltersProps {
  filter: PaperFilter;
  onChange: (filter: PaperFilter) => void;
}

const sources = ['arxiv', 'nature'] as const;
const categories = ['ai', 'nlp', 'bigdata'] as const;

export default function PaperFilters({ filter, onChange }: PaperFiltersProps) {
  const toggleSource = (source: 'arxiv' | 'nature') => {
    const newSources = filter.sources.includes(source)
      ? filter.sources.filter(s => s !== source)
      : [...filter.sources, source];
    onChange({ ...filter, sources: newSources.length ? newSources : sources as unknown as ('arxiv' | 'nature')[] });
  };

  const toggleCategory = (category: 'ai' | 'nlp' | 'bigdata') => {
    const newCategories = filter.categories.includes(category)
      ? filter.categories.filter(c => c !== category)
      : [...filter.categories, category];
    onChange({ ...filter, categories: newCategories.length ? newCategories : categories as unknown as ('ai' | 'nlp' | 'bigdata')[] });
  };

  return (
    <div className="space-y-4 p-5 bg-white/50 rounded-xl border border-white/60">
      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Search</label>
        <input
          type="text"
          placeholder="Search papers by title or keyword..."
          value={filter.searchQuery}
          onChange={e => onChange({ ...filter, searchQuery: e.target.value })}
          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
        />
      </div>

      {/* Source Filter */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Source</label>
        <div className="flex flex-wrap gap-2">
          {sources.map(source => (
            <button
              key={source}
              onClick={() => toggleSource(source)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter.sources.includes(source)
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {SOURCE_LABELS[source]}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Research Area</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter.categories.includes(cat)
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
