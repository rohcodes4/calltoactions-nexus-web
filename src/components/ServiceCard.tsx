
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
}

const ServiceCard = ({ title, description, icon, link, className = "" }: ServiceCardProps) => {
  return (
    <Card className={`glass-card overflow-hidden group transition-all duration-300 hover:shadow-purple-500/20 hover:border-agency-purple/30 ${className}`}>
      <div className="p-6">
        <div className="w-12 h-12 mb-4 bg-agency-purple/10 rounded-lg flex items-center justify-center text-agency-purple animate-pulse-glow">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <Link to={link}>
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
