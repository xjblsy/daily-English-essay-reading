import { useState } from 'react';
import { Heart, ExternalLink, Play, Clock, Star } from 'lucide-react';
import type { Video } from '../../types';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface VideoCardProps {
  video: Video;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onView: () => void;
}

const difficultyStars: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export default function VideoCard({ video, isFavorited, onToggleFavorite, onView }: VideoCardProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <Card hoverable className="overflow-hidden relative group">
      {/* Thumbnail / Player area */}
      <div className="relative -mx-5 -mt-5 mb-4 aspect-video bg-slate-900 overflow-hidden">
        {!showPlayer ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <button
                onClick={() => setShowPlayer(true)}
                className="w-14 h-14 rounded-full bg-amber-500/90 flex items-center justify-center hover:bg-amber-500 hover:scale-110 transition-all duration-200 shadow-lg shadow-amber-500/30"
              >
                <Play size={24} className="text-white ml-0.5" fill="white" />
              </button>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <Badge variant={video.source}>
                {video.source === 'bbc' ? 'BBC' : video.source === 'ted' ? 'TED' : 'IELTS'}
              </Badge>
              <span className="px-2 py-0.5 rounded bg-black/60 text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                <Clock size={10} />
                {video.durationMinutes}m
              </span>
            </div>
          </>
        ) : (
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        )}
      </div>

      <div className="px-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 flex-1 group-hover:text-amber-700 transition-colors">
            {video.title}
          </h3>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
              isFavorited
                ? 'text-red-500 bg-red-50 scale-110'
                : 'text-slate-300 hover:text-red-400 hover:bg-red-50'
            }`}
          >
            <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {video.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < difficultyStars[video.difficulty]
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                }
              />
            ))}
            <span className="text-xs text-slate-400 ml-1 capitalize">{video.difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              external
              href={video.originalUrl}
            >
              <ExternalLink size={12} />
              Original
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
