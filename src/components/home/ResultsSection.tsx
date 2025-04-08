
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ResultsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const results = [
    {
      icon: <TrendingUp size={32} className="text-agency-purple" />,
      title: "155% Growth",
      description: "Average increase in organic traffic for our clients within 6 months",
      color: "from-purple-500/20 to-purple-700/10"
    },
    {
      icon: <Users size={32} className="text-agency-blue" />,
      title: "89% Retention",
      description: "Client retention rate, reflecting our commitment to long-term partnerships",
      color: "from-blue-500/20 to-blue-700/10"
    },
    {
      icon: <BarChart3 size={32} className="text-agency-teal" />,
      title: "43% ROI",
      description: "Average return on investment for digital marketing campaigns",
      color: "from-teal-500/20 to-teal-700/10"
    },
    {
      icon: <Zap size={32} className="text-amber-500" />,
      title: "2.5x Conversion",
      description: "Average increase in conversion rates after website redesign",
      color: "from-amber-500/20 to-amber-700/10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-agency-darker" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real <span className="text-gradient">Results</span> for Real Businesses
          </motion.h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            We don't just promise results - we deliver them. Here's how our solutions have impacted businesses like yours.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {results.map((result, index) => (
            <motion.div 
              key={index}
              className={`glass-card p-6 rounded-lg bg-gradient-to-br ${result.color} hover:scale-105 transition-transform duration-300`}
              variants={itemVariants}
            >
              <div className="mb-4">
                {result.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{result.title}</h3>
              <p className="text-gray-400 text-sm">{result.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
