import * as React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ className, children }) => {
  return (
    <header className={cn('flex h-16 items-center justify-between border-b bg-white px-6', className)}>
      <Logo />

      <div className="flex items-center space-x-4">
        {children}
      </div>
    </header>
  );
};

export { Header };