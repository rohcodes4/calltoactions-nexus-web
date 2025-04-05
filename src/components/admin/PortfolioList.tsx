
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Portfolio } from '@/lib/supabase';

interface PortfolioListProps {
  portfolioItems: Portfolio[];
  onEdit: (item: Portfolio) => void;
  onDelete: (id: string) => void;
}

const PortfolioList = ({ portfolioItems, onEdit, onDelete }: PortfolioListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolioItems.map(item => (
        <Card key={item.id} className="glass-card overflow-hidden">
          <div className="h-48 relative">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-agency-darker to-transparent opacity-70"></div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-agency-purple mb-2">{item.category}</p>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8"
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(item.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PortfolioList;
