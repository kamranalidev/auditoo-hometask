import { useRef, useEffect, useState } from "react";
import { Element } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  levels: Element[];
  onAdd: (name: string, type: "level" | "space", levelId?: string) => void;
  onCancel: () => void;
}

export function AddForm({ levels, onAdd, onCancel }: Props) {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"level" | "space">("space");
  const [newLevelId, setNewLevelId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleAdd() {
    if (!newName.trim()) return;
    if (newType === "space" && !newLevelId) return;
    onAdd(newName.trim(), newType, newLevelId || undefined);
    setNewName("");
  }

  return (
    <div
      className="px-4 py-4 border-t"
      style={{ backgroundColor: "#F9FAFB", borderColor: "#D0D5DD" }}
    >
      <div className="flex gap-2 mb-3">
        <Button
          onClick={() => setNewType("level")}
          className="flex-1 py-2 text-sm rounded-lg border transition-colors"
          style={{
            backgroundColor: newType === "level" ? "#000" : "#fff",
            color: newType === "level" ? "#fff" : "#374151",
            borderColor: newType === "level" ? "#000" : "#D0D5DD",
          }}
        >
          Niveau
        </Button>
        <Button
          onClick={() => setNewType("space")}
          className="flex-1 py-2 text-sm rounded-lg border transition-colors"
          style={{
            backgroundColor: newType === "space" ? "#000" : "#fff",
            color: newType === "space" ? "#fff" : "#374151",
            borderColor: newType === "space" ? "#000" : "#D0D5DD",
          }}
        >
          Espace
        </Button>
      </div>

      {/* Level selector for spaces */}
      {newType === "space" && (
        <select
          value={newLevelId}
          onChange={(e) => setNewLevelId(e.target.value)}
          className="w-full mb-3 px-3 py-2 text-sm border rounded-lg outline-none bg-white"
          style={{ borderColor: "#D0D5DD" }}
        >
          <option value="">Choisir un niveau</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      )}

      {/* Name input + add button */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={
            newType === "level" ? "Nom du niveau" : "Nom de l'espace"
          }
          className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none bg-white"
          style={{ borderColor: "#D0D5DD", fontSize: "16px" }}
        />
        <Button
          onClick={handleAdd}
          className="px-4 py-2 text-sm rounded-lg text-white font-medium"
          style={{ backgroundColor: "#17B26A" }}
        >
          Ajouter
        </Button>
      </div>

      <Button
        onClick={onCancel}
        className="w-full mt-2 py-2 text-sm text-gray-500"
      >
        Annuler
      </Button>
    </div>
  );
}
