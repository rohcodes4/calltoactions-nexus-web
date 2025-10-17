import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Pencil, GripVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Testimonial = Tables<'testimonials'>;

const TestimonialForm = ({
  editingItem,
  isAdding,
  onSave,
  onCancel
}: {
  editingItem: Testimonial;
  isAdding: boolean;
  onSave: (item: Testimonial) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Testimonial>(editingItem);

  const handleChange = (field: keyof Testimonial, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Testimonial quote"
        value={formData.quote || ''}
        onChange={(e) => handleChange('quote', e.target.value)}
        required
      />
      <Input
        placeholder="Author"
        value={formData.author || ''}
        onChange={(e) => handleChange('author', e.target.value)}
        required
      />
      <Input
        placeholder="Position"
        value={formData.position || ''}
        onChange={(e) => handleChange('position', e.target.value)}
      />
      <Input
        placeholder="Company"
        value={formData.company || ''}
        onChange={(e) => handleChange('company', e.target.value)}
        required
      />
      <Input
        placeholder="Image URL (optional)"
        value={formData.imageurl || ''}
        onChange={(e) => handleChange('imageurl', e.target.value)}
      />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{isAdding ? 'Add' : 'Update'} Testimonial</Button>
      </div>
    </form>
  );
};

const SortableItem = ({ testimonial, onEdit, onDelete }: { testimonial: Testimonial; onEdit: (item: Testimonial) => void; onDelete: (id: string) => void; }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: testimonial.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} className="p-4 flex justify-between items-start">
      <div className="flex items-start gap-4 w-full">
        <div {...listeners} className="cursor-move pt-1">
          <GripVertical className="text-gray-400" />
        </div>
        <div className="flex-grow">
          <p className="text-white italic">"{testimonial.quote}"</p>
          <p className="text-sm text-gray-300 mt-2">
            — {testimonial.author}{testimonial.position && `, ${testimonial.position}`}, {testimonial.company}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => onEdit(testimonial)} size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => onDelete(testimonial.id)} size="icon">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const TestimonialList = ({
  testimonials,
  onEdit,
  onDelete,
  onReorder
}: {
  testimonials: Testimonial[];
  onEdit: (item: Testimonial) => void;
  onDelete: (id: string) => void;
  onReorder: (updated: Testimonial[]) => void;
}) => {
  const [items, setItems] = useState(
  [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({ ...item, order: index }));
      setItems(newItems);
      onReorder(newItems);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map((testimonial) => (
            <SortableItem
              key={testimonial.id}
              testimonial={testimonial}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export { TestimonialForm, TestimonialList };
