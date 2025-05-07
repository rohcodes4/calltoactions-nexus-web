
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type ClientLogo = Tables<'client_logos'>;

const ClientLogos = () => {
  // Fetch client logos from database
  const { data: logos = [], isLoading } = useQuery({
    queryKey: ['clientLogos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('order');
      
      if (error) throw error;
      return data as ClientLogo[];
    }
  });

  // Fallback logos for when database is empty or loading
  const fallbackLogos = [
    { name: "Microsoft", logo: "https://placehold.co/200x80/101932/white?text=Microsoft" },
    { name: "Adobe", logo: "https://placehold.co/200x80/101932/white?text=Adobe" },
    { name: "Google", logo: "https://placehold.co/200x80/101932/white?text=Google" },
    { name: "Amazon", logo: "https://placehold.co/200x80/101932/white?text=Amazon" },
    { name: "IBM", logo: "https://placehold.co/200x80/101932/white?text=IBM" },
    { name: "Apple", logo: "https://placehold.co/200x80/101932/white?text=Apple" },
  ];

  // Use database logos if available, otherwise use fallback
  const displayLogos = logos.length > 0 ? 
    logos.map(logo => ({ name: logo.name, logo: logo.image_url })) : 
    fallbackLogos;

  // Triple logos for better infinite scroll effect
  const triplicatedLogos = [...displayLogos, ...displayLogos, ...displayLogos];

  return (
    <section className="py-12 bg-agency-darker overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-center text-white mb-4">
        Leading Brands <span className="text-gradient">Achieve More With Us</span>
        </h3>
      </div>
      
      <div className="relative">
        <motion.div 
          className="flex space-x-16 whitespace-nowrap"
          animate={{ 
            x: [0, -1 * ((displayLogos.length * 210) / 2)] 
          }}
          transition={{ 
            repeat: Infinity,
            repeatType: "loop",
            duration: 30, 
            ease: "linear",
          }}
        >
          {triplicatedLogos.map((logo, index) => (
            <div 
              key={`${logo.name}-${index}`} 
              className="flex items-center justify-center opacity-100 hover:opacity-100 transition-opacity duration-300"
            >
              <img 
                src={logo.logo} 
                alt={`${logo.name} logo`} 
                className="min-w-[150px] object-contain rounded hover:scale-110 transition-all duration-300 cursor-pointer"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientLogos;
