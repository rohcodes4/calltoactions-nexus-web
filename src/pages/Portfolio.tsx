
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  {
    id: "4",
    title: "Nature Documentary",
    category: "Video Production",
    imageUrl: "https://images.unsplash.com/photo-1585023523356-6307e708055b?q=80&w=800&auto=format&fit=crop",
    description: "Award-winning short documentary about environmental conservation, featuring stunning cinematography and compelling storytelling.",
    link: "",
  },
  {
    id: "5",
    title: "Fusion Restaurant Menu",
    category: "Graphic Design",
    imageUrl: "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=800&auto=format&fit=crop",
    description: "Custom menu design for a high-end fusion restaurant, including digital and print versions with innovative layout and typography.",
    link: "",
  },
  {
    id: "6",
    title: "Eco-Friendly E-commerce",
    category: "Web Development",
    imageUrl: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=800&auto=format&fit=crop",
    description: "Full e-commerce platform development for a sustainable products brand, with custom checkout process and integration with inventory management.",
    link: "",
  },
];

const Portfolio = () => {
  const categories = ["All", ...new Set(portfolioItems.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Explore our latest work and see how we've helped brands achieve their goals through innovative digital solutions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Filter Navigation */}
      <section className="py-8 bg-agency-dark sticky top-20 z-10 border-b border-white/5 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={`
                  ${activeCategory === category 
                    ? 'bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple' 
                    : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Portfolio Grid */}
      <section className="py-16 bg-agency-dark">
        <div className="container mx-auto px-4">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <PortfolioItem key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-white mb-4">No projects found</h3>
              <p className="text-gray-400">
                No projects match the selected category. Please try another filter.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-agency-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to <span className="text-gradient">Start Your Project?</span>
              </h2>
              <p className="text-gray-400">
                Let's discuss how we can help bring your vision to life.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
