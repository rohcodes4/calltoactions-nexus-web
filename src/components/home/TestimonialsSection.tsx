
import { motion } from 'framer-motion';
import Testimonial from '@/components/Testimonial';
import { useQuery } from '@tanstack/react-query';
import { fetchTestimonials } from '@/services/databaseService';

const TestimonialsSection = () => {
  // Fetch testimonials from database
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials
  });

  // Fallback testimonials if none in database
  const fallbackTestimonials = [
    {
      id: "1",
      quote: "TBD transformed our online presence completely. Their strategic approach and creative solutions helped us increase conversions by 45% within just three months.",
      author: "Emma Thompson",
      position: "Marketing Director",
      company: "Elevate Inc.",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "2",
      quote: "Working with the team at TBD was a game-changer for our brand. Their attention to detail and innovative thinking delivered results beyond our expectations.",
      author: "David Chen",
      position: "CEO",
      company: "Nexus Technologies",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "3",
      quote: "The web development team at TBD created a seamless user experience that perfectly represents our brand values while driving significant growth in user engagement.",
      author: "Sophia Rodriguez",
      position: "Product Manager",
      company: "Wavelength Media",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section className="py-20 bg-agency-darker">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          <span className="text-gradient">Success Stories</span> From Our Partners
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Testimonial {...testimonial} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
