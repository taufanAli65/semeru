import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingFooter } from '@/features/landing/components/LandingFooter';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <LandingNavbar />
      
      <HeroSection />

      {/* Bagian Features bisa ditambahkan di sini secara modular nantinya */}
      {/* <FeatureSection /> */}
      
      <LandingFooter />
    </main>
  );
}