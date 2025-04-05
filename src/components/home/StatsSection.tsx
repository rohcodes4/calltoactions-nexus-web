
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';

const StatsSection = () => {
  return (
    <section className="py-20 bg-agency-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: 120, label: "Projects Completed", suffix: "+" },
            { number: 45, label: "Happy Clients", suffix: "+" },
            { number: 10, label: "Years Experience", suffix: "+" },
            { number: 18, label: "Industry Awards", suffix: "" },
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <AnimatedCounter endValue={stat.number} suffix={stat.suffix} />
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
