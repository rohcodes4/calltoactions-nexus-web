
import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string | number;
  children: React.ReactNode;
  style?: CSSProperties;
}

const SortableItem = ({ id, children, style }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: id.toString() }); // Convert id to string to fix TS error

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...style
  };

  return (
    <div ref={setNodeRef} style={itemStyle} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableItem;
