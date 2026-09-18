import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'ivory' | 'white' | 'muted';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'white',
  border = true,
}) => {
  const bgStyles = {
    white: 'bg-white',
    ivory: 'bg-[#FAF9F6]',
    muted: 'bg-[#F4F2EB]',
  };

  return (
    <div
      className={`rounded-[2px] ${border ? 'border border-ivory-300' : ''} ${
        bgStyles[variant]
      } p-6 text-graphite-900 ${className}`}
    >
      {children}
    </div>
  );
};
