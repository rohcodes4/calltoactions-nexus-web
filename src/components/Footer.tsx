
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from 'lucide-react';
import ContactForm from './ContactForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-agency-darker pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-gradient">Let's Connect</h3>
            <ContactForm variant="footer" />
          </div>
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-bold text-gradient">CallToActions</span>
              </Link>
              <p className="text-gray-400 mb-6">
                We transform ideas into powerful digital experiences that captivate, engage, and convert.
              </p>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <Mail size={16} className="text-agency-purple mr-3" />
                  <a href="mailto:contact@calltoactions.com" className="text-gray-300 hover:text-white transition-colors">
                    contact@calltoactions.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-agency-purple mr-3" />
                  <a href="tel:+11234567890" className="text-gray-300 hover:text-white transition-colors">
                    +1 (123) 456-7890
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin size={16} className="text-agency-purple mr-3 mt-1" />
                  <span className="text-gray-300">
                    123 Creative Avenue, Suite 101<br />
                    Digital City, DC 10101
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-bold mb-4">Navigation</h4>
                <ul className="space-y-2">
                  {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
                    <li key={item}>
                      <Link 
                        to={`/${item === 'Home' ? '' : item.toLowerCase()}`}
                        className="text-gray-400 hover:text-white transition-colors flex items-center group"
                      >
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                          {item}
                        </span>
                        <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Services</h4>
                <ul className="space-y-2">
                  {[
                    'Web Design', 
                    'Web Development', 
                    'Video Production', 
                    'Graphic Design', 
                    'Digital Marketing'
                  ].map((item) => (
                    <li key={item}>
                      <Link 
                        to={`/services/${item.toLowerCase().replace(' ', '-')}`}
                        className="text-gray-400 hover:text-white transition-colors flex items-center group"
                      >
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                          {item}
                        </span>
                        <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-white font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {[
                  { Icon: Facebook, href: '#' },
                  { Icon: Twitter, href: '#' },
                  { Icon: Instagram, href: '#' },
                  { Icon: Linkedin, href: '#' },
                ].map(({ Icon, href }, index) => (
                  <a 
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-agency-purple/20 flex items-center justify-center transition-colors"
                  >
                    <Icon size={18} className="text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} CallToActions. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-gray-500 hover:text-white text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
