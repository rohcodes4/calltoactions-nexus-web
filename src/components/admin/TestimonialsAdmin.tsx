import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import {TestimonialList,TestimonialForm} from './TestimonialsExtra';

type Testimonial = Tables<'testimonials'>;

const TestimonialsAdmin = () => {
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: Omit<Testimonial, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('testimonials').insert(newItem).select().single();
      if (error) throw error;
      return data as Testimonial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({ title: 'Testimonial added', description: 'Testimonial was added successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to add testimonial: ${error.message}`, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: Testimonial) => {
      const { id, ...updates } = item;
      const { data, error } = await supabase.from('testimonials').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Testimonial;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({ title: 'Testimonial updated', description: 'Testimonial has been updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to update testimonial: ${error.message}`, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({ title: 'Deleted', description: 'Testimonial has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to delete testimonial: ${error.message}`, variant: 'destructive' });
    },
  });

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setIsAdding(false);
  };

  const handleReorder = async (updatedTestimonials: Testimonial[]) => {
    try {
      for (const testimonial of updatedTestimonials) {
        await supabase
          .from('testimonials')
          .update({ order: testimonial.order })
          .eq('id', testimonial.id);
      }
  
      toast({
        title: 'Success',
        description: 'Testimonials order updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update testimonials order',
        variant: 'destructive',
      });
    }
  };
  

  const handleAdd = () => {
    const newItem: Testimonial = {
      id: '',
      quote: '',
      author: '',
      position: '',
      company: '',
      imageurl: '',
      created_at: '',
      order: testimonials.length
    };
    setEditingItem(newItem);
    setIsAdding(true);
  };

  const handleSave = (item: Testimonial) => {
    if (isAdding) {
      const { id, created_at, ...newItem } = item;
      createMutation.mutate(newItem);
    } else {
      updateMutation.mutate(item);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading testimonials. Please try again later.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials Management</h1>
          <p className="text-gray-400">Add, edit, or remove testimonials shown on the site</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add Testimonial
        </Button>
      </div>

      {editingItem && (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? 'Add New Testimonial' : 'Edit Testimonial'}
          </h2>

          <TestimonialForm
            isAdding={isAdding}
            editingItem={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Card>
      )}

      {testimonials.length > 0 ? (
        <TestimonialList
          testimonials={testimonials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      ) : (
        <Card className="glass-card p-6 text-center">
          <p className="text-gray-400">No testimonials found. Add your first one to get started.</p>
        </Card>
      )}
    </div>
  );
};

export default TestimonialsAdmin;
