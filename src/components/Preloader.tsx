
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Add a small delay to ensure smooth transition
      setTimeout(() => setLoading(false), 800);
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      
      // Also set a maximum waiting time (4 seconds)
      const timeout = setTimeout(() => setLoading(false), 4000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-agency-darker"
        >
          <div className="relative flex flex-col items-center">
            {/* Main circular loader */}
            <motion.div 
              className="relative w-24 h-24 mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {/* Outer ring gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-agency-purple via-agency-blue to-agency-teal opacity-30 blur-sm"></div>
              
              {/* Inner ring with gradient */}
              <motion.div 
                className="absolute inset-1 rounded-full border-4 border-transparent"
                style={{
                  backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #7928CA, #00bfff, #4CC9F0)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                }}
                animate={{ 
                  boxShadow: ["0 0 10px rgba(121, 40, 202, 0.5)", "0 0 25px rgba(0, 191, 255, 0.8)", "0 0 10px rgba(121, 40, 202, 0.5)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Center dot */}
              <motion.div 
                className="absolute inset-0 m-auto w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Rotating ball */}
              <motion.div 
                className="absolute w-5 h-5 rounded-full bg-agency-purple"
                style={{ top: 0, left: "calc(50% - 10px)", transformOrigin: "center 48px" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Dots loading indicator */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity, 
                    delay: index * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Text with gradient */}
            <motion.div
              className="relative text-xl font-medium text-gradient tracking-widest"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              LOADING
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
