
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Portfolio } from '@/lib/supabase';
import { fetchPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/services/databaseService';
import PortfolioForm from './PortfolioForm';
import PortfolioList from './PortfolioList';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PortfolioAdmin = () => {
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch portfolio items from database
  const { data: portfolioItems = [], isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio
  });

  // Create portfolio item mutation
  const createMutation = useMutation({
    mutationFn: createPortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });

  // Update portfolio item mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Portfolio> }) => 
      updatePortfolioItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });

  // Delete portfolio item mutation
  const deleteMutation = useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });

  const handleEdit = (item: Portfolio) => {
    setEditingItem({ ...item });
    setIsAdding(false);
  };

  const handleAdd = () => {
    const newItem = {
      id: `portfolio-${Date.now()}`,
      title: "",
      category: "Web Design",
      imageUrl: "",
      description: "",
      link: ""
    };
    setEditingItem(newItem);
    setIsAdding(true);
  };

  const handleSave = (item: Portfolio) => {
    if (isAdding) {
      createMutation.mutate(item);
    } else {
      updateMutation.mutate({ 
        id: item.id, 
        updates: item 
      });
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const itemToDelete = portfolioItems.find(item => item.id === id);
    
    if (window.confirm(`Are you sure you want to delete "${itemToDelete?.title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      Error loading portfolio items. Please try again later.
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Management</h1>
          <p className="text-gray-400">Add, edit, or remove portfolio items from your website</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </Button>
      </div>

      {editingItem ? (
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAdding ? "Add New Project" : "Edit Project"}
          </h2>
          
          <PortfolioForm 
            isAdding={isAdding}
            editingItem={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Card>
      ) : null}

      <PortfolioList 
        portfolioItems={portfolioItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PortfolioAdmin;
