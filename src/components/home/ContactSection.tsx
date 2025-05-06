
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { submitContactForm } from '@/services/databaseService';
import { useQuery } from '@tanstack/react-query';
import { fetchGeneralSettings } from '@/services/databaseService';
import { Card } from '@/components/ui/card';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import CalendlyPopup from '../CalendlyPopup';

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const { toast } = useToast();
  
  const { data: settings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await submitContactForm({ name, email, message });
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us! We'll get back to you soon."
      });
      // Clear form inputs
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="contact" className="py-20 bg-agency-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to take your digital presence to the next level? Reach out to our team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="glass-card p-8 col-span-1">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-agency-purple/20 p-3 rounded-lg">
                  <Phone className="text-agency-purple h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <p className="text-gray-400">{settings?.phoneNumber || '+1 (555) 123-4567'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-agency-purple/20 p-3 rounded-lg">
                  <Mail className="text-agency-purple h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-gray-400">{settings?.adminEmail || 'hello@agency.com'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-agency-purple/20 p-3 rounded-lg">
                  <MapPin className="text-agency-purple h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Office</h3>
                  <p className="text-gray-400">{settings?.address || '123 Agency Street, Digital City, DC 10001'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-agency-purple/20 p-3 rounded-lg">
                  <Calendar className="text-agency-purple h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Book a Call</h3>
                  <Button 
                    variant="link" 
                    className="text-agency-purple p-0 h-auto font-semibold hover:text-agency-blue"
                    onClick={() => setShowCalendly(true)}
                  >
                    Schedule a consultation
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="glass-card p-8 col-span-1 lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Your Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Message</label>
                <textarea 
                  rows={6} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  required
                ></textarea>
              </div>
              <div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : "Send Message"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Calendly Popup */}
      <CalendlyPopup isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
    </section>
  );
};

export default ContactSection;
