import { useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore, useUIStore } from '@/lib/store';

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ className, children }) => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-semeru-800 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        <div className="flex h-16 items-center justify-between px-6">
          <Logo className="text-white" />
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 hover:bg-semeru-700 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
          {children}
        </nav>

        {/* Logout Section */}
        <div className="border-t border-semeru-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-red-300 transition-colors hover:bg-semeru-700 hover:text-red-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </>
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
        isActive && 'bg-semeru-700 font-medium',
        className
      )}
    >
      {icon && <span className="h-5 w-5">{icon}</span>}
      <span className="text-sm">{label}</span>
    </button>
  );
};

export { Sidebar, SidebarItem };