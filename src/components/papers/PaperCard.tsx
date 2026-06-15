import { Heart, ExternalLink, Clock } from 'lucide-react';
import type { Paper } from '../../types';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { SOURCE_COLORS } from '../../data/constants';
import { formatDate } from '../../utils/dateHelpers';

interface PaperCardProps {
  paper: Paper;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onView: () => void;
}

export default function PaperCard({ paper, isFavorited, onToggleFavorite, onView }: PaperCardProps) {
  return (
    <Card hoverable className="relative group">
      {/* NEW badge */}
      {paper.isTodayNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="new">NEW</Badge>
        </div>
      )}

      {/* Source color bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
        style={{ backgroundColor: SOURCE_COLORS[paper.source] || '#64748b' }}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
              {paper.title}
            </h3>
          </div>
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
          {paper.abstract}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={paper.source}>{paper.source === 'arxiv' ? 'arXiv' : 'Nature'}</Badge>
          <Badge variant="default">{paper.category.toUpperCase()}</Badge>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="truncate max-w-[180px]">{paper.authors.split(',')[0]} et al.</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(paper.publishedDate)}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onView(); }}
            external
            href={paper.url}
          >
            <ExternalLink size={12} />
            View
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Button({ children, size, variant, onClick, external, href }: { children: React.ReactNode; size?: string; variant?: string; onClick?: (e: React.MouseEvent) => void; external?: boolean; href?: string }) {
  const classes = `inline-flex items-center gap-1 ${variant === 'ghost' ? 'text-slate-500 hover:text-amber-600' : ''} ${size === 'sm' ? 'text-xs px-2 py-1 rounded-md' : ''} transition-colors`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }
  return <button onClick={onClick} className={classes}>{children}</button>;
}
