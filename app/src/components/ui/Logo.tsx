import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('rounded-lg bg-primary flex items-center justify-center', sizeClasses[size])}>
        <span className="text-primary-foreground font-bold text-sm">S</span>
      </div>
      <span className="font-semibold text-lg">Semeru</span>
    </div>
  );
};

export { Logo };