import HeroSection from '@/components/HeroSection'
import DollyIntroSection from '@/components/DollyIntroSection'
import FeaturesGrid from '@/components/FeaturesGrid'
import TestimonialsSection from '@/components/TestimonialsSection'
import TrendingSection from '@/components/TrendingSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesGrid />
        <DollyIntroSection />
        <TrendingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
