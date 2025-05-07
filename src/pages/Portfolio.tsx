
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import PortfolioItem from '@/components/PortfolioItem';
import ContactForm from '@/components/ContactForm';
import { fetchPortfolio } from '@/services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';
import { Portfolio as PortfolioType } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const Portfolio = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  // Fetch portfolio data
  const { data: portfolioItems = [], isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio
  });
  
  const [filteredItems, setFilteredItems] = useState<PortfolioType[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Extract categories from portfolio items
  useEffect(() => {
    if (portfolioItems.length > 0) {
      const uniqueCategories = ['All', ...new Set(portfolioItems.map(item => item.category))];
      setCategories(uniqueCategories);
      setFilteredItems(portfolioItems.sort((a, b) => a.order - b.order));
      

    }
  }, [portfolioItems]);
  
  // Filter items when category changes
  const handleCategoryChange = (category: string) => {
    setIsAnimating(true);
    setActiveCategory(category);
    
    setTimeout(() => {
      if (category === "All") {
        setFilteredItems(portfolioItems);
      } else {
        setFilteredItems(portfolioItems.filter(item => item.category === category).sort((a, b) => a.order - b.order));
      }
      setIsAnimating(false);
    }, 300);
  };
  
  // Display error if fetching fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading portfolio",
        description: "Could not load portfolio items. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
      {/* Hero Section */}
      <motion.section 
        className="py-20 bg-agency-darker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our <span className="text-gradient">Portfolio</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Explore our latest work and see how we've helped brands achieve their goals through innovative digital solutions.
            </motion.p>
          </div>
        </div>
      </motion.section>
      
      {/* Filter Navigation */}
      <section className="py-8 bg-agency-dark sticky top-20 z-10 border-b border-white/5 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => handleCategoryChange(category)}
                className={`
                  ${activeCategory === category 
                    ? 'bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple shadow-lg shadow-agency-purple/20' 
                    : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-white'
                  }
                  transition-all duration-300
                `}
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Portfolio Grid */}
      <section className="py-16 bg-agency-dark">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PortfolioItem {...item} defaultHovered={isMobile} isMobile={isMobile} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">No projects found</h3>
              <p className="text-gray-400">
                No projects match the selected category. Please try another filter.
              </p>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <motion.section 
        className="py-20 bg-agency-darker"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 border border-white/5 shadow-xl shadow-purple-900/10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to <span className="text-gradient">Start Your Project?</span>
              </h2>
              <p className="text-gray-400">
                Let's discuss how we can help bring your vision to life.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Portfolio;
