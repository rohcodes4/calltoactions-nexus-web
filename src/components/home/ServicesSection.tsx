import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Monitor, Code, FileText, BarChart, PenTool, Video } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/databaseService';
import { Service } from '@/lib/supabase';
import CalendlyPopup from '../CalendlyPopup';
import { useState } from 'react';

// Updated icon map with all icons
const iconMap: Record<string, JSX.Element> = {
  "Monitor": <Monitor size={24} />,
  "Code": <Code size={24} />,
  "Video": <Video size={24} />,
  "PenTool": <PenTool size={24} />,
  "BarChart": <BarChart size={24} />,
  "FileText": <FileText size={24} />
};

// Service card background colors
const bgColors = [
  "from-purple-500/10 to-purple-700/5",
  "from-blue-500/10 to-blue-700/5",
  "from-green-500/10 to-green-700/5",
  "from-amber-500/10 to-amber-700/5",
  "from-pink-500/10 to-pink-700/5",
  "from-teal-500/10 to-teal-700/5",
  "from-red-500/10 to-red-700/5",
  "from-indigo-500/10 to-indigo-700/5"
];

// Service background images
const bgImages = [
  "/images/service-bg-web.jpg",
  "/images/service-bg-design.jpg",
  "/images/service-bg-marketing.jpg",
  "/images/service-bg-video.jpg",
  "/images/service-bg-social.jpg",
  "/images/service-bg-seo.jpg"
];

export function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-'); // replaces one or more spaces with a hyphen
}

const ServicesSection = () => {
  // Fetch services from database
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices
  });
  
  const serviceCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const [showCalendly, setShowCalendly] = useState(false);
  

  return (
    <section id="services" className="py-20 bg-agency-darker">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          
          What We Do to <span className="text-gradient">Grow Your Business</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We offer comprehensive creative solutions to help your brand stand out in the digital landscape.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {services.slice(0, 6).map((service, i) => (
                <motion.div 
                  key={service.id}
                  custom={i}
                  variants={serviceCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={iconMap[service.icon] || <Monitor size={24} />}
                    link={`/services/${toSlug(service.title)}`}
                    bgColor={bgColors[i % bgColors.length]}
                    bgImage={bgImages[i % bgImages.length]}
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all px-8"
              >
                <div onClick={()=>setShowCalendly(true)} className="flex items-center">
                  Book a Call with Us
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </div>
              </Button>
            </div>
          </>
        )}
      </div>
      <CalendlyPopup isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
    </section>
  );
};

export default ServicesSection;
