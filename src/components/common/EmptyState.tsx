import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
        {icon || <Inbox size={28} />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2 bg-amber-500 text-white text-sm font-medium rounded-full hover:bg-amber-600 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
