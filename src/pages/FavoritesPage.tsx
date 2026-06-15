import { useState } from 'react';
import { FileText, Headphones, BookOpen, Heart, Trash2 } from 'lucide-react';
import { useFavoriteStore } from '../stores/useFavoriteStore';
import { fallbackPapers } from '../data/mockPapers';
import { mockVideos } from '../data/mockVideos';
import { mockReadings } from '../data/mockReadings';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

type TabType = 'all' | 'papers' | 'videos' | 'readings';

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Heart size={14} /> },
  { key: 'papers', label: 'Papers', icon: <FileText size={14} /> },
  { key: 'videos', label: 'Videos', icon: <Headphones size={14} /> },
  { key: 'readings', label: 'Readings', icon: <BookOpen size={14} /> },
];

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { favorites, removeFavorite, clearAll } = useFavoriteStore();

  // 获取收藏的完整数据
  const getFavoritedItems = () => {
    const items: { id: string; title: string; type: string; source: string; createdAt: string }[] = [];

    for (const fav of favorites) {
      let item;
      switch (fav.itemType) {
        case 'paper':
          item = fallbackPapers.find(p => p.id === fav.itemId);
          break;
        case 'video':
          item = mockVideos.find(v => v.id === fav.itemId);
          break;
        case 'reading':
          item = mockReadings.find(r => r.id === fav.itemId);
          break;
      }
      if (item) {
        items.push({
          id: fav.id,
          title: 'title' in item ? item.title : '',
          type: fav.itemType,
          source: 'source' in item ? String(item.source) : '',
          createdAt: fav.createdAt,
        });
      }
    }

    if (activeTab !== 'all') {
      return items.filter(item => item.type === activeTab.slice(0, -1)); // remove trailing 's'
    }
    return items;
  };

  const items = getFavoritedItems();

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            My Favorites
          </h2>
          <p className="text-sm text-slate-400">{favorites.length} saved resources</p>
        </div>
        {favorites.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 size={14} />
            Clear All
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} />}
          title="No favorites yet"
          description="Start exploring and save resources you want to revisit later."
        />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  item.type === 'paper' ? 'bg-red-400' :
                  item.type === 'video' ? 'bg-green-400' :
                  'bg-blue-400'
                }`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 capitalize mt-0.5">{item.type} &middot; {item.source}</p>
                </div>
              </div>
              <button
                onClick={() => removeFavorite(
                  favorites.find(f => f.id === item.id)?.itemId || ''
                )}
                className="flex-shrink-0 p-2 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
