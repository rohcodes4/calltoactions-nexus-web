
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, Link, Image as ImageIcon, Calendar, LayoutList, Tag, Plus, Trash } from 'lucide-react';
import { Portfolio } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { fetchTestimonials } from '@/services/databaseService';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Validation schema
const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("A valid image URL is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().optional(),
  client_name: z.string().optional(),
  completion_date: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  testimonial_id: z.string().optional(),
  featured: z.boolean().optional(),
  gallery: z.array(z.string()).optional(),
  project_duration: z.string().optional(),
  testimonial: z.string().optional(),
  testimonial_author: z.string().optional(),
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
  const [newTechnology, setNewTechnology] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const { toast } = useToast();

  // Fetch testimonials for linking to portfolio items
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials
  });

  useEffect(() => {
    // Ensure the item has the arrays initialized
    if (editingItem) {
      const updatedItem = { 
        ...editingItem,
        technologies: editingItem.technologies || [],
        gallery: editingItem.gallery || [],
        featured: !!editingItem.featured
      };
      setItem(updatedItem);
    }
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

  const addTechnology = () => {
    if (!newTechnology.trim()) return;
    
    const technologies = [...(item.technologies || [])];
    if (!technologies.includes(newTechnology)) {
      technologies.push(newTechnology);
      setItem({ ...item, technologies });
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    const technologies = (item.technologies || []).filter(t => t !== tech);
    setItem({ ...item, technologies });
  };

  const addGalleryImage = () => {
    if (!newGalleryImage.trim()) return;
    
    const gallery = [...(item.gallery || [])];
    if (!gallery.includes(newGalleryImage)) {
      gallery.push(newGalleryImage);
      setItem({ ...item, gallery });
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (img: string) => {
    const gallery = (item.gallery || []).filter(g => g !== img);
    setItem({ ...item, gallery });
  };

  return (
    <div className="space-y-4">
      {/* Basic Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Title*</label>
            <input 
              type="text" 
              value={item.title || ''}
              onChange={e => setItem({...item, title: e.target.value})}
              className={`w-full p-2 rounded bg-white/10 border ${errors.title ? 'border-red-500' : 'border-white/20'} text-white`}
              placeholder="Project Title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="text-sm text-gray-300 block mb-1">Category*</label>
            <select 
              value={item.category || ''}
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
            <label className="text-sm text-gray-300 block mb-1">Client Name</label>
            <input 
              type="text" 
              value={item.client_name || ''}
              onChange={e => setItem({...item, client_name: e.target.value})}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
              placeholder="Client's name or company"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Project Duration</label>
            <input 
              type="text" 
              value={item.project_duration || ''}
              onChange={e => setItem({...item, project_duration: e.target.value})}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
              placeholder="e.g. 3 months, 6 weeks"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Completion Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal border-white/20 bg-white/10 text-white ${!item.completion_date ? 'text-gray-400' : ''}`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {item.completion_date 
                    ? format(new Date(item.completion_date), 'PPP')
                    : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-agency-darker border-white/20">
                <CalendarComponent
                  mode="single"
                  selected={item.completion_date ? new Date(item.completion_date) : undefined}
                  onSelect={(date) => setItem({...item, completion_date: date?.toISOString()})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="featured"
              checked={!!item.featured}
              onChange={e => setItem({...item, featured: e.target.checked})}
              className="rounded border-white/20 bg-white/10 text-agency-purple"
            />
            <label htmlFor="featured" className="text-sm text-gray-300">
              Feature this project on homepage
            </label>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Images</h3>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Main Image URL*</label>
          <div className="flex mb-2">
            <input 
              type="text" 
              value={item.imageUrl || ''}
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
            <div className="h-40 w-full bg-white/5 rounded overflow-hidden mb-4">
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

        <div className="mt-4">
          <label className="text-sm text-gray-300 block mb-1">Gallery Images</label>
          <div className="flex mb-2">
            <input 
              type="text" 
              value={newGalleryImage}
              onChange={e => setNewGalleryImage(e.target.value)}
              className="w-full p-2 rounded-l bg-white/10 border border-white/20 text-white"
              placeholder="https://example.com/gallery-image.jpg"
            />
            <button 
              className="bg-agency-purple/80 px-3 py-2 rounded-r border border-agency-purple text-white hover:bg-agency-purple"
              onClick={addGalleryImage}
              disabled={!newGalleryImage.trim()}
              type="button"
            >
              <Plus size={16} />
            </button>
          </div>

          {(item.gallery && item.gallery.length > 0) && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {item.gallery.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={img} 
                    alt={`Gallery ${idx}`} 
                    className="h-24 w-full object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+URL';
                    }}
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeGalleryImage(img)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Details Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
        
        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Description*</label>
          <textarea 
            value={item.description || ''}
            onChange={e => setItem({...item, description: e.target.value})}
            className={`w-full p-2 rounded bg-white/10 border ${errors.description ? 'border-red-500' : 'border-white/20'} text-white h-24`}
            placeholder="Comprehensive project description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Challenges</label>
          <textarea 
            value={item.challenges || ''}
            onChange={e => setItem({...item, challenges: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white h-16"
            placeholder="Key challenges faced during the project"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Solutions</label>
          <textarea 
            value={item.solutions || ''}
            onChange={e => setItem({...item, solutions: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white h-16"
            placeholder="How the challenges were addressed"
          />
        </div>
        
        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Testimonial</label>
          <textarea 
            value={item?.testimonial || ''}
            onChange={e => setItem({...item, testimonial: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white h-16"
            placeholder="How the challenges were addressed"
          />
        </div>
        
        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Testimonial Author</label>
          <textarea 
            value={item?.testimonial_author || ''}
            onChange={e => setItem({...item, testimonial_author: e.target.value})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white h-16"
            placeholder="How the challenges were addressed"
          />
        </div>
        
        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Project URL (optional)</label>
          <div className="flex">
            <input 
              type="text" 
              value={item.link || ''}
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

        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Technologies Used</label>
          <div className="flex mb-2">
            <input 
              type="text" 
              value={newTechnology}
              onChange={e => setNewTechnology(e.target.value)}
              className="w-full p-2 rounded-l bg-white/10 border border-white/20 text-white"
              placeholder="e.g. React, Node.js, Tailwind CSS"
            />
            <button 
              className="bg-agency-purple/80 px-3 py-2 rounded-r border border-agency-purple text-white hover:bg-agency-purple"
              onClick={addTechnology}
              disabled={!newTechnology.trim()}
              type="button"
            >
              <Plus size={16} />
            </button>
          </div>

          {(item.technologies && item.technologies.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {item.technologies.map((tech, idx) => (
                <div key={idx} className="bg-white/10 px-3 py-1 rounded-full flex items-center">
                  <Tag size={12} className="mr-1 text-agency-purple" />
                  <span className="text-sm">{tech}</span>
                  <button
                    className="ml-2 text-gray-400 hover:text-red-400"
                    onClick={() => removeTechnology(tech)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div>
          <label className="text-sm text-gray-300 block mb-1">Related Testimonial</label>
          <select 
            value={item.testimonial_id || ''}
            onChange={e => setItem({...item, testimonial_id: e.target.value || undefined})}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          >
            <option value="">None</option>
            {testimonials.map(testimonial => (
              <option key={testimonial.id} value={testimonial.id}>
                {testimonial.author} - {testimonial.company}
              </option>
            ))}
          </select>
        </div> */}
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
