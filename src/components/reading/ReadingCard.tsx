import { Heart, ExternalLink, FileText, BookOpen, Globe, FileCode } from 'lucide-react';
import type { ReadingMaterial } from '../../types';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { SOURCE_LABELS, DIFFICULTY_LABELS } from '../../data/constants';

interface ReadingCardProps {
  reading: ReadingMaterial;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onView: () => void;
}

const sourceIcons: Record<string, React.ReactNode> = {
  'cambridge-ielts': <BookOpen size={16} />,
  'tech-blog': <Globe size={16} />,
  documentation: <FileCode size={16} />,
};

export default function ReadingCard({ reading, isFavorited, onToggleFavorite, onView }: ReadingCardProps) {
  return (
    <Card hoverable className="group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
          reading.source === 'cambridge-ielts' ? 'bg-blue-50 text-blue-600' :
          reading.source === 'tech-blog' ? 'bg-purple-50 text-purple-600' :
          'bg-emerald-50 text-emerald-600'
        }`}>
          {sourceIcons[reading.source] || <FileText size={16} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
              {reading.title}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
                isFavorited
                  ? 'text-red-500 bg-red-50 scale-110'
                  : 'text-slate-300 hover:text-red-400 hover:bg-red-50'
              }`}
            >
              <Heart size={15} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {reading.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={reading.source === 'cambridge-ielts' ? 'ielts' : reading.source === 'tech-blog' ? 'ted' : 'default'}>
              {SOURCE_LABELS[reading.source]}
            </Badge>
            <Badge variant={reading.difficulty}>{DIFFICULTY_LABELS[reading.difficulty]}</Badge>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
              {reading.wordCount.toLocaleString()} words
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 capitalize">{reading.category}</span>
            <Button
              size="sm"
              variant="primary"
              external
              href={reading.url}
            >
              <ExternalLink size={12} />
              Read
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
