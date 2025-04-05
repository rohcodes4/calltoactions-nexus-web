import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import AnimatedCounter from '@/components/AnimatedCounter';
import Testimonial from '@/components/Testimonial';
import { motion } from 'framer-motion';

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

const testimonials = [
  {
    quote: "CallToActions transformed our online presence completely. Their strategic approach and creative solutions helped us increase conversions by 45% within just three months.",
    author: "Emma Thompson",
    position: "Marketing Director",
    company: "Elevate Inc.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  },
  {
    quote: "Working with the team at CallToActions was a game-changer for our brand. Their attention to detail and innovative thinking delivered results beyond our expectations.",
    author: "David Chen",
    position: "CEO",
    company: "Nexus Technologies",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    quote: "The web development team at CallToActions created a seamless user experience that perfectly represents our brand values while driving significant growth in user engagement.",
    author: "Sophia Rodriguez",
    position: "Product Manager",
    company: "Wavelength Media",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
  },
];

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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

  const handleGetStarted = () => {
    navigate('/contact');
  };

  const handleGetInTouch = () => {
    navigate('/contact');
  };

  const serviceCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark">
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
              onClick={handleGetStarted}
            >
              Get Started
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="md:col-span-2 glass-card p-8 rounded-lg bg-gradient-to-br from-agency-purple/10 to-agency-blue/5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 mb-6 bg-agency-purple/20 rounded-2xl flex items-center justify-center">
                  <Monitor size={32} className="text-agency-purple" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Web Design & Development</h3>
                <p className="text-gray-300 mb-6">
                  From stunning UX/UI designs to powerful backends, we create websites and web applications that captivate and convert.
                </p>
                <div className="mt-auto">
                  <Link to="/services/web-design" className="text-agency-purple font-medium flex items-center group">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col glass-card p-8 rounded-lg bg-gradient-to-br from-agency-blue/10 to-agency-teal/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 mb-4 bg-agency-blue/20 rounded-xl flex items-center justify-center">
                <Code size={24} className="text-agency-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Development</h3>
              <p className="text-gray-400 mb-4">
                Robust, scalable applications built with cutting-edge technology.
              </p>
              <div className="mt-auto">
                <Link to="/services/web-development" className="text-agency-blue font-medium flex items-center group">
                  <span>Explore</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: "Video Production",
                description: "Compelling video content that tells your story across all platforms.",
                icon: <Video size={24} />,
                link: "/services/video-production",
                color: "agency-purple",
                delay: 0
              },
              {
                title: "Graphic Design",
                description: "Eye-catching visual assets that strengthen your brand identity.",
                icon: <PenTool size={24} />,
                link: "/services/graphic-design",
                color: "agency-blue",
                delay: 0.1
              },
              {
                title: "Digital Marketing",
                description: "Strategic campaigns that increase visibility and drive conversions.",
                icon: <BarChart size={24} />,
                link: "/services/digital-marketing",
                color: "agency-teal",
                delay: 0.2
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                custom={i}
                variants={serviceCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  link={service.link}
                />
              </motion.div>
            ))}
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
      
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Client <span className="text-gradient">Testimonials</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Testimonial {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: 120, label: "Projects Completed", suffix: "+" },
              { number: 45, label: "Happy Clients", suffix: "+" },
              { number: 10, label: "Years Experience", suffix: "+" },
              { number: 18, label: "Industry Awards", suffix: "" },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AnimatedCounter endValue={stat.number} suffix={stat.suffix} />
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-agency-darker">
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
