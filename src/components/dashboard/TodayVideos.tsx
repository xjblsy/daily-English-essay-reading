import { Headphones, ArrowRight } from 'lucide-react';
import type { Video } from '../../types';
import VideoCard from '../listening/VideoCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useHistory } from '../../hooks/useHistory';

interface TodayVideosProps {
  videos: Video[];
}

export default function TodayVideos({ videos }: TodayVideosProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const { recordView } = useHistory();

  if (videos.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Headphones size={18} className="text-green-500" />
          <h2 className="text-base font-semibold text-white">Listening Practice</h2>
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
            {videos.length}
          </span>
        </div>
        <a
          href="/listening"
          onClick={(e) => { e.preventDefault(); window.location.href = '/listening'; }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          View All <ArrowRight size={12} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            isFavorited={isFavorited(video.id)}
            onToggleFavorite={() => toggleFavorite('video', video.id)}
            onView={() => recordView('video', video.id)}
          />
        ))}
      </div>
    </section>
  );
}
