import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import ClientLogoList from './ClientLogoList';
import ClientLogoForm from './ClientLogoForm';

type ClientLogo = Tables<'client_logos'>;

const LogosAdmin = () => {
  const [editingItem, setEditingItem] = useState<ClientLogo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch client logos from database
  const { data: clientLogos = [], isLoading, error } = useQuery({
    queryKey: ['clientLogos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('order');
      
      if (error) throw error;
      return data as ClientLogo[];
    }
  });

  // Create client logo mutation
  const createMutation = useMutation({
    mutationFn: async (newLogo: Omit<ClientLogo, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('client_logos')
        .insert(newLogo)
        .select()
        .single();
      
      if (error) throw error;
      return data as ClientLogo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientLogos'] });
      toast({
        title: "Logo added",
        description: "Client logo has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add logo: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update client logo mutation
  const updateMutation = useMutation({
    mutationFn: async (logo: ClientLogo) => {
      const { id, ...updates } = logo;
      const { data, error } = await supabase
        .from('client_logos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as ClientLogo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientLogos'] });
      toast({
        title: "Logo updated",
        description: "Client logo has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update logo: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete client logo mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientLogos'] });
      toast({
        title: "Logo deleted",
        description: "Client logo has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete logo: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Reorder client logos mutation
  const reorderMutation = useMutation({
    mutationFn: async (logos: ClientLogo[]) => {
      const updates = logos.map((logo, index) => ({
        id: logo.id,
        order: index
      }));
      
      const { error } = await supabase
        .from('client_logos')
        .upsert(updates);
      
      if (error) throw error;
      return logos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientLogos'] });
      toast({
        title: "Order updated",
        description: "Logo order has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateLogosOrder = async (logos) => {
    try {
      // Update each logo individually instead of bulk upsert
      for (const logo of logos) {
        await supabase
          .from('client_logos')
          .update({ order: logo.order })
          .eq('id', logo.id);
      }
      
      toast({
        title: 'Success',
        description: 'Logos order updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating logos order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update logos order',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleEdit = (item: ClientLogo) => {
    setEditingItem(item);
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newItem: ClientLogo = {
      id: '',
      name: "",
      image_url: "",
      order: clientLogos.length,
      created_at: ''
    };
    setEditingItem(newItem);
    setIsAdding(true);
  };

  const handleSave = (item: ClientLogo) => {
    if (isAdding) {
      const { id, created_at, ...newLogo } = item;
      createMutation.mutate(newLogo);
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
    if (window.confirm('Are you sure you want to delete this logo?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleReorder = (updatedLogos: ClientLogo[]) => {
    reorderMutation.mutate(updatedLogos);
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      Error loading client logos. Please try again later.
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Logos Management</h1>
          <p className="text-gray-400">Add, edit, or remove client logos from your website</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add Logo
        </Button>
      </div>

      {editingItem && (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Add New Logo" : "Edit Logo"}
          </h2>
          
          <ClientLogoForm 
            isAdding={isAdding}
            editingItem={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Card>
      )}

      {clientLogos.length > 0 ? (
        <ClientLogoList 
          clientLogos={clientLogos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      ) : (
        <Card className="glass-card p-6 text-center">
          <p className="text-gray-400">No client logos found. Add your first logo to get started.</p>
        </Card>
      )}
    </div>
  );
};

export default LogosAdmin;
