
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Plus, Trash } from 'lucide-react';
import { Service } from '@/lib/supabase';

interface ServiceFormProps {
  isAdding: boolean;
  editingService: Service;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

const ServiceForm = ({ isAdding, editingService, onSave, onCancel }: ServiceFormProps) => {
  const [service, setService] = useState<Service>(editingService);
  const [isValid, setIsValid] = useState(false);

  // List of available icons
  const icons = [
    'Monitor', 'Code', 'Video', 'PenTool', 'BarChart', 'Search',
    'MessageSquare', 'Layout', 'Map', 'Award', 'Camera', 'Database'
  ];

  useEffect(() => {
    // Generate slug from title if adding a new service or if slug is empty
    if (isAdding || !service.slug) {
      const slug = service.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setService(prev => ({ ...prev, slug }));
    }
  }, [service.title, isAdding]);

  useEffect(() => {
    const requiredFields = [
      service.title,
      service.description,
      service.icon,
      service.details,
      service.slug
    ];
    
    const allRequiredFieldsFilled = requiredFields.every(field => field?.trim());
    const hasBenefits = service.benefits.length > 0 && service.benefits.some(b => b.trim());
    
    setIsValid(allRequiredFieldsFilled && hasBenefits);
  }, [service]);

  const handleInputChange = (field: keyof Service, value: any) => {
    setService(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBenefit = () => {
    setService(prev => ({
      ...prev,
      benefits: [...prev.benefits, ""]
    }));
  };

  const handleUpdateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...service.benefits];
    updatedBenefits[index] = value;
    
    setService(prev => ({
      ...prev,
      benefits: updatedBenefits
    }));
  };

  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = service.benefits.filter((_, i) => i !== index);
    
    setService(prev => ({
      ...prev,
      benefits: updatedBenefits
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave(service);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={service.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g. Web Design"
            className="bg-agency-darker text-white border-white/10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Icon <span className="text-red-500">*</span>
          </label>
          <Select
            value={service.icon}
            onValueChange={(value) => handleInputChange('icon', value)}
          >
            <SelectTrigger className="bg-agency-darker text-white border-white/10">
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent className="bg-agency-darker text-white border-white/10">
              {icons.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={service.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the service"
            className="bg-agency-darker text-white border-white/10 h-24"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <Input
            value={service.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="e.g. web-design"
            className="bg-agency-darker text-white border-white/10 mb-2"
          />
          <p className="text-xs text-gray-400">
            Used for URL: /services/<span className="text-agency-purple">{service.slug || 'slug'}</span>
          </p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Details <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={service.details}
          onChange={(e) => handleInputChange('details', e.target.value)}
          placeholder="Detailed description of the service"
          className="bg-agency-darker text-white border-white/10 h-40"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Benefits <span className="text-red-500">*</span>
          </label>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={handleAddBenefit}
            className="text-agency-purple border-agency-purple/50"
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
        
        {service.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              value={benefit}
              onChange={(e) => handleUpdateBenefit(index, e.target.value)}
              placeholder={`Benefit ${index + 1}`}
              className="bg-agency-darker text-white border-white/10 flex-grow"
            />
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={() => handleRemoveBenefit(index)}
              className="ml-2 text-gray-400 hover:text-red-500"
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
        
        {service.benefits.length === 0 && (
          <p className="text-sm text-gray-400">No benefits added yet.</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="text-white border-white/20"
        >
          <X size={16} className="mr-1" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!isValid}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Save size={16} className="mr-1" />
          {isAdding ? 'Create Service' : 'Update Service'}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
