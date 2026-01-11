import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const LandingNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0d6e6e] rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">SEMERU</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-[#0d6e6e] transition-colors text-sm font-medium">
              Fitur
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-[#0d6e6e] transition-colors text-sm font-medium">
              Tentang
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#0d6e6e] hover:text-[#0a5555] hover:bg-gray-100 font-medium">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#0d6e6e] hover:bg-[#0a5555] text-white font-medium shadow-lg">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};