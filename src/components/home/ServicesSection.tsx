
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Monitor, Code } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/databaseService';
import { Service } from '@/lib/supabase';

const iconMap: Record<string, JSX.Element> = {
  "Monitor": <Monitor size={24} />,
  "Code": <Code size={24} />,
  "Video": <Monitor size={24} />,
  "PenTool": <Monitor size={24} />,
  "BarChart": <Monitor size={24} />,
  "FileText": <Monitor size={24} />
};

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

  return (
    <section id="services" className="py-20 bg-agency-darker">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our <span className="text-gradient">Services</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="md:col-span-2 glass-card p-8 rounded-lg bg-gradient-to-br from-agency-purple/10 to-agency-blue/5"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 mb-6 bg-agency-purple/20 rounded-2xl flex items-center justify-center">
                    <Monitor size={32} className="text-agency-purple" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Web Design & Development</h3>
                  <p className="text-gray-300 mb-6">
                    From stunning UX/UI designs to powerful backends, we create websites and web applications that captivate and convert.
                  </p>
                  <div className="mt-auto">
                    <Link to="/services/web-design" className="text-agency-purple font-medium flex items-center group">
                      <span>Learn More</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col glass-card p-8 rounded-lg bg-gradient-to-br from-agency-blue/10 to-agency-teal/5"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 mb-4 bg-agency-blue/20 rounded-xl flex items-center justify-center">
                  <Code size={24} className="text-agency-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Development</h3>
                <p className="text-gray-400 mb-4">
                  Robust, scalable applications built with cutting-edge technology.
                </p>
                <div className="mt-auto">
                  <Link to="/services/web-development" className="text-agency-blue font-medium flex items-center group">
                    <span>Explore</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {services.slice(0, 3).map((service, i) => (
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
                    link={`/services/${service.id}`}
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-agency-purple/30 text-white hover:bg-agency-purple/10 group"
              >
                <Link to="/services" className="flex items-center">
                  View All Services
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

export default ServicesSection;
