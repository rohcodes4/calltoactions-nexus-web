
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

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
                  123 Creative Avenue, Suite 101<br />
                  Digital City, DC 10101
                </>
              }
            />
            <ContactInfo 
              icon={<Phone size={24} />}
              title="Phone Number"
              details={
                <>
                  <a href="tel:+11234567890" className="hover:text-white transition-colors">
                    +1 (123) 456-7890
                  </a><br />
                  <a href="tel:+11234567891" className="hover:text-white transition-colors">
                    +1 (123) 456-7891
                  </a>
                </>
              }
            />
            <ContactInfo 
              icon={<Mail size={24} />}
              title="Email Address"
              details={
                <>
                  <a href="mailto:info@calltoactions.com" className="hover:text-white transition-colors">
                    info@calltoactions.com
                  </a><br />
                  <a href="mailto:support@calltoactions.com" className="hover:text-white transition-colors">
                    support@calltoactions.com
                  </a>
                </>
              }
            />
            <ContactInfo 
              icon={<Clock size={24} />}
              title="Working Hours"
              details={
                <>
                  Monday - Friday<br />
                  9:00 AM - 6:00 PM EST
                </>
              }
            />
          </div>
        </div>
      </section>
      
      {/* Contact Form and Map */}
      <section className="py-16 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="glass-card p-8 rounded-lg h-full">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="glass-card p-8 rounded-lg h-full">
                <h2 className="text-2xl font-bold text-white mb-6">Our Location</h2>
                <div className="aspect-square w-full bg-agency-purple/10 rounded-lg flex items-center justify-center text-agency-purple">
                  {/* This is a placeholder for a map */}
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-4" />
                    <p className="text-white">Interactive map will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
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
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all group"
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
