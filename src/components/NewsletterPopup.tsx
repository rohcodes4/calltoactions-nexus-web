
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { subscribeToNewsletter } from '@/services/databaseService';
import { motion, AnimatePresence } from 'framer-motion';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has closed the popup before
    const hasClosedPopup = localStorage.getItem('newsletter_popup_closed');
    
    if (!hasClosedPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Save to localStorage that user has closed the popup
    localStorage.setItem('newsletter_popup_closed', 'true');
    
    // Reset the flag after 7 days so the popup can show again
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    localStorage.setItem('newsletter_popup_expiry', expiry.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await subscribeToNewsletter(email, name);
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!"
      });
      
      // Close popup and mark as submitted
      setIsOpen(false);
      localStorage.setItem('newsletter_popup_subscribed', 'true');
      
      // Reset form
      setName('');
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-full max-w-md"
          >
            <Card className="glass-card relative overflow-hidden">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agency-purple to-agency-blue"></div>
              
              <div className="p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Join Our Newsletter</h2>
                  <p className="text-gray-400">
                    Stay updated with our latest projects, insights, and offers. 
                    We promise not to spam your inbox!
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Name (Optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Email*</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : "Subscribe Now"}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
