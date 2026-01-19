import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { useUIStore } from '@/lib/store';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ className, children }) => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className={cn('flex h-16 items-center justify-between border-b bg-white px-4 md:px-6', className)}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Mobile Logo (optional, or rely on sidebar logo) */}
        <div className="md:hidden">
          <Logo />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {children}
      </div>
    </header>
  );
};

export { Header };