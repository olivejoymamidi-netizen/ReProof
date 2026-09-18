import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'graphite' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold uppercase tracking-wider rounded-[2px] transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none';

  const variantStyles = {
    primary:
      'bg-cobalt-700 hover:bg-cobalt-900 text-[#FAF9F6] border border-cobalt-700 focus:ring-1 focus:ring-cobalt-700',
    secondary:
      'bg-transparent hover:bg-graphite-900 text-graphite-900 hover:text-[#FAF9F6] border border-graphite-900',
    graphite:
      'bg-graphite-900 hover:bg-cobalt-700 text-white border border-graphite-900 hover:border-cobalt-700',
    outline:
      'bg-transparent hover:bg-ivory-200 text-graphite-800 border border-ivory-300 hover:border-graphite-700',
    ghost:
      'bg-transparent hover:bg-ivory-200 text-graphite-700 hover:text-graphite-900',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-3 py-1.5 gap-1.5 font-mono',
    md: 'text-xs px-4 py-2.5 gap-2 font-mono',
    lg: 'text-xs sm:text-sm px-6 py-3.5 gap-3 font-sans font-bold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
