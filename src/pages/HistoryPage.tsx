import { useState } from 'react';
import { Clock, Trash2, FileText, Headphones, BookOpen } from 'lucide-react';
import { useHistoryStore } from '../stores/useHistoryStore';
import { formatRelativeTime } from '../utils/dateHelpers';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

type TabType = 'all' | 'papers' | 'videos' | 'readings';

const tabs = [
  { key: 'all' as TabType, label: 'All' },
  { key: 'papers' as TabType, label: 'Papers' },
  { key: 'videos' as TabType, label: 'Videos' },
  { key: 'readings' as TabType, label: 'Readings' },
];

const typeIcons: Record<string, React.ReactNode> = {
  paper: <FileText size={14} />,
  video: <Headphones size={14} />,
  reading: <BookOpen size={14} />,
};

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { history, clearHistory, getRecentHistory } = useHistoryStore();
  const recentHistory = getRecentHistory(50);

  const filteredHistory =
    activeTab === 'all'
      ? recentHistory
      : recentHistory.filter(h => h.itemType === activeTab.slice(0, -1));

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Browsing History
          </h2>
          <p className="text-sm text-slate-400">{history.length} records</p>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory}>
            <Trash2 size={14} />
            Clear History
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History list */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={<Clock size={28} />}
          title="No history yet"
          description="Your browsing history will appear here as you explore resources."
        />
      ) : (
        <div className="space-y-2">
          {filteredHistory.map(record => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-slate-500">
                  {typeIcons[record.itemType] || <Clock size={14} />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate capitalize">
                    {record.itemType} resource
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ID: {record.itemId.slice(0, 12)}...
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 text-xs text-slate-500 ml-4">
                {formatRelativeTime(record.viewedAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
