
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, X } from 'lucide-react';
import { Service } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';

// Validation schema
const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string(),
  details: z.string().min(1, "Details are required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required")
});

interface ServiceFormProps {
  isAdding: boolean;
  editingService: Service | null;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

const ServiceForm = ({ isAdding, editingService, onSave, onCancel }: ServiceFormProps) => {
  const [service, setService] = useState<Service | null>(editingService);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    setService(editingService);
  }, [editingService]);

  if (!service) return null;

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...service.benefits];
    newBenefits[index] = value;
    
    setService({
      ...service,
      benefits: newBenefits
    });
  };

  const addBenefit = () => {
    setService({
      ...service,
      benefits: [...service.benefits, ""]
    });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...service.benefits];
    newBenefits.splice(index, 1);
    
    setService({
      ...service,
      benefits: newBenefits
    });
  };

  const validateForm = () => {
    try {
      serviceSchema.parse(service);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    // Check if there are empty benefits
    const hasBlanks = service.benefits.some(benefit => !benefit.trim());
    if (hasBlanks) {
      toast({
        title: "Error",
        description: "Please fill in all benefits or remove empty ones",
        variant: "destructive"
      });
      return;
    }

    if (validateForm()) {
      onSave(service);
    } else {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-300 block mb-1">Title</label>
        <input 
          type="text" 
          value={service.title}
          onChange={e => setService({...service, title: e.target.value})}
          className={`w-full p-2 rounded bg-white/10 border ${errors.title ? 'border-red-500' : 'border-white/20'} text-white`}
          placeholder="Service Title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Description</label>
        <input 
          type="text" 
          value={service.description}
          onChange={e => setService({...service, description: e.target.value})}
          className={`w-full p-2 rounded bg-white/10 border ${errors.description ? 'border-red-500' : 'border-white/20'} text-white`}
          placeholder="Short description"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Icon</label>
        <select 
          value={service.icon}
          onChange={e => setService({...service, icon: e.target.value})}
          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
        >
          <option value="Monitor">Monitor</option>
          <option value="Code">Code</option>
          <option value="Video">Video</option>
          <option value="PenTool">PenTool</option>
          <option value="BarChart">BarChart</option>
          <option value="FileText">FileText</option>
        </select>
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Details</label>
        <textarea 
          value={service.details}
          onChange={e => setService({...service, details: e.target.value})}
          className={`w-full p-2 rounded bg-white/10 border ${errors.details ? 'border-red-500' : 'border-white/20'} text-white h-24`}
          placeholder="Detailed description"
        />
        {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Benefits</label>
        {service.benefits.map((benefit, index) => (
          <div key={index} className="flex mb-2">
            <input 
              type="text" 
              value={benefit}
              onChange={e => handleBenefitChange(index, e.target.value)}
              className={`flex-1 p-2 rounded-l bg-white/10 border ${errors.benefits ? 'border-red-500' : 'border-white/20'} text-white`}
              placeholder={`Benefit ${index + 1}`}
            />
            <button 
              onClick={() => removeBenefit(index)}
              className="bg-white/10 px-3 rounded-r border border-white/20 border-l-0 text-white hover:bg-white/15"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {errors.benefits && <p className="text-red-500 text-sm mt-1">{errors.benefits}</p>}
        <Button 
          variant="outline"
          size="sm"
          onClick={addBenefit}
          className="mt-1"
          type="button"
        >
          <Plus size={14} className="mr-1" />
          Add Benefit
        </Button>
      </div>
      
      <div className="flex justify-end mt-6 space-x-2">
        <Button 
          variant="outline"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
          type="button"
        >
          <Save size={16} className="mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default ServiceForm;
