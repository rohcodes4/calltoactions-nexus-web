
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowDown, 
  ArrowRight, 
  Monitor, 
  Code, 
  Video, 
  PenTool, 
  BarChart 
} from 'lucide-react';
import ThreeScene from '@/components/ThreeScene';
import ServiceCard from '@/components/ServiceCard';
import PortfolioItem from '@/components/PortfolioItem';
import ContactForm from '@/components/ContactForm';

// Sample portfolio data
const portfolioItems = [
  {
    id: "1",
    title: "Elegance Rebranding",
    category: "Graphic Design",
    imageUrl: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=800&auto=format&fit=crop",
    description: "Complete rebranding project for a luxury brand, including logo design, color palette, and brand guidelines.",
    link: "",
  },
  {
    id: "2",
    title: "Tech Innovators Website",
    category: "Web Development",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
    description: "Fully responsive website design and development for a tech startup, with custom animations and interactive elements.",
    link: "",
  },
  {
    id: "3",
    title: "Urban Beats Campaign",
    category: "Digital Marketing",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    description: "Comprehensive marketing campaign for a music festival, including social media strategy, content creation, and analytics.",
    link: "",
  },
];

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark">
      {/* Hero Section with 3D Background */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <ThreeScene />
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            We Create<br />
            <span className="text-gradient">Digital Experiences</span><br />
            That <span className="text-gradient">Convert</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
            Transforming visions into captivating digital realities. Your brand deserves a powerful online presence that drives real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all px-8"
            >
              <Link to="/contact">Get Started</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/5"
            >
              <Link to="/portfolio">View Our Work</Link>
            </Button>
          </div>
          
          <a 
            href="#services" 
            className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/60 hover:text-white transition-all duration-300 ${
              scrolled ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="text-sm mb-2">Discover More</span>
            <ArrowDown className="animate-bounce" size={20} />
          </a>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We offer comprehensive creative solutions to help your brand stand out in the digital landscape.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="Web Design"
              description="Stunning, conversion-focused websites that captivate your audience and reflect your brand identity."
              icon={<Monitor size={24} />}
              link="/services/web-design"
            />
            <ServiceCard
              title="Web Development"
              description="Robust, scalable web applications built with cutting-edge technologies for optimal performance."
              icon={<Code size={24} />}
              link="/services/web-development"
            />
            <ServiceCard
              title="Video Production"
              description="Compelling video content that tells your story and engages viewers across all platforms."
              icon={<Video size={24} />}
              link="/services/video-production"
            />
            <ServiceCard
              title="Graphic Design"
              description="Eye-catching visual assets that strengthen your brand and communicate your message effectively."
              icon={<PenTool size={24} />}
              link="/services/graphic-design"
            />
            <ServiceCard
              title="Digital Marketing"
              description="Strategic campaigns that increase your visibility, drive traffic, and convert leads into customers."
              icon={<BarChart size={24} />}
              link="/services/digital-marketing"
              className="md:col-span-2 lg:col-span-1"
            />
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-agency-purple/30 text-white hover:bg-agency-purple/10 group"
            >
              <Link to="/services" className="flex items-center">
                View All Services
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Portfolio Section */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our latest work and see how we've helped brands achieve their goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <PortfolioItem key={item.id} {...item} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-agency-purple/30 text-white hover:bg-agency-purple/10 group"
            >
              <Link to="/portfolio" className="flex items-center">
                View All Projects
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "120+", label: "Projects Completed" },
              { number: "45+", label: "Happy Clients" },
              { number: "10+", label: "Years Experience" },
              { number: "18", label: "Industry Awards" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.number}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Let's <span className="text-gradient">Connect</span>
              </h2>
              <p className="text-gray-400">
                Ready to take your digital presence to the next level? Reach out to us!
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
