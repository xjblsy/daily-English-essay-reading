import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
};

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 size={sizeMap[size]} className="animate-spin text-amber-500" />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}
