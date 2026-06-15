import type { ReactNode } from 'react';

type BadgeVariant = 'arxiv' | 'nature' | 'bbc' | 'ted' | 'ielts' | 'beginner' | 'intermediate' | 'advanced' | 'new' | 'default';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  arxiv: 'bg-red-50 text-red-700 border-red-200',
  nature: 'bg-blue-50 text-blue-700 border-blue-200',
  bbc: 'bg-green-50 text-green-700 border-green-200',
  ted: 'bg-purple-50 text-purple-700 border-purple-200',
  ielts: 'bg-orange-50 text-orange-700 border-orange-200',
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  advanced: 'bg-rose-50 text-rose-700 border-rose-200',
  new: 'bg-amber-100 text-amber-800 border-amber-300',
  default: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
