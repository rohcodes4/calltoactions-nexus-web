
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
