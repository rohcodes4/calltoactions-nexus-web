
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Search, 
  PenTool, 
  Code, 
  Rocket, 
  BarChart3
} from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ProcessSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const processes = [
    {
      icon: <Lightbulb size={24} className="text-agency-purple" />,
      title: "Strategy",
      description: "We start by understanding your goals and developing a tailored strategy.",
      step: "01"
    },
    {
      icon: <Search size={24} className="text-agency-purple" />,
      title: "Research",
      description: "Deep market research to identify opportunities and audience needs.",
      step: "02"
    },
    {
      icon: <PenTool size={24} className="text-agency-purple" />,
      title: "Design",
      description: "Creative design solutions that align with your brand identity.",
      step: "03"
    },
    {
      icon: <Code size={24} className="text-agency-purple" />,
      title: "Development",
      description: "Building robust digital solutions with cutting-edge technology.",
      step: "04"
    },
    {
      icon: <Rocket size={24} className="text-agency-purple" />,
      title: "Launch",
      description: "Careful deployment and testing to ensure flawless execution.",
      step: "05"
    },
    {
      icon: <BarChart3 size={24} className="text-agency-purple" />,
      title: "Optimization",
      description: "Continuous improvement based on performance analytics.",
      step: "06"
    }
  ];

  return (
    <section className="py-20 bg-agency-dark" id="process" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            Our <span className="text-gradient">Process</span>
          </motion.h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            A systematic approach to delivering exceptional results for your business
          </motion.p>
        </div>
        
        {/* Hexagonal Process Flow */}
        <div className="relative">
          {/* Connecting Lines */}
          <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1200 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M200,225 L400,120 L600,225 L800,120 L1000,225" 
                stroke="url(#lineGradient)" 
                strokeWidth="3" 
                strokeDasharray="10,5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7928CA" />
                  <stop offset="100%" stopColor="#FF0080" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 relative z-10">
            {processes.map((process, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="glass-card p-6 rounded-lg relative border border-white/5 group hover:border-agency-purple/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(121,40,202,0.3)]"
              >
                {/* Pulsing effect around the step number */}
                <div className="absolute -top-3 -right-3">
                  <div className="relative">
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-agency-purple to-agency-blue opacity-70"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 0, 0.7]
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 3,
                        delay: index * 0.5
                      }}
                    />
                    <div className="bg-gradient-to-r from-agency-purple to-agency-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10">
                      {process.step}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-agency-purple/10 flex items-center justify-center mr-3 group-hover:bg-agency-purple/20 transition-colors duration-300">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, 0, -10, 0],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 5,
                        delay: index * 0.2
                      }}
                    >
                      {process.icon}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{process.title}</h3>
                </div>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{process.description}</p>
                
                {/* Interactive hover element */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-agency-purple to-agency-blue scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
