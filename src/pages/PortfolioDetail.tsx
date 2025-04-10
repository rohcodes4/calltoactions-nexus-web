
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Calendar, Tag, User } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolioById } from '@/services/databaseService';

// Sample portfolio projects data
const portfolioProjects = {
  "1": {
    title: "Elegance Rebranding",
    category: "Graphic Design",
    client: "Luxury Fashion Brand",
    date: "June 2023",
    imageUrl: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576798479452-7ef6dc8b298a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=800&auto=format&fit=crop",
    ],
    description: "A comprehensive rebranding project for a luxury fashion brand that wanted to refresh their visual identity while maintaining their heritage and prestige.",
    challenge: "The client needed a modernized brand identity that would appeal to a younger demographic without alienating their established customer base. They also required a consistent visual system that could be applied across various touchpoints.",
    solution: "We developed a refined and elegant visual identity system that honored the brand's heritage while introducing contemporary elements. The rebrand included a new logo, typography, color palette, and brand guidelines.",
    results: [
      "35% increase in social media engagement",
      "28% improvement in brand recognition among younger demographics",
      "Successful implementation across all brand touchpoints",
      "Positive feedback from both new and existing customers"
    ],
    testimonial: {
      quote: "The team at CallToActions transformed our brand with a perfect balance of tradition and modernity. The new identity has been embraced by our long-time customers and has attracted a new generation of fashion enthusiasts.",
      author: "Sarah Johnson",
      position: "Marketing Director"
    }
  },
  "2": {
    title: "Tech Innovators Website",
    category: "Web Development",
    client: "Tech Startup",
    date: "March 2023",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1551909616-5b8e1cacc505?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546146830-2cca9512c68e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=800&auto=format&fit=crop",
    ],
    description: "A cutting-edge website development project for a technology startup focused on AI innovations. The website needed to communicate complex technological concepts in an accessible way while showcasing the company's innovative approach.",
    challenge: "The client required a website that would stand out in a crowded tech market, effectively communicate their value proposition, and provide a seamless user experience for both technical and non-technical visitors.",
    solution: "We developed a fully responsive website with immersive 3D elements, interactive product demonstrations, and clear information architecture. The site includes custom animations that illustrate complex technological concepts in an intuitive way.",
    results: [
      "42% increase in time spent on site",
      "65% improvement in lead generation",
      "30% decrease in bounce rate",
      "Featured in several tech design showcases"
    ],
    testimonial: {
      quote: "CallToActions delivered a website that perfectly captures our innovative spirit. They transformed our complex technical products into an engaging, user-friendly experience that has significantly improved our conversion rates.",
      author: "David Chen",
      position: "CEO & Founder"
    }
  },
  "3": {
    title: "Urban Beats Campaign",
    category: "Digital Marketing",
    client: "Music Festival",
    date: "August 2023",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    ],
    description: "A comprehensive digital marketing campaign for an annual urban music festival, aimed at increasing ticket sales and building a stronger online community around the event.",
    challenge: "The festival faced increasing competition from similar events and needed to establish a distinctive identity in the market. They also wanted to attract a broader audience while maintaining their core fan base.",
    solution: "We developed a multi-channel marketing strategy that included targeted social media campaigns, influencer partnerships, interactive content, and a community engagement plan. The campaign featured dynamic visual content that captured the energy of the festival.",
    results: [
      "120% increase in social media engagement",
      "85% of tickets sold within the first two weeks of the campaign",
      "200% growth in email subscriber list",
      "Successful expansion to new audience demographics"
    ],
    testimonial: {
      quote: "The campaign that CallToActions created exceeded all our expectations. Their strategic approach and creative execution helped us sell out our festival faster than ever before and created a buzz that lasted long after the event.",
      author: "Marcus Reynolds",
      position: "Event Director"
    }
  },
  "4": {
    title: "Nature Documentary",
    category: "Video Production",
    client: "Environmental Non-Profit",
    date: "October 2023",
    imageUrl: "https://images.unsplash.com/photo-1585023523356-6307e708055b?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    ],
    description: "A compelling short documentary about environmental conservation efforts in coastal regions, produced for an environmental non-profit organization to raise awareness and support for their initiatives.",
    challenge: "The client needed a powerful visual narrative that would emotionally connect viewers to environmental issues without resorting to doom-and-gloom messaging. They also required a documentary that would work across multiple platforms and contexts.",
    solution: "We created a 15-minute documentary that combined stunning cinematography with personal stories from conservation workers and local communities. The narrative focused on solutions and positive impact, while still honestly addressing environmental challenges.",
    results: [
      "Featured in three environmental film festivals",
      "Over 500,000 views across platforms in the first month",
      "40% increase in donations to the organization",
      "Used as educational material in over 100 schools"
    ],
    testimonial: {
      quote: "The documentary that CallToActions produced perfectly captured the beauty of the ecosystems we protect and the urgency of our mission. Their storytelling approach struck the perfect balance between highlighting problems and inspiring action.",
      author: "Elena Martinez",
      position: "Conservation Director"
    }
  },
  // Add more projects as needed
};

const PortfolioDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchPortfolioById(projectId as string),
    enabled: !!projectId,
  });

  console.log("Project")
  console.log(project)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-agency-dark pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  
  if (!project) {
    return (
      <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Project Not Found</h1>
          <p className="text-gray-400 mb-8">The project you're looking for doesn't exist.</p>
          <Link to="/portfolio">
            <Button>
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-agency-dark pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-agency-darker">
        <div className="container mx-auto px-4">
          <Link to="/portfolio" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to All Projects
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="mb-4">
                <span className="inline-block text-xs font-semibold text-agency-purple bg-agency-purple/10 px-3 py-1 rounded-full mb-4">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {project.title}
                </h1>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center text-gray-400">
                  <User size={16} className="mr-2 text-agency-purple" />
                  <span>{project.client_name}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Calendar size={16} className="mr-2 text-agency-purple" />
                  <span>{project.completion_date}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Tag size={16} className="mr-2 text-agency-purple" />
                  <span>{project.category}</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-8">
                {project.description}
              </p>
              
              <Button 
                variant="outline" 
                className="border-agency-purple/30 text-white hover:bg-agency-purple/10 group"
                onClick={()=>window.open(project?.link,"_blank")}
              >
                <ExternalLink size={16} className="mr-2"/>
                Visit Project
              </Button>
            </div>
            
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Project Details */}
      <section className="py-16 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                The <span className="text-gradient">Challenge</span>
              </h2>
              <p className="text-gray-300 mb-12">
                {project.challenges}
              </p>
              
              <h2 className="text-2xl font-bold text-white mb-6">
                Our <span className="text-gradient">Solution</span>
              </h2>
              <p className="text-gray-300">
                {project.solutions}
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                The <span className="text-gradient">Results</span>
              </h2>
              <ul className="space-y-4 mb-12">
                {project?.results?.map((result, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-agency-purple/10 flex items-center justify-center text-agency-purple mr-3 flex-shrink-0">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-300">{result}</span>
                  </li>
                ))}
              </ul>
              
              {/* Testimonial */}
              <div className="glass-card p-8 rounded-lg">
                <div className="text-agency-purple text-4xl mb-4">"</div>
                <p className="text-white text-lg italic mb-6">
                  {project?.testimonial}
                </p>
                <div>
                  <div className="font-bold text-white">{project?.client_name}</div>
                  <div className="text-gray-400 text-sm">{project?.testimonial_author}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Project Gallery */}
      <section className="py-16 bg-agency-darker">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Project <span className="text-gradient">Gallery</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project?.galleryImages?.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={image} 
                  alt={`${project.title} - Gallery Image ${index + 1}`}
                  className="w-full h-auto transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-agency-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Like What You <span className="text-gradient">See?</span>
              </h2>
              <p className="text-gray-400">
                Let's discuss how we can create a similar success story for your business.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioDetail;
