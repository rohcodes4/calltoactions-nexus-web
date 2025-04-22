import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { fetchGeneralSettings, fetchSocialLinks, updateGeneralSettings, updateSocialLinks } from '@/services/databaseService';
import { GeneralSettings, SocialLinks } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const ContactInfo = ({ icon, title, details }: { icon: React.ReactNode, title: string, details: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 glass-card rounded-lg">
      <div className="w-12 h-12 bg-agency-purple/10 rounded-full flex items-center justify-center text-agency-purple mb-4">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <div className="text-gray-400">{details}</div>
    </div>
  );
};

const Contact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
      id: '',
      siteTitle: "TBD",
      siteTagline: "We Create Digital Experiences That Convert",
      adminEmail: "rohitparakh4@gmail.com",
      phoneNumber: "+1 (555) 123-4567",
      address: "123 Creative St, Digital City, 90210"
    });

     const [socialLinks, setSocialLinks] = useState<SocialLinks>({
        id: '',
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        youtube: ""
      });

       // Fetch general settings
  const { 
    data: settingsData, 
    isLoading: isLoadingSettings,
    error: settingsError,
    refetch: refetchSettings 
  } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: fetchGeneralSettings
  });

  // Fetch social links
  const { 
    data: socialData, 
    isLoading: isLoadingSocial,
    error: socialError,
    refetch: refetchSocial 
  } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: fetchSocialLinks
  });

  // Update settings when data is loaded
  useEffect(() => {
    if (settingsData) {
      setGeneralSettings(settingsData);
    }
  }, [settingsData]);

  useEffect(() => {
    if (socialData) {
      setSocialLinks(socialData);
    }
  }, [socialData]);

   // Create subscription mutation
    const createSubscription = useMutation({
      mutationFn: async (email: string) => {
        const { data, error } = await supabase
          .from('newsletter_subscriptions')
          .insert([
            {
              email,
              subscribed_at: new Date().toISOString(),
              status: 'active'
            }
          ])
          .select();
  
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['newsletter-subscriptions'] });
        toast({
          title: "Subscription Added",
          description: "You've been subscribed to our newsletter!"
        });
        setEmail('');
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error('Error adding subscription:', error);
        toast({
          title: "Subscription Failed",
          description: "Failed to add subscription. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!email || !email.includes('@')) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return;
      }
      
      setIsSubmitting(true);
      createSubscription.mutate(email);
    };
  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Have a project in mind? We'd love to hear about it. Reach out to us and let's create something amazing together.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactInfo 
              icon={<MapPin size={24} />}
              title="Our Location"
              details={
                <>
                  {generalSettings.address}
                </>
              }
            />
            <ContactInfo 
              icon={<Phone size={24} />}
              title="Phone Number"
              details={
                <>
                  <a href={`tel:${generalSettings.phoneNumber}`} className="hover:text-white transition-colors">
                  {generalSettings.phoneNumber}
                  </a><br />
                </>
              }
            />
            <ContactInfo 
              icon={<Mail size={24} />}
              title="Email Address"
              details={
                <>
                  <a href={`mailto:${generalSettings.adminEmail}`} className="hover:text-white transition-colors">
                  {generalSettings.adminEmail}
                  </a><br />
                </>
              }
            />
            <ContactInfo 
              icon={<Clock size={24} />}
              title="Working Hours"
              details={
                <>
                  Monday - Friday<br />
                  9:00 AM - 6:00 PM IST
                </>
              }
            />
          </div>
        </div>
      </section>
      
      {/* Contact Form and Map */}
      <section className="py-16 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="flex justify-center flex-col lg:flex-row gap-8">
            <div className="lg:w-full max-w-3xl">
              <div className="glass-card p-8 rounded-lg h-full">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
            {/* <div className="lg:w-1/2">
              <div className="glass-card p-8 rounded-lg h-full">
                <h2 className="text-2xl font-bold text-white mb-6">Our Location</h2>
                <div className="aspect-square w-full bg-agency-purple/10 rounded-lg flex items-center justify-center text-agency-purple">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-4" />
                    <p className="text-white">Interactive map will be displayed here</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Subscribe to Our <span className="text-gradient">Newsletter</span>
              </h2>
              <p className="text-gray-400">
                Stay updated with our latest news, insights, and special offers.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-white/5 border-white/10 focus:border-agency-purple flex-1"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all group"
                onClick={handleSubmit}
              >
                Subscribe
                <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Social Media */}
      <section className="py-16 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Connect With Us on <span className="text-gradient">Social Media</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow us for the latest updates, insights, and behind-the-scenes content.
            </p>
          </div>
          <div className="flex justify-center space-x-6">
            {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
              <a 
                key={platform}
                href={`https://www.${platform}.com`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white/5 hover:bg-agency-purple/20 rounded-full flex items-center justify-center transition-colors"
              >
                <img 
                  src={`/icons/${platform}.svg`} 
                  alt={platform} 
                  className="w-6 h-6" 
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
