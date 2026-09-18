import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral' | 'active' | 'warning' | 'danger' | 'success';
  className?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  size = 'md',
  dot = false,
}) => {
  const variantStyles = {
    primary: 'border border-cobalt-700 text-cobalt-700 bg-cobalt-100/50',
    secondary: 'border border-graphite-300 text-graphite-700 bg-ivory-100',
    neutral: 'border border-ivory-300 text-graphite-600 bg-ivory-100',
    active: 'border border-cobalt-700 text-white bg-cobalt-700',
    warning: 'border border-amber-500/50 text-amber-900 bg-amber-50',
    danger: 'border border-rose-400/60 text-rose-800 bg-rose-50',
    success: 'border border-emerald-500/50 text-emerald-800 bg-emerald-50',
  };

  const dotColors = {
    primary: 'bg-cobalt-700',
    secondary: 'bg-graphite-700',
    neutral: 'bg-graphite-400',
    active: 'bg-white',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    success: 'bg-emerald-600',
  };

  const sizeStyles = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-none shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
