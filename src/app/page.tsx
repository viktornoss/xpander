import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import RobotVoiceShowcase from '@/components/home/RobotVoiceShowcase';
import ServicesGrid from '@/components/home/ServicesGrid';
import LiveChatbotSection from '@/components/home/LiveChatbotSection';
import ProcessSection from '@/components/home/ProcessSection';
import RoiCalculator from '@/components/home/RoiCalculator';
import PricingSection from '@/components/home/PricingSection';
import ContactSection from '@/components/home/ContactSection';
import FloatingChatWidget from '@/components/chat/FloatingChatWidget';
import ScrollAnimationProvider from '@/components/effects/ScrollAnimationProvider';

export default function HomePage() {
  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-black flex flex-col selection:bg-white selection:text-black">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <RobotVoiceShowcase />
          <ServicesGrid />
          <LiveChatbotSection />
          <ProcessSection />
          <RoiCalculator />
          <PricingSection />
          <ContactSection />
        </main>
        <Footer />
        <FloatingChatWidget />
      </div>
    </ScrollAnimationProvider>
  );
}
