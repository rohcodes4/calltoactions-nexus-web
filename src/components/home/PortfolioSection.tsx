
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import PortfolioItem from '@/components/PortfolioItem';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio, fetchGeneralSettings } from '@/services/databaseService';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const PortfolioSection = () => {
  // Fetch portfolio items from database
  const [filteredPortfolioItems, setFilteredPortfolioItems] = useState([]);
  const { data: portfolioItems = [], isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Filter featured items
  useEffect(() => {
    const filteredItems = portfolioItems.filter(item => item.featured === true);
    setFilteredPortfolioItems(filteredItems);
  }, [portfolioItems]);
  
  // Autoplay functionality
  useEffect(() => {
    if (filteredPortfolioItems.length > 0) {
      const startAutoplay = () => {
        autoplayRef.current = setInterval(() => {
          setCurrentSlide(prev => (prev + 1) % filteredPortfolioItems.length);
        }, 5000); // Change slide every 5 seconds
      };
      
      startAutoplay();
      
      // Cleanup on unmount
      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }
  }, [filteredPortfolioItems.length]);
  
  // Pause autoplay on hover
  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };
  
  const resumeAutoplay = () => {
    pauseAutoplay();
    autoplayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filteredPortfolioItems.length);
    }, 5000);
  };

  // Navigation functions
  const goToPrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? filteredPortfolioItems.length - 1 : prev - 1));
    pauseAutoplay();
    setTimeout(resumeAutoplay, 5000);
  };
  
  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredPortfolioItems.length);
    pauseAutoplay();
    setTimeout(resumeAutoplay, 5000);
  };

  // Fetch general settings
  const { data: settings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings
  });

  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <section className="py-20 bg-agency-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="text-gradient">Projects</span>
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
            <div 
              className="relative overflow-hidden"
              onMouseEnter={pauseAutoplay}
              onMouseLeave={resumeAutoplay}
            >
              {/* Navigation Arrows */}
              {filteredPortfolioItems.length > 1 && (
                <>
                  <Button
                    onClick={goToPrevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full"
                    size="icon"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <Button
                    onClick={goToNextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 rounded-full" 
                    size="icon"
                  >
                    <ArrowRight size={20} />
                  </Button>
                </>
              )}
              
              {/* Portfolio Slider */}
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-full md:w-5/6 lg:w-3/4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredPortfolioItems.length > 0 ? (
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="w-full px-4"
                    >
                      <PortfolioItem {...filteredPortfolioItems[currentSlide]} />
                    </motion.div>
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      No featured projects available.
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* Pagination Dots */}
              {filteredPortfolioItems.length > 1 && (
                <div className="flex justify-center mt-6">
                  {filteredPortfolioItems.map((_, index) => (
                    <button
                      key={index}
                      className={`mx-1 w-3 h-3 rounded-full transition-all ${
                        currentSlide === index ? 'bg-agency-purple scale-125' : 'bg-gray-600'
                      }`}
                      onClick={() => {
                        setCurrentSlide(index);
                        pauseAutoplay();
                        setTimeout(resumeAutoplay, 5000);
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
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
    </section>
  );
};

export default PortfolioSection;
