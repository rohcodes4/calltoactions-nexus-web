
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/SortableItem";

type ClientLogo = Tables<'client_logos'>;

interface Props {
  clientLogos: ClientLogo[];
  onEdit: (item: ClientLogo) => void;
  onDelete: (id: string) => void;
  onReorder: (updatedOrder: ClientLogo[]) => void;
}

const ClientLogoList = ({ clientLogos, onEdit, onDelete, onReorder }: Props) => {
  const [items, setItems] = useState(clientLogos);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over?.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);
      onReorder(newOrder.map((item, index) => ({ ...item, order: index })));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {items.map((logo) => (
            <SortableItem key={logo.id} id={logo.id}>
              <div className="flex justify-between items-center bg-agency-dark p-4 rounded-md">
                <div className="flex items-center gap-4">
                  <GripVertical className="cursor-grab text-gray-400" />
                  <img src={logo.image_url} alt={logo.name} className="h-10 max-w-[120px] object-contain" />
                  <span className="text-white">{logo.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => onEdit(logo)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" onClick={() => onDelete(logo.id)}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ClientLogoList;
