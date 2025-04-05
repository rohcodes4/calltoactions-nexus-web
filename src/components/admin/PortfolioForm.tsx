
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, Link, Image as ImageIcon } from 'lucide-react';
import { Portfolio } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';

// Validation schema
const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("A valid image URL is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().optional()
});

const categories = [
  "Web Design",
  "Web Development",
  "Graphic Design", 
  "Video Production",
  "Digital Marketing",
  "Branding"
];

interface PortfolioFormProps {
  isAdding: boolean;
  editingItem: Portfolio | null;
  onSave: (item: Portfolio) => void;
  onCancel: () => void;
}

const PortfolioForm = ({ isAdding, editingItem, onSave, onCancel }: PortfolioFormProps) => {
  const [item, setItem] = useState<Portfolio | null>(editingItem);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    setItem(editingItem);
  }, [editingItem]);

  if (!item) return null;

  const validateForm = () => {
    try {
      portfolioSchema.parse(item);
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
    if (validateForm()) {
      onSave(item);
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
          value={item.title}
          onChange={e => setItem({...item, title: e.target.value})}
          className={`w-full p-2 rounded bg-white/10 border ${errors.title ? 'border-red-500' : 'border-white/20'} text-white`}
          placeholder="Project Title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Category</label>
        <select 
          value={item.category}
          onChange={e => setItem({...item, category: e.target.value})}
          className={`w-full p-2 rounded bg-white/10 border ${errors.category ? 'border-red-500' : 'border-white/20'} text-white`}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Image URL</label>
        <div className="flex mb-2">
          <input 
            type="text" 
            value={item.imageUrl}
            onChange={e => setItem({...item, imageUrl: e.target.value})}
            className={`w-full p-2 rounded-l bg-white/10 border ${errors.imageUrl ? 'border-red-500' : 'border-white/20'} text-white`}
            placeholder="https://example.com/image.jpg"
          />
          <button 
            className="bg-white/10 px-3 rounded-r border border-white/20 border-l-0 text-white hover:bg-white/15"
            onClick={() => {
              if (item.imageUrl) {
                window.open(item.imageUrl, '_blank');
              }
            }}
            disabled={!item.imageUrl}
            type="button"
          >
            <ImageIcon size={16} />
          </button>
        </div>
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        
        {item.imageUrl && (
          <div className="h-40 w-full bg-white/5 rounded overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
              }}
            />
          </div>
        )}
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Description</label>
        <textarea 
          value={item.description}
          onChange={e => setItem({...item, description: e.target.value})}
          className={`w-full p-2 rounded bg-white/10 border ${errors.description ? 'border-red-500' : 'border-white/20'} text-white h-24`}
          placeholder="Project description"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      
      <div>
        <label className="text-sm text-gray-300 block mb-1">Project URL (optional)</label>
        <div className="flex">
          <input 
            type="text" 
            value={item.link}
            onChange={e => setItem({...item, link: e.target.value})}
            className="w-full p-2 rounded-l bg-white/10 border border-white/20 text-white"
            placeholder="https://example.com"
          />
          <button 
            className="bg-white/10 px-3 rounded-r border border-white/20 border-l-0 text-white hover:bg-white/15"
            onClick={() => {
              if (item.link) {
                window.open(item.link, '_blank');
              }
            }}
            disabled={!item.link}
            type="button"
          >
            <Link size={16} />
          </button>
        </div>
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

export default PortfolioForm;
