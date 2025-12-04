import { useState, useEffect, useCallback, useRef } from 'react';
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
  const hasMountedRef = useRef(false);

  // Memoized handlers to prevent recreation
  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('newsletter_popup_closed', 'true');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await subscribeToNewsletter(email, name);
      toast({ title: "Success!", description: "Thank you for subscribing!" });
      setIsOpen(false);
      localStorage.setItem('newsletter_popup_subscribed', 'true');
      setName('');
      setEmail('');
    } catch (error: any) {
      // Handle duplicate subscription gracefully
      console.log(error)
      if (error?.code === '23505' || error?.message?.includes('newsletter_subscriptions_email_key')) {
        toast({ 
          title: "Already Subscribed!", 
          description: "You're already receiving our newsletter updates.",
          // No variant="destructive" = default success styling
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to subscribe",
          variant: "destructive"
        });
      }
      
      setIsOpen(false); // Close popup even on duplicate
      localStorage.setItem('newsletter_popup_subscribed', 'true');
      setName('');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, name, toast]);
  

  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    const hasClosed = localStorage.getItem('newsletter_popup_closed');
    if (!hasClosed) {
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // Fast fade, no spring
          style={{ backdropFilter: 'blur(4px)' }} // CSS filter instead of heavy animation
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }} // Simple tween, 60% faster
            className="w-full max-w-md"
          >
            <Card className="glass-card relative overflow-hidden">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agency-purple to-agency-blue" />
              
              <div className="p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Unlock Growth Insights</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Be the first to learn about innovative strategies. No spam!
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Name (Optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-agency-purple/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Email*</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-agency-purple/50 transition-colors"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        Subscribing...
                      </span>
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
