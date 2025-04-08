
import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import StatsSection from '@/components/home/StatsSection';
import ContactSection from '@/components/home/ContactSection';
import ResultsSection from '@/components/home/ResultsSection';
import FAQSection from '@/components/home/FAQSection';
import ProcessSection from '@/components/home/ProcessSection';
import ClientLogos from '@/components/home/ClientLogos';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark">
      <HeroSection />
      <ClientLogos />
      <ServicesSection />
      <ResultsSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <StatsSection />
      <FAQSection />
      <ContactSection />
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button 
              onClick={scrollToTop}
              className="rounded-full w-12 h-12 bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
            >
              <ArrowUp size={20} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
