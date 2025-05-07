
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { formatBoldText } from "@/lib/utils";

interface PortfolioItemProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  link: string;
  defaultHovered?: boolean;
}

const PortfolioItem = ({
  id,
  title,
  category,
  imageUrl,
  description,
  link,
  defaultHovered = false,
}: PortfolioItemProps) => {
  const [isHovered, setIsHovered] = useState(defaultHovered);
  const formattedDescription = formatBoldText(description);

  // Update isHovered state if defaultHovered prop changes (for responsive adjustments)
  useEffect(() => {
    setIsHovered(defaultHovered);
  }, [defaultHovered]);

  return (
    <Card 
      className="overflow-hidden relative group h-[350px] shadow-lg transition-all duration-500 border-none"
      onMouseEnter={() => !defaultHovered && setIsHovered(true)}
      onMouseLeave={() => !defaultHovered && setIsHovered(false)}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center h-full w-full transition-all duration-500 transform group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-agency-darker/95 via-agency-darker/70 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}></div>
      
      {/* Content */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300" 
        style={{ transform: isHovered ? 'translateY(0)' : 'translateY(40px)' }}
      >
        <div className="mb-2">
          <span className="text-xs font-semibold text-agency-purple bg-black px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300">
          {title}
        </h3>
        <p 
          className={`text-gray-400 text-sm mb-4 transition-all duration-500 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}
          dangerouslySetInnerHTML={{ __html: formattedDescription.slice(0,180) + '...' }}
        ></p>
        <div className="flex space-x-2">
          <Link to={`/portfolio/${id}`}>
            <Button variant="outline" size="sm" className="border-agency-purple/30 text-white hover:bg-agency-purple/20 hover:text-white group">
              View Project
              <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-agency-purple/30 text-white hover:bg-agency-purple/20 hover:text-white">
                <ExternalLink size={14} />
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PortfolioItem;
