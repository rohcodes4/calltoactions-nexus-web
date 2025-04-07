
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PortfolioItem from '@/components/PortfolioItem';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio, fetchGeneralSettings } from '@/services/databaseService';

const PortfolioSection = () => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.slice(0, 3).map((item) => (
                <PortfolioItem key={item.id} {...item} />
              ))}
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
          </>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
