
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Monitor, Code, Video, PenTool, BarChart, ArrowRight, CheckCircle, ChevronsRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ServiceCard';
import ContactForm from '@/components/ContactForm';
import { fetchServices } from '@/services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { toSlug } from '@/components/home/ServicesSection';

// Icon mapping for service icons
export const iconMap: Record<string, JSX.Element> = {
  "Monitor": <Monitor size={24} />,
  "Code": <Code size={24} />,
  "Video": <Video size={24} />,
  "PenTool": <PenTool size={24} />,
  "BarChart": <BarChart size={24} />,
  "Search": <Search size={24} />
};

export const parseBoldText = (text: any) => {
   // Split on number + dot + space (lookahead to preserve delimiter)
   const sections = text.split(/(?=\d+\.\s)/g);

   return sections.map((section, sectionIndex) => {
     // Inside each section, split to parse bold parts
     const parts = section.split(/(\*\*[^*]+\*\*)/g);
 
     return (
       <div key={sectionIndex} style={{ marginTop: '1rem' }}>
         {parts.map((part, partIndex) => {
           if (part.startsWith('**') && part.endsWith('**')) {
             return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
           }
           return <span key={partIndex}>{part}</span>;
         })}
       </div>
     );
   });
};

const Services = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Fetch services from the database
  const { data: servicesData = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices
  });
  console.log("servicesData")
  console.log(servicesData)

  // If error, show toast
  if (error) {
    toast({
      title: "Error loading services",
      description: "Could not load service information. Please try again later.",
      variant: "destructive"
    });
  }

  // Fallback to static data if no services in database
  const services = servicesData.length > 0 ? servicesData : [
    {
      id: "web-design",
      title: "Web Design",
      description: "Stunning, conversion-focused websites that captivate your audience and reflect your brand identity.",
      icon: "Monitor",
      details: "Our web design process focuses on creating visually appealing, user-friendly interfaces that drive engagement and conversions. We combine aesthetics with functionality to deliver websites that not only look great but also perform exceptionally well.",
      benefits: [
        "Custom design tailored to your brand",
        "Responsive layouts for all devices",
        "User experience (UX) optimization",
        "Conversion-focused design elements",
        "Brand consistency across all pages"
      ]
    },
    {
      id: "web-development",
      title: "Web Development",
      description: "Robust, scalable web applications built with cutting-edge technologies for optimal performance.",
      icon: "Code",
      details: "We build powerful web applications using the latest technologies and best practices. Our development team creates scalable, secure, and high-performance websites that provide seamless user experiences.",
      benefits: [
        "Clean, efficient code structure",
        "Optimized performance and loading speed",
        "Secure development practices",
        "Custom functionality and features",
        "Seamless integration with third-party services"
      ]
    },
    {
      id: "video-production",
      title: "Video Production",
      description: "Compelling video content that tells your story and engages viewers across all platforms.",
      icon: "Video",
      details: "From concept to final cut, we create video content that captivates your audience and communicates your message effectively. Our video production services cover everything from promotional videos to corporate presentations.",
      benefits: [
        "Professional scriptwriting and storyboarding",
        "High-quality filming and equipment",
        "Expert editing and post-production",
        "Animation and special effects",
        "Optimized for various platforms and devices"
      ]
    },
    {
      id: "graphic-design",
      title: "Graphic Design",
      description: "Eye-catching visual assets that strengthen your brand and communicate your message effectively.",
      icon: "PenTool",
      details: "Our graphic design services help you create a strong visual identity that resonates with your target audience. From logos to marketing materials, we design assets that make your brand memorable and impactful.",
      benefits: [
        "Professional logo and brand identity design",
        "Print and digital marketing materials",
        "Packaging and product design",
        "Infographics and data visualization",
        "Social media graphics and templates"
      ]
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      description: "Strategic campaigns that increase your visibility, drive traffic, and convert leads into customers.",
      icon: "BarChart",
      details: "We develop comprehensive digital marketing strategies that help you reach your target audience, increase brand awareness, and drive conversions. Our data-driven approach ensures optimal ROI for your marketing investments.",
      benefits: [
        "Search engine optimization (SEO)",
        "Pay-per-click (PPC) advertising",
        "Social media marketing and management",
        "Email marketing campaigns",
        "Analytics and performance tracking"
      ]
    }
  ];


  const handleSectionInView = (id: string) => {
    setActiveSection(id);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  

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
              Our <span className="text-gradient">Services</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              We offer comprehensive creative solutions to help your brand thrive in the digital landscape. Our team of experts is committed to delivering exceptional results that exceed your expectations.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {services.map((service) => (
                <a 
                  key={service.id} 
                  href={`/services/${toSlug(service.title)}`} 
                  className={`
                    inline-flex items-center px-4 py-2 rounded-full transition-colors duration-300
                    ${activeSection === service.id 
                      ? 'bg-gradient-to-r from-agency-purple to-agency-blue text-white' 
                      : 'bg-white/5 hover:bg-agency-purple/10 text-white'}
                  `}
                >
                  {iconMap[service.icon] && <span className="mr-2">{iconMap[service.icon]}</span>}
                  {service.title}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Services List */}
      <motion.section 
        className="py-16 bg-agency-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { 
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.5 }
                    }
                  }}
                >
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={iconMap[service.icon] || <Monitor size={24} />}
                    link={`/services/${toSlug(service.title)}`}
                    bgImage={service.gallery}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
      
      {/* Individual Service Sections */}
      <AnimatePresence>
        {services.map((service) => (
          <motion.section 
            id={service.id} 
            key={service.id} 
            className="py-20 bg-agency-darker scroll-mt-32"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            onViewportEnter={() => handleSectionInView(service.id)}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/2">
                  <div className="mb-6 flex items-center">
                    <div className="w-12 h-12 bg-agency-purple/10 rounded-lg flex items-center justify-center text-agency-purple mr-4">
                      {iconMap[service.icon] || <Monitor size={24} />}
                    </div>
                    <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                  </div>
                  <p className="text-gray-300 mb-6">
                    {parseBoldText(service.details)}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {service.benefits.map((benefit, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle size={18} className="text-agency-purple mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Link to={`/services/${toSlug(service.title)}`}>
                    <Button 
                      className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all group shadow-lg shadow-purple-900/20"
                    >
                      Learn More About {service.title}
                      <ChevronsRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                    </Button>
                  </Link>
                </div>
                <motion.div 
                  className="lg:w-1/2 h-max glass-card p-6 rounded-lg border border-white/5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-center bg-cover aspect-video w-full bg-gradient-to-br from-agency-purple/20 to-agency-blue/20 rounded-lg flex items-center justify-center overflow-hidden group"
                    style={{ backgroundImage: `url("${service.gallery}")` }}
                  >
                    <motion.div 
                      className="text-6xl text-agency-purple/30 transform transition-transform duration-700 ease-in-out"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {iconMap[service.icon] || <Monitor size={96} />}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
      
      {/* Call to Action */}
      <motion.section 
        className="py-20 bg-agency-dark"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 border border-white/5 shadow-xl shadow-purple-900/10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to <span className="text-gradient">Get Started?</span>
              </h2>
              <p className="text-gray-400">
                Contact us today to discuss your project and how we can help bring your vision to life.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
