
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  imageUrl: string;
}

const Testimonial = ({ quote, author, position, company, imageUrl }: TestimonialProps) => {
  return (
    <Card className="glass-card p-6 overflow-hidden relative transition-all duration-300 hover:shadow-purple-500/20 hover:border-agency-purple/30">
      <div className="absolute top-6 right-6 text-agency-purple opacity-30">
        <Quote size={36} />
      </div>
      <div className="flex flex-col h-full">
        <p className="text-gray-300 mb-6 text-lg relative z-10">{quote}</p>
        <div className="mt-auto flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <img src={imageUrl} alt={author} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-white">{author}</h4>
            <p className="text-sm text-gray-400">{position}, {company}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Testimonial;
