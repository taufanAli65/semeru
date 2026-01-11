import * as React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ className, children }) => {
  return (
    <div className={cn('flex h-full w-64 flex-col bg-semeru-800 text-white', className)}>
      <div className="flex h-16 items-center px-6">
        <Logo className="text-white" />
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {children}
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-semeru-700',
        isActive && 'bg-semeru-700',
        className
      )}
    >
      {icon && <span className="h-5 w-5">{icon}</span>}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export { Sidebar, SidebarItem };