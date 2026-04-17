import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { generateKeyBetween } from "fractional-indexing";
import { useElementsStore } from "../store/elements";
import { Element } from "../types";
import { SortableRow } from "./SortableRow";

interface Props {
  reorderMode: boolean;
}

export function ElementList({ reorderMode }: Props) {
  const { elements, updateName, deleteElement, reorderElement, moveSpace } =
    useElementsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  const sorted = [...elements].sort((a, b) => {
    const aLevel =
      a.type === "level" ? a : elements.find((e) => e.id === a.levelId);

    const bLevel =
      b.type === "level" ? b : elements.find((e) => e.id === b.levelId);

    if (!aLevel || !bLevel) return 0;
    if (aLevel.id !== bLevel.id)
      return aLevel.order < bLevel.order
        ? -1
        : aLevel.order > bLevel.order
          ? 1
          : 0;
    if (a.type === "level") return -1;
    if (b.type === "level") return 1;
    return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
  });

  function startEdit(el: Element) {
    setEditingId(el.id);
    setEditingName(el.name);
  }

  function confirmEdit() {
    if (editingId && editingName.trim()) {
      updateName(editingId, editingName.trim());
    }
    setEditingId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    //here active stands for the element being dragged and over means the element it gets dropped on
    const { active, over } = event;

    //nothing to be done if element is dropped on an empty space or onto itself.
    if (!over || active.id === over.id) return;

    //here we look up the full ements objects frpm their ids
    const activeEl = elements.find((e) => e.id === active.id);
    const overEl = elements.find((e) => e.id === over.id);
    if (!activeEl || !overEl) return;

    try {
      //in this step the user is dragging the LEVEL and LEVELS only reorder among themselves. Spces are not discussed here.
      if (activeEl.type === "level") {
        //all levels in their current visual order.
        const allLevels = sorted.filter((e) => e.type === "level");

        //the same list but the elemt being dragged removed. we do this it becomes easy to insert between prev and next
        const levelsWithout = allLevels.filter((e) => e.id !== activeEl.id);

        let targetLevel: Element | undefined =
          overEl.type === "level"
            ? overEl
            : elements.find((e) => e.id === overEl.levelId);

        //here we handle an edge case. if the user drops the level onto one of its own children in this case the target level will point back to the dragged level
        if (!targetLevel || targetLevel.id === activeEl.id) {
          const activeIndex = sorted.findIndex((e) => e.id === active.id);
          const overIndex = sorted.findIndex((e) => e.id === over.id);
          const sortedWithout = sorted.filter((e) => e.id !== activeEl.id);
          const overFlatIdx = sortedWithout.findIndex((e) => e.id === over.id);

          if (activeIndex < overIndex) {
            //here we determine that the user is dragging downwards and we look for the next level below the drop point
            targetLevel = sortedWithout
              .slice(overFlatIdx)
              .find((e) => e.type === "level");
          } else {
            //here the user drags upwards and we look for the nearest level AT or Above the target level or hte drop point
            targetLevel = [...sortedWithout]
              .slice(0, overFlatIdx + 1)
              .reverse()
              .find((e) => e.type === "level");
          }
          if (!targetLevel) return;
        }

        //here we decide which side of the target we land on
        const activeIdxInLevels = allLevels.findIndex(
          (e) => e.id === activeEl.id,
        );
        const targetIdxInLevels = allLevels.findIndex(
          (e) => e.id === targetLevel!.id,
        );
        const movingDownInScope = activeIdxInLevels < targetIdxInLevels;

        //here we find the targets position in the list without the element being dragged
        const targetIdx = levelsWithout.findIndex(
          (e) => e.id === targetLevel!.id,
        );

        //picking the two neighbours in which the dragged level should land between
        const prev = movingDownInScope
          ? (levelsWithout[targetIdx] ?? null)
          : (levelsWithout[targetIdx - 1] ?? null);
        const next = movingDownInScope
          ? (levelsWithout[targetIdx + 1] ?? null)
          : (levelsWithout[targetIdx] ?? null);

        //generating a fractional index that fits between the prev and next. This helps prevent renumbering.
        const newOrder = generateKeyBetween(
          prev?.order ?? null,
          next?.order ?? null,
        );
        reorderElement(activeEl.id, newOrder);
      }

      //here now we move towards the dragging of spaces within levels or a space from one level to another one
      else {
        //if dropped on a level header, fit in that level. If dropped on another level's space then that level header
        const targetLevelId =
          overEl.type === "level" ? overEl.id : overEl.levelId;
        if (!targetLevelId) return;

        //did the space changed parents and what store function do we call
        const isCrossLevel = targetLevelId !== activeEl.levelId;

        //all spaces in the level which we are targetting
        const allSpacesInLevel = sorted.filter(
          (e) => e.type === "space" && e.levelId === targetLevelId,
        );

        //same list wihtput the space being dragged (this inly for the same level)
        const spacesWithout = allSpacesInLevel.filter(
          (e) => e.id !== activeEl.id,
        );

        let prev: Element | null;
        let next: Element | null;

        if (overEl.type === "level") {
          //FIRST CASE: dropped on a level header
          prev = null;
          next = spacesWithout[0] ?? null;
        } else if (isCrossLevel) {
          //SECOND CASE: space came from a different level
          const idx = spacesWithout.findIndex((e) => e.id === over.id);
          prev = spacesWithout[idx] ?? null;
          next = spacesWithout[idx + 1] ?? null;
        } else {
          //THIRD CASE: reordering within the same level
          const activeIdxInSpaces = allSpacesInLevel.findIndex(
            (e) => e.id === activeEl.id,
          );
          const overIdxInSpaces = allSpacesInLevel.findIndex(
            (e) => e.id === over.id,
          );
          const movingDownInScope = activeIdxInSpaces < overIdxInSpaces;

          const idx = spacesWithout.findIndex((e) => e.id === over.id);
          prev = movingDownInScope
            ? (spacesWithout[idx] ?? null)
            : (spacesWithout[idx - 1] ?? null);
          next = movingDownInScope
            ? (spacesWithout[idx + 1] ?? null)
            : (spacesWithout[idx] ?? null);
        }

        //one fractional key between the two spaces. same as levels

        const newOrder = generateKeyBetween(
          prev?.order ?? null,
          next?.order ?? null,
        );
        //if the move was across the lvels then we call moveSpace and if it was within the lvel we call reoderElement
        if (isCrossLevel) {
          moveSpace(activeEl.id, targetLevelId, newOrder);
        } else {
          reorderElement(activeEl.id, newOrder);
        }
      }
    } catch (e) {
      console.error("Reorder failed:", e);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sorted.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto">
          {sorted.map((el) => (
            <SortableRow
              key={el.id}
              element={el}
              reorderMode={reorderMode}
              isEditing={editingId === el.id}
              editingName={editingName}
              onEditStart={startEdit}
              onEditChange={setEditingName}
              onEditConfirm={confirmEdit}
              onDelete={deleteElement}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
