
import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendlyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendlyPopup = ({ isOpen, onClose }: CalendlyPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => {
            // Close when clicking outside the modal
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-full max-w-2xl max-h-[90vh] relative bg-agency-darker rounded-lg shadow-xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agency-purple to-agency-blue"></div>
            
            <div className="h-[80vh] overflow-hidden">
              {/* Replace with your Calendly embed link */}
              <iframe
                src="https://calendly.com/your-calendly-link"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule a Call"
                className="rounded-b-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalendlyPopup;
