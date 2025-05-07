
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import PortfolioItem from '@/components/PortfolioItem';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio, fetchGeneralSettings } from '@/services/databaseService';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import CalendlyPopup from '../CalendlyPopup';
import { Portfolio } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PortfolioSection = () => {
  const [filteredPortfolioItems, setFilteredPortfolioItems] = useState<Portfolio[]>([]);
  const [showCalendly, setShowCalendly] = useState(false);
  const isMobile = useIsMobile();
  
  // Fetch portfolio items from database
  const { data: portfolioItems = [], isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio
  });

  // Fetch general settings
  const { data: settings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings
  });

  // Filter featured items and sort by order field
  useEffect(() => {
    // First try to get featured items
    let filteredItems = portfolioItems.filter(item => item.featured === true);
    
    // If no featured items, use all items
    if (filteredItems.length === 0) {
      filteredItems = [...portfolioItems];
    }
    
    // Sort items by order field if available
    filteredItems.sort((a, b) => {
      const orderA = a.order !== null ? a.order : 1000;
      const orderB = b.order !== null ? b.order : 1000;
      return orderA - orderB;
    });
    
    setFilteredPortfolioItems(filteredItems);
  }, [portfolioItems]);

  return (
    <section className="py-20 bg-agency-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="text-gradient">Success Stories</span> That Speak for Themselves
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {settings ? `Explore our latest work at ${settings.siteTitle} and see how we've helped brands achieve their goals.` : 'Explore our latest work and see how we\'ve helped brands achieve their goals.'}
          </p>
        </div>
        
        {isLoadingPortfolio ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
          </div>
        ) : (
          <>
            <div className="relative">
              {filteredPortfolioItems.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                      autoPlay: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {filteredPortfolioItems.map((item, index) => (
                        <CarouselItem key={item.id} className={`pl-4 ${isMobile ? 'basis-full' : 'basis-1/3'}`}>
                          <PortfolioItem {...item} defaultHovered={isMobile} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="hidden md:flex">
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </div>
                  </Carousel>
                </motion.div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  No featured projects available.
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-agency-purple/30 text-white hover:bg-agency-purple/10 group"
              >
                <Link to="/portfolio" className="flex items-center">
                  View All Projects
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </Button>
            </div>
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all px-8"
                onClick={() => setShowCalendly(true)}
              >
                <span className="flex items-center">
                  Book a Call
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </span>
              </Button>
            </div>
          </>
        )}
      </div>
      <CalendlyPopup isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
    </section>
  );
};

export default PortfolioSection;
