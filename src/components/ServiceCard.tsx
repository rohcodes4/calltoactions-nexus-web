
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
  bgColor?: string;
  bgImage?: string;
}

const colorClasses = [
  "from-purple-500/10 to-purple-700/5",
  "from-blue-500/10 to-blue-700/5",
  "from-green-500/10 to-green-700/5",
  "from-amber-500/10 to-amber-700/5",
  "from-pink-500/10 to-pink-700/5",
  "from-teal-500/10 to-teal-700/5",
  "from-red-500/10 to-red-700/5",
  "from-indigo-500/10 to-indigo-700/5",
];

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  link, 
  className = "",
  bgColor,
  bgImage
}: ServiceCardProps) => {
  const colorClass = bgColor || colorClasses[Math.floor(Math.random() * colorClasses.length)];
  
  // Function to parse markdown content and convert ** to bold
  const parseDescription = (text: string) => {
    return <ReactMarkdown
      components={{
        strong: ({ node, ...props }) => <span className="font-bold text-agency-purple" {...props} />
      }}
    >
      {text}
    </ReactMarkdown>;
  };

  return (
    <Card 
      className={`!bg-center !bg-cover glass-card overflow-hidden group transition-all duration-300 hover:shadow-purple-500/20 hover:border-agency-purple/30 h-full flex flex-col ${className}`}
      style={{
        background: bgImage ? `linear-gradient(to bottom right, rgba(0,0,0,0.95), rgba(0,0,0,0.85)), url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={`p-6 flex flex-col flex-grow bg-gradient-to-br ${colorClass}`}>
        <div className="w-12 h-12 mb-4 bg-agency-purple/10 rounded-lg flex items-center justify-center text-agency-purple animate-pulse-glow">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <div className="text-gray-400 mb-4 flex-grow">
          {parseDescription(description)}
        </div>
        <Link to={link} className="mt-auto">
          <Button variant="ghost" className="group p-0 text-agency-purple hover:text-agency-blue hover:bg-transparent">
            <span className="mr-2">Learn More</span>
            <ArrowRight size={16} className="transition-transform transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      <div className="h-1 w-0 bg-gradient-to-r from-agency-purple to-agency-blue group-hover:w-full transition-all duration-500"></div>
    </Card>
  );
};

export default ServiceCard;
