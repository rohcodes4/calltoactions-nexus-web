
import { motion } from 'framer-motion';

const ClientLogos = () => {
  // Sample client logos - replace with actual client logos later
  const logos = [
    { name: "Microsoft", logo: "https://placehold.co/200x80/101932/white?text=Microsoft" },
    { name: "Adobe", logo: "https://placehold.co/200x80/101932/white?text=Adobe" },
    { name: "Google", logo: "https://placehold.co/200x80/101932/white?text=Google" },
    { name: "Amazon", logo: "https://placehold.co/200x80/101932/white?text=Amazon" },
    { name: "IBM", logo: "https://placehold.co/200x80/101932/white?text=IBM" },
    { name: "Apple", logo: "https://placehold.co/200x80/101932/white?text=Apple" },
    { name: "Facebook", logo: "https://placehold.co/200x80/101932/white?text=Facebook" },
    { name: "Twitter", logo: "https://placehold.co/200x80/101932/white?text=Twitter" },
    { name: "Intel", logo: "https://placehold.co/200x80/101932/white?text=Intel" },
    { name: "Samsung", logo: "https://placehold.co/200x80/101932/white?text=Samsung" },
    { name: "Oracle", logo: "https://placehold.co/200x80/101932/white?text=Oracle" },
    { name: "Tesla", logo: "https://placehold.co/200x80/101932/white?text=Tesla" },
    { name: "Uber", logo: "https://placehold.co/200x80/101932/white?text=Uber" },
    { name: "Airbnb", logo: "https://placehold.co/200x80/101932/white?text=Airbnb" },
    { name: "Netflix", logo: "https://placehold.co/200x80/101932/white?text=Netflix" },
    { name: "Spotify", logo: "https://placehold.co/200x80/101932/white?text=Spotify" },
    { name: "Slack", logo: "https://placehold.co/200x80/101932/white?text=Slack" },
    { name: "Zoom", logo: "https://placehold.co/200x80/101932/white?text=Zoom" },
    { name: "LinkedIn", logo: "https://placehold.co/200x80/101932/white?text=LinkedIn" },
    { name: "Dropbox", logo: "https://placehold.co/200x80/101932/white?text=Dropbox" },
  ];

  // Duplicate logos for infinite scroll effect
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-12 bg-agency-darker overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-center text-white mb-4">
          Trusted by <span className="text-gradient">Leading Brands</span>
        </h3>
      </div>
      
      <div className="relative">
        <motion.div 
          className="flex space-x-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear",
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div 
              key={`${logo.name}-${index}`} 
              className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <img 
                src={logo.logo} 
                alt={`${logo.name} logo`} 
                className="h-12 md:h-16 object-contain rounded grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientLogos;
