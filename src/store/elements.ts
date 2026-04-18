import type { Element } from "../types/index";
import { create } from "zustand";
import { generateId } from "../lib/id";
import { generateKeyBetween } from "fractional-indexing";

interface ElementsStore {
  elements: Element[];
  addLevel: (name: string) => void;
  addSpace: (name: string, levelId: string) => void;
  updateName: (id: string, name: string) => void;
  deleteElement: (id: string) => void;
  reorderElement: (id: string, newOrder: string) => void;
  moveSpace: (id: string, newLevelId: string, newOrder: string) => void;
  setElements: (elements: Element[]) => void;
}

const SEED: Element[] = [
  { id: "Aa1+", name: "Rez-de-chaussée", type: "level", order: "a0" },
  { id: "Bb2/", name: "Entrée", type: "space", levelId: "Aa1+", order: "a0" },
  { id: "Cc3A", name: "Salon", type: "space", levelId: "Aa1+", order: "a1" },
  { id: "Dd4B", name: "1er étage", type: "level", order: "a1" },
  {
    id: "Ee5C",
    name: "Chambre 1",
    type: "space",
    levelId: "Dd4B",
    order: "a0",
  },
];

export const useElementsStore = create<ElementsStore>((set, get) => ({
  elements: SEED,

  addLevel: (name) => {
    const levels = get().elements.filter((e) => e.type === "level");
    const lastOrder = levels.at(-1)?.order ?? null;
    set((s) => ({
      elements: [
        ...s.elements,
        {
          id: generateId(),
          name,
          type: "level",
          order: generateKeyBetween(lastOrder, null),
        },
      ],
    }));
  },

  addSpace: (name, levelId) => {
    const spaces = get().elements.filter(
      (e) => e.type === "space" && e.levelId === levelId,
    );
    const lastOrder = spaces.at(-1)?.order ?? null;
    set((s) => ({
      elements: [
        ...s.elements,
        {
          id: generateId(),
          name,
          type: "space",
          levelId,
          order: generateKeyBetween(lastOrder, null),
        },
      ],
    }));
  },

  updateName: (id, name) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, name } : e)),
    })),

  reorderElement: (id, newOrder) => {
    set((s) => ({
      elements: s.elements.map((e) =>
        e.id === id ? { ...e, order: newOrder } : e,
      ),
    }));
  },
  moveSpace: (id, newLevelId, newOrder) => {
    set((s) => ({
      elements: s.elements.map((e) =>
        e.id === id ? { ...e, levelId: newLevelId, order: newOrder } : e,
      ),
    }));
  },

  deleteElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((e) => e.id !== id && e.levelId !== id),
    })),

  setElements: (elements) => set(() => ({ elements })),
}));
