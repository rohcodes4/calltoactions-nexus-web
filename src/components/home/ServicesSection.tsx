import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Monitor, Code, FileText, BarChart, PenTool, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/services/databaseService';
import { Service } from '@/lib/supabase';
import CalendlyPopup from '../CalendlyPopup';
import { useState } from 'react';

// Updated icon map with all icons
const iconMap: Record<string, JSX.Element> = {
  "Monitor": <Monitor size={32} />,
  "Code": <Code size={32} />,
  "Video": <Video size={32} />,
  "PenTool": <PenTool size={32} />,
  "BarChart": <BarChart size={32} />,
  "FileText": <FileText size={32} />
};

// Accent colors for each service card
const accentColors = [
  { glow: '#8b5cf6', border: 'border-violet-500/20', icon: 'text-violet-400', gradient: 'from-violet-500/10 via-violet-500/5' },
  { glow: '#3b82f6', border: 'border-blue-500/20', icon: 'text-blue-400', gradient: 'from-blue-500/10 via-blue-500/5' },
  { glow: '#10b981', border: 'border-emerald-500/20', icon: 'text-emerald-400', gradient: 'from-emerald-500/10 via-emerald-500/5' },
  { glow: '#f59e0b', border: 'border-amber-500/20', icon: 'text-amber-400', gradient: 'from-amber-500/10 via-amber-500/5' },
  { glow: '#ec4899', border: 'border-pink-500/20', icon: 'text-pink-400', gradient: 'from-pink-500/10 via-pink-500/5' },
  { glow: '#14b8a6', border: 'border-teal-500/20', icon: 'text-teal-400', gradient: 'from-teal-500/10 via-teal-500/5' }
];

export function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

interface ModernServiceCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
  accentColor: typeof accentColors[0];
  index: number;
}

// Content-aware background components for each service type
const WebDevBackground = ({ accentColor }: { accentColor: typeof accentColors[0] }) => (
  <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
    {/* Animated code brackets */}
    <motion.div
      className="absolute top-8 left-8 text-4xl font-mono opacity-40 group-hover:opacity-70 transition-opacity duration-500"
      style={{ color: accentColor.glow }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {'</>'}
    </motion.div>
    
    {/* Browser window mockup */}
    <motion.div
      className={`absolute top-1/4 right-8 w-40 h-28 border ${accentColor.border} rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-500`}
      animate={{
        y: [0, -10, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className={`h-3 bg-gradient-to-r ${accentColor.gradient} to-transparent rounded-t-lg border-b ${accentColor.border}`} />
      <div className="grid grid-cols-2 gap-2 p-3">
        {[...Array(4)].map((_, j) => (
          <div key={j} className="h-2 bg-zinc-700/50 rounded" />
        ))}
      </div>
    </motion.div>

    {/* Floating code lines */}
    <motion.div
      className="absolute bottom-1/4 left-1/4 font-mono text-xs opacity-30 group-hover:opacity-60 transition-opacity duration-500"
      style={{ color: accentColor.glow }}
      animate={{
        x: [0, 10, 0],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      function() &#123;
    </motion.div>
  </div>
);

const DesignBackground = ({ accentColor }: { accentColor: typeof accentColors[0] }) => (
  <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
    {/* Rotating circle */}
    <motion.div
      className={`absolute top-8 right-12 w-20 h-20 border-2 ${accentColor.border} rounded-full group-hover:border-4 transition-all duration-500`}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    
    {/* Square */}
    <motion.div
      className={`absolute bottom-12 left-12 w-16 h-16 border-2 ${accentColor.border} rounded-lg group-hover:border-4 group-hover:scale-110 transition-all duration-500`}
      animate={{
        rotate: [0, 90, 0],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Triangle */}
    <motion.div
      className="absolute top-1/2 right-1/4 w-0 h-0 group-hover:scale-125 transition-transform duration-500"
      style={{
        borderLeft: '25px solid transparent',
        borderRight: '25px solid transparent',
        borderBottom: `40px solid ${accentColor.glow}40`,
      }}
      animate={{
        rotate: [0, 120, 240, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "linear",
      }}
    />

    {/* Small circles */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-3 h-3 rounded-full group-hover:w-4 group-hover:h-4 transition-all duration-500`}
        style={{
          background: accentColor.glow,
          top: `${30 + i * 20}%`,
          left: `${40 + i * 10}%`,
        }}
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.3,
        }}
      />
    ))}
  </div>
);

const VideoBackground = ({ accentColor }: { accentColor: typeof accentColors[0] }) => (
  <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
    {/* Film strip pattern */}
    <div className="absolute inset-0 flex justify-around opacity-40 group-hover:opacity-60 transition-opacity duration-500">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-full bg-gradient-to-b ${accentColor.gradient} to-transparent group-hover:w-3 transition-all duration-500`}
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>

    {/* Large play button */}
    <motion.div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 ${accentColor.border} rounded-full flex items-center justify-center group-hover:w-24 group-hover:h-24 group-hover:border-4 transition-all duration-500`}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div 
        className="w-0 h-0 ml-1 group-hover:ml-2 transition-all duration-500"
        style={{
          borderTop: '12px solid transparent',
          borderBottom: '12px solid transparent',
          borderLeft: `20px solid ${accentColor.glow}`,
        }}
      />
    </motion.div>

    {/* Film frames */}
    {[...Array(2)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-16 h-12 border ${accentColor.border} rounded group-hover:scale-110 transition-transform duration-500`}
        style={{
          top: `${20 + i * 50}%`,
          right: `${15}%`,
        }}
        animate={{
          x: [0, -10, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3 + i,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        }}
      />
    ))}
  </div>
);

const AnalyticsBackground = ({ accentColor }: { accentColor: typeof accentColors[0] }) => (
  <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
    {/* Bar chart */}
    <div className="absolute bottom-8 left-8 flex items-end gap-2 h-32">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-6 bg-gradient-to-t ${accentColor.gradient} to-transparent rounded-t group-hover:w-7 transition-all duration-500`}
          style={{
            height: `${40 + (i % 3) * 20}%`,
          }}
          animate={{
            scaleY: [1, 1.3, 0.9, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>

    {/* Trend line */}
    <svg className="absolute top-8 right-8 w-32 h-24 group-hover:scale-110 transition-transform duration-500">
      <motion.path
        d="M 5 60 Q 30 20, 60 35 T 120 25"
        stroke={accentColor.glow}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>

    {/* Percentage symbol */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
      style={{ color: accentColor.glow }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      %
    </motion.div>
  </div>
);

const MarketingBackground = ({ accentColor }: { accentColor: typeof accentColors[0] }) => (
  <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
    {/* Expanding ripples */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 ${accentColor.border} rounded-full group-hover:border-4 transition-all duration-300`}
        initial={{ width: 0, height: 0, opacity: 0.6 }}
        animate={{
          width: ['0px', '200px'],
          height: ['0px', '200px'],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 1.3,
          ease: "easeOut",
        }}
      />
    ))}

    {/* Megaphone icon */}
    <motion.div
      className="absolute top-8 right-12 opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500"
      animate={{
        rotate: [0, 10, 0, -10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div 
        className="w-0 h-0"
        style={{
          borderTop: '15px solid transparent',
          borderBottom: '15px solid transparent',
          borderLeft: `30px solid ${accentColor.glow}`,
        }}
      />
    </motion.div>

    {/* Message bubbles */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`bubble-${i}`}
        className={`absolute w-14 h-10 border-2 ${accentColor.border} rounded-2xl group-hover:border-4 group-hover:scale-110 transition-all duration-500`}
        style={{
          top: `${25 + i * 20}%`,
          left: `${15 + i * 15}%`,
        }}
        animate={{
          y: [0, -12, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.4,
        }}
      >
        {/* Bubble tail */}
        <div 
          className={`absolute -bottom-1 left-3 w-0 h-0`}
          style={{
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `6px solid ${accentColor.glow}40`,
          }}
        />
      </motion.div>
    ))}
  </div>
);

const ContentBackground = ({ accentColor }: { accentColor: typeof accentColors[0] }) => (
  <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
    {/* Document lines */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute h-0.5 rounded-full group-hover:h-1 transition-all duration-500`}
        style={{
          width: `${50 + (i % 3) * 15}%`,
          top: `${15 + i * 13}%`,
          left: '15%',
          background: `linear-gradient(to right, ${accentColor.glow}60, transparent)`,
        }}
        animate={{
          scaleX: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3 + i * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.2,
        }}
      />
    ))}

    {/* Pen icon */}
    <motion.div
      className="absolute bottom-12 right-12 opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500"
      animate={{
        rotate: [0, -15, 0],
        x: [0, 5, 0],
        y: [0, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div 
        className="w-1 h-12 rounded-full"
        style={{ background: accentColor.glow }}
      />
      <div 
        className="w-0 h-0 mx-auto"
        style={{
          borderLeft: '3px solid transparent',
          borderRight: '3px solid transparent',
          borderTop: `8px solid ${accentColor.glow}`,
        }}
      />
    </motion.div>

    {/* Cursor */}
    <motion.div
      className={`absolute w-4 h-4 rounded-full group-hover:w-5 group-hover:h-5 transition-all duration-500`}
      style={{ background: accentColor.glow }}
      animate={{
        x: [50, 150, 50],
        y: [40, 100, 40],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

// Map service titles to background components
const getServiceBackground = (title: string, accentColor: typeof accentColors[0]) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('web design')) {
    return <WebDevBackground accentColor={accentColor} />;
  } else if (titleLower.includes('video')) {
    return <VideoBackground accentColor={accentColor} />;
  } else if (titleLower.includes('digital marketing') || titleLower.includes('marketing')) {
    return <MarketingBackground accentColor={accentColor} />;
  } else if (titleLower.includes('seo')) {
    return <AnalyticsBackground accentColor={accentColor} />;
  } else if (titleLower.includes('graphic design') || titleLower.includes('design')) {
    return <DesignBackground accentColor={accentColor} />;
  } else if (titleLower.includes('web development') || titleLower.includes('development')) {
    return <WebDevBackground accentColor={accentColor} />;
  } else if (titleLower.includes('content') || titleLower.includes('writing') || titleLower.includes('copy')) {
    return <ContentBackground accentColor={accentColor} />;
  }
  
  // Default fallback
  return <DesignBackground accentColor={accentColor} />;
};

const ModernServiceCard = ({ title, description, icon, link, accentColor, index }: ModernServiceCardProps) => {
  return (
    <Link to={link} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        viewport={{ once: true }}
        className="relative h-full"
      >
        {/* Card Container */}
        <div className="relative h-full bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 rounded-2xl p-8 border border-zinc-800/50 overflow-hidden transition-all duration-500 hover:border-zinc-700/50 hover:-translate-y-1 hover:shadow-2xl">
          
          {/* Content-Aware Animated Background */}
          {getServiceBackground(title, accentColor)}
          
          {/* Gradient Accent Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${accentColor.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          {/* Animated Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Glow Effect on Hover */}
          <div 
            className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
            style={{ 
              background: `radial-gradient(circle at 50% 0%, ${accentColor.glow}30, transparent 70%)` 
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            
            {/* Icon Container */}
            <div className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-br ${accentColor.gradient} to-zinc-900/50 flex items-center justify-center border ${accentColor.border} group-hover:scale-110 transition-all duration-500`}>
              <div className={`${accentColor.icon} group-hover:scale-110 transition-transform duration-500`}>
                {icon}
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300">
              {title}
            </h3>
            
            {/* Description */}
            <p className="text-zinc-400 leading-relaxed mb-6 flex-grow group-hover:text-zinc-300 transition-colors duration-300">
              {description}
            </p>
            
            {/* Learn More Link */}
            <div className="flex items-center text-sm font-medium text-zinc-500 group-hover:text-white transition-colors duration-300">
              <span>Learn more</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
          
          {/* Decorative Grid Pattern */}
          <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <pattern id={`grid-${index}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white"/>
              </pattern>
              <rect width="100" height="100" fill={`url(#grid-${index})`}/>
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const ServicesSection = () => {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices
  });

  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <section id="services" className="py-20 bg-agency-darker relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}/>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            What We Do to <span className="text-gradient">Grow Your Business</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            We offer comprehensive creative solutions to help your brand stand out in the digital landscape.
          </motion.p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
              {services.slice(0, 6).map((service, i) => (
                <ModernServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={iconMap[service.icon] || <Monitor size={32} />}
                  link={`/services/${toSlug(service.title)}`}
                  accentColor={accentColors[i % accentColors.length]}
                  index={i}
                />
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <Button 
                onClick={() => setShowCalendly(true)}
                size="lg" 
                className="group relative bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all px-8 py-6 text-lg font-medium overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Book a Call with Us
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </motion.div>
          </>
        )}
      </div>
      <CalendlyPopup isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
    </section>
  );
};

export default ServicesSection;