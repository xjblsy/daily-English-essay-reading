import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#faf8f5] rounded-xl p-5 transition-all duration-300
        ${hoverable
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10'
          : ''
        }
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
