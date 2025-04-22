import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Portfolio } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import BulletPoints from '@/components/home/BulletPoints';

const PortfolioDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['portfolio', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data as Portfolio;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl text-white mb-4">Project not found</h1>
        <p className="text-gray-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    );
  }

  const renderGallery = () => {
    if (!project.gallery || project.gallery.length === 0) {
      return (
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src={project.gallery[activeImage] || project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {project.gallery.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-shrink-0 h-16 w-24 rounded overflow-hidden border-2 transition
                ${activeImage === index ? 'border-agency-purple' : 'border-transparent'}
              `}
            >
              <img src={image} alt={`${project.title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const ResultsSection = ({ portfolio }: { portfolio: Portfolio }) => {
    if (!portfolio.results || portfolio.results.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-10">
        <h3 className="text-xl font-medium mb-4">Results</h3>
        <ul className="list-disc list-inside space-y-2">
          {portfolio.results.map((result, index) => (
            <li key={index} className="text-gray-300">{result}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-agency-dark pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link 
          to="/portfolio" 
          className="inline-flex items-center text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to portfolio
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{project.title}</h1>
            
            <div className="mb-6">
              <Badge variant="outline" className="bg-agency-purple/20 border-agency-purple text-white">
                {project.category}
              </Badge>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {project.client_name && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Client</h3>
                  <p className="text-white font-semibold">{project.client_name}</p>
                </div>
              )}
              
              {project.completion_date && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Completion Date</h3>
                  <p className="text-white font-semibold">{project.completion_date}</p>
                </div>
              )}
              
              {project.project_duration && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Project Duration</h3>
                  <p className="text-white font-semibold">{project.project_duration}</p>
                </div>
              )}
              
              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-800 text-gray-200 border-gray-700">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {(project.challenges || project.solutions) && (
              <>
                <Separator className="my-8 bg-gray-800" />
                
                {project.challenges && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-3">The Challenge</h2>
                    <p className="text-gray-300 leading-relaxed"><BulletPoints text={project.challenges}/></p>
                  </div>
                )}
                
                {project.solutions && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-3">The Solution</h2>
                    <p className="text-gray-300 leading-relaxed"><BulletPoints text={project.solutions}/></p>
                  </div>
                )}
              </>
            )}
            
            {/* <ResultsSection portfolio={project} /> */}
            
            {project.testimonial && (
              <div className="mt-10 bg-agency-darker p-6 rounded-lg border border-gray-800">
                <p className="text-gray-300 italic mb-4">"{project.testimonial}"</p>
                {project.testimonial_author && (
                  <p className="text-agency-purple font-semibold">— {project.testimonial_author}</p>
                )}
              </div>
            )}
            
            {project.link && (
              <div className="mt-8">
                <Button asChild className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple">
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    Visit Project
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            {renderGallery()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;
