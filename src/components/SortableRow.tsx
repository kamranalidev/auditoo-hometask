import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Element } from "../types";

interface Props {
  element: Element;
  isEditing: boolean;
  editingName: string;
  onEditStart: (el: Element) => void;
  onEditChange: (name: string) => void;
  onEditConfirm: () => void;
  onDelete: (id: string) => void;
  reorderMode: boolean;
}

export function SortableRow({
  element,
  isEditing,
  editingName,
  onEditStart,
  onEditChange,
  onEditConfirm,
  onDelete,
  reorderMode,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    height: "56px",
    borderColor: "#F2F2F7",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-4 border-b bg-white"
    >
      {reorderMode && (
        <button
          className="mr-3 touch-none cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} className="text-gray-400" />
        </button>
      )}

      {isEditing ? (
        <Input
          value={editingName}
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={onEditConfirm}
          onKeyDown={(e) => e.key === "Enter" && onEditConfirm()}
          className="flex-1 h-8 text-sm mr-4"
          autoFocus
        />
      ) : (
        <span
          className={`text-sm flex-1 ${element.type === "level" ? "font-semibold" : "font-normal"}`}
        >
          {element.name}
        </span>
      )}

      {!reorderMode && !isEditing && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditStart(element)}
          >
            <Pencil size={15} className="text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(element.id)}
          >
            <Trash2 size={15} color="#F04438" />
          </Button>
        </div>
      )}
    </div>
  );
}
