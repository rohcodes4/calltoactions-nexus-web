
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import ThreeScene from '@/components/ThreeScene';

const HeroSection = () => {
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

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('client-logos');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeScene />
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          We Create<br />
          <span className="text-gradient">Digital Experiences</span><br />
          That <span className="text-gradient">Convert</span>
        </h1>
        {/* <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
          Transforming visions into captivating digital realities. Your brand deserves a powerful online presence that drives real results.
        </p> */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple transition-all px-8"
            onClick={handleGetStarted}
          >
            Book Exploration Call
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/20 text-white hover:bg-white/5"
            onClick={() => navigate('/portfolio')}
          >
            View Our Work
          </Button>
        </div>
        
        <div className="relative -bottom-10 left-0 right-0 flex justify-center">
          <button 
            onClick={scrollToNextSection}
            className={`flex flex-col items-center text-white/60 hover:text-white transition-all duration-300 ${
              scrolled ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="text-sm mb-2">Discover More</span>
            <ArrowDown className="animate-bounce" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
