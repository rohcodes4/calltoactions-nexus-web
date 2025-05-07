
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { Portfolio } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableItem from '../SortableItem';
import { useToast } from '@/components/ui/use-toast';

interface PortfolioListProps {
  portfolioItems: Portfolio[];
  onEdit: (item: Portfolio) => void;
  onDelete: (id: string) => void;
  onReorder: (newOrder: Portfolio[]) => void;
}

const PortfolioList = ({ portfolioItems, onEdit, onDelete, onReorder }: PortfolioListProps) => {
  const [items, setItems] = useState<Portfolio[]>(portfolioItems);
  const { toast } = useToast();

  // Update local items when portfolioItems change from parent
  useEffect(() => {
    setItems(portfolioItems);
  }, [portfolioItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setItems(newOrder);
        
        try {
          // Make sure we have all required fields before passing to onReorder
          const completeItems = newOrder.map(item => ({
            ...item,
            // Ensure these required fields are never null
            title: item.title || "",
            category: item.category || "",
            description: item.description || "",
            imageUrl: item.imageUrl || "",
            link: item.link || ""
          }));
          onReorder(completeItems);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to reorder items. Please try again.",
            variant: "destructive"
          });
          console.error("Error in handleDragEnd:", error);
        }
      }
    }
  };

  // Update local items when portfolioItems change
  if (JSON.stringify(portfolioItems) !== JSON.stringify(items)) {
    setItems(portfolioItems);
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <SortableItem key={item.id} id={item.id}>
                <Card className="glass-card overflow-hidden relative">
                  <div className="absolute top-2 left-2 z-10 cursor-grab">
                    <GripVertical className="text-white/60 hover:text-white" />
                  </div>
                  <div className="h-48 relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
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
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {items.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No portfolio items available. Add your first project to get started.
        </div>
      )}
    </div>
  );
};

export default PortfolioList;
