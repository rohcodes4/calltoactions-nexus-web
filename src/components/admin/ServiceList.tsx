
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Service } from '@/lib/supabase';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceList = ({ services, onEdit, onDelete }: ServiceListProps) => {
  return (
    <div className="space-y-4">
      {services.map(service => (
        <Card key={service.id} className="glass-card p-6 overflow-hidden relative">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <div className="text-sm text-gray-500">
                {service.benefits.length} benefits listed
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(service)}
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 hover:text-red-400"
                onClick={() => onDelete(service.id)}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ServiceList;
