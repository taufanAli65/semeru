import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const HeroSection = () => {
  return (
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gray-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Ekosistem Pendidikan
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Platform komprehensif untuk manajemen monitoring akademik dan 
                  penyelenggaraan kompetisi riset dalam satu pintu.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-[#0d6e6e] hover:bg-[#0a5555] text-white px-8 py-6 text-base font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Pelajari Lebih Lanjut
                    </Button>
                  </Link>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#0d6e6e] rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Monitoring Akademik</h3>
                      <p className="text-sm text-gray-500">Pantau perkembangan realtime</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#0d6e6e] rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Manajemen Kompetisi</h3>
                      <p className="text-sm text-gray-500">Kelola event & peserta</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Pattern Background */}
            <div className="w-full bg-[#0d6e6e] p-12 flex items-center justify-center relative overflow-hidden min-h-100 lg:min-h-150">
              {/* Geometric Pattern Background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-hero" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-hero)" />
                </svg>
              </div>
              
              {/* Logo */}
              <div className="relative z-10 text-center">
                <h2 className="text-white text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-4">
                  SEMERU
                </h2>
                <p className="text-white/80 text-lg md:text-xl tracking-wide">
                  Sistem Evaluasi Monitoring <br />
                  Edukasi & Riset Unggulan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};