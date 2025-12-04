
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceBySlug } from '@/services/databaseService';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ContactForm';
import { motion } from 'framer-motion';
import { iconMap, parseBoldText } from '@/pages/Services';
import { useState } from 'react';
import CalendlyPopup from '@/components/CalendlyPopup';
import PortfolioSection from '@/components/home/PortfolioSection';

const ServiceDetail = () => {
  const [showCalendly, setShowCalendly] = useState(false); 
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchServiceBySlug(serviceId as string),
    enabled: !!serviceId,
  });

    if (isLoading) {
      return (
        <div className="min-h-screen bg-agency-dark pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
        </div>
      );
    }

  if (error || !service) {
    toast({
      title: "Error",
      description: "Service not found.",
      variant: "destructive",
    });
    
    return (
      <div className="min-h-screen bg-agency-dark pt-32 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-6">Service Not Found</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/services')}
          className="flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <motion.button
                onClick={() => navigate('/services')}
                className="flex items-center text-agency-purple mb-6 hover:text-agency-blue transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Services
              </motion.button>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {service.title}
              </motion.h1>
              
              <motion.p
                className="text-lg text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {service.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  onClick={() => {
                    // const contactSection = document.getElementById('contact');
                    // contactSection?.scrollIntoView({ behavior: 'smooth' });
                    setShowCalendly(true)
                  }}
                  className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                  size="lg"
                >
                  Book Call
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-agency-purple/30 to-agency-blue/30 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-agency-purple/50 to-agency-blue/50 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-agency-purple to-agency-blue shadow-lg shadow-purple-900/20 flex items-center justify-center">
                    <div className="text-white text-7xl">
                      {iconMap[service.icon] || iconMap['Monitor']}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Details Section */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">Overview</h2>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 whitespace-pre-wrap">{parseBoldText(service.details)}</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Key Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CheckCircle size={20} className="text-agency-purple mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <PortfolioSection category={service.title} featured={null}/>
      {/* CTA Section */}
      <section id="contact" className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 border border-white/5 shadow-xl shadow-purple-900/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-gray-400">
                Reach out to us to learn more about our {service.title} services.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <CalendlyPopup isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
    </div>
  );
};

export default ServiceDetail;
