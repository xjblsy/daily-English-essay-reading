import type { Video } from '../types';
import { mockVideos } from '../data/mockVideos';
import VideoCard from '../components/listening/VideoCard';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';

export default function ListeningPage() {
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
          English Listening Practice
        </h2>
        <p className="text-sm text-slate-400">
          Curated video content from BBC Learning English, TED Talks, and Cambridge IELTS
        </p>
      </div>

      {/* Source filter bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', 'bbc', 'ted', 'ielts'].map(source => (
          <span
            key={source}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 hover:border-white/20 cursor-pointer transition-colors capitalize"
          >
            {source === 'all' ? 'All Sources' : source.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {mockVideos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            isFavorited={isFavorited(video.id)}
            onToggleFavorite={() => toggleFavorite('video', video.id)}
            onView={() => recordView('video', video.id)}
          />
        ))}
      </div>
    </div>
  );
}
