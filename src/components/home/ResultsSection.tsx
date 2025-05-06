
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import AnimatedCounter from '../AnimatedCounter';

const ResultsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const results = [
    {
      icon: <TrendingUp size={32} className="text-agency-purple" />,
      title: "155%",
      suffix: "%",
      value: 155,
      description: "Average increase in organic traffic for our clients within 6 months",
      color: "from-purple-500/20 to-purple-700/10"
    },
    {
      icon: <Users size={32} className="text-agency-blue" />,
      title: "89%",
      suffix: "%",
      value: 89,
      description: "Client retention rate, reflecting our commitment to long-term partnerships",
      color: "from-blue-500/20 to-blue-700/10"
    },
    {
      icon: <BarChart3 size={32} className="text-agency-teal" />,
      title: "43%",
      suffix: "%",
      value: 43,
      description: "Average return on investment for digital marketing campaigns",
      color: "from-teal-500/20 to-teal-700/10"
    },
    {
      icon: <Zap size={32} className="text-amber-500" />,
      title: "2.5x",
      suffix: "x",
      value: 2.5,
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
    <section className="py-20 bg-agency-darker relative" ref={sectionRef}>
      {/* Chart-like line that rises up */}
      <div className="absolute left-0 right-0 bottom-0 top-0 pointer-events-none overflow-hidden">
        <svg className="absolute left-1/2 transform -translate-x-1/2 h-full w-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M0,500 Q250,300 500,250 T1000,100"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
              <stop offset="100%" stopColor="rgba(79, 70, 229, 0.3)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

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
              <AnimatedCounter endValue={result.value} suffix={result.suffix} />
              <p className="text-gray-400 text-sm">{result.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
