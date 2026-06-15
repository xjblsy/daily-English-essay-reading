import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg active:scale-[0.97]',
  secondary:
    'bg-white/10 text-slate-200 border border-white/20 hover:bg-white/15 hover:border-white/30',
  ghost:
    'text-slate-400 hover:text-white hover:bg-white/5',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-full',
  md: 'px-5 py-2 text-sm rounded-full',
  lg: 'px-7 py-2.5 text-base rounded-full',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  onClick,
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium
    transition-all duration-200 select-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `;

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={baseClasses}
      >
        {loading && <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin" />}
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {loading && <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin" />}
      {children}
    </button>
  );
}
