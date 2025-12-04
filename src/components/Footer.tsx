import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchServices } from '@/services/databaseService';
import { toSlug } from './home/ServicesSection';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: servicesData = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices
  });

  // console.log("servicesData",servicesData)
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
    <footer className="bg-agency-darker py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* First Section - About Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">About Us</h4>
            <p className="text-gray-400">
              We are a creative agency specializing in web design, development, and digital marketing.
            </p>
          </div>

          {/* Second Section - Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="text-gray-400">
            {servicesData?.map((service) => (
              <li className="mb-2">
              <Link to={`/services/${toSlug(service.title)}`} className="hover:text-agency-purple transition-colors">{service.title}</Link>
            </li>             
              ))}              
            </ul>
          </div>

          {/* Third Section - Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="text-gray-400">
              <li className="mb-2">
                <Link to="/" className="hover:text-agency-purple transition-colors">Home</Link>
              </li>
              {/* <li className="mb-2">
                <Link to="/about" className="hover:text-agency-purple transition-colors">About</Link>
              </li> */}
              <li className="mb-2">
                <Link to="/portfolio" className="hover:text-agency-purple transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-agency-purple transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Fourth Section - Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Growth Tips Inside</h4>
            <p className="text-gray-400 mb-4">
            Be the first to learn about innovative strategies and results-driven solutions that can transform your business.
            </p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-agency-dark rounded-l-md py-2 px-4 text-white focus:outline-none"
              />
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-agency-purple to-agency-blue rounded-l-none"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section - Copyright and CTA */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Rohcodes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
