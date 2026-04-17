import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, Plus, ChevronLeft } from "lucide-react";
import { useElementsStore } from "../store/elements";
import { ElementList } from "../components/ElementList";
import { AddForm } from "../components/AddForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { elements, addLevel, addSpace } = useElementsStore();
  const [mode, setMode] = useState<"normal" | "reorder">("normal");
  const [showAdd, setShowAdd] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const levels = elements.filter((e) => e.type === "level");

  function handleAdd(name: string, type: "level" | "space", levelId?: string) {
    if (type === "level") addLevel(name);
    else if (levelId) addSpace(name, levelId);
    setShowAdd(false);
  }

  function handleValider() {
    setMode("normal");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  return (
    <div
      className="flex flex-col bg-white"
      style={{ height: "100dvh", maxWidth: "393px", margin: "0 auto" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: "56px", borderBottom: "1px solid #F2F2F7" }}
      >
        {mode === "reorder" ? (
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-sm font-semibold px-0 hover:bg-transparent"
            onClick={() => setMode("normal")}
            style={{ color: "#17B26A" }}
          >
            <ChevronLeft size={18} color="#17B26A" />
            Éditer ordre des espaces
          </Button>
        ) : (
          <>
            <h1 className="text-sm font-semibold">Éditer niveaux et espaces</h1>
            <Button variant="ghost" size="icon">
              <X size={18} className="text-gray-500" />
            </Button>
          </>
        )}
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="flex justify-center px-4 pt-3 shrink-0">
          <div
            className="flex items-center px-5 py-4 text-sm text-gray-700 bg-white rounded"
            style={{
              width: "361px",
              boxShadow:
                "0 2px 4px -2px rgba(16,24,40,0.06), 0 4px 8px -2px rgba(16,24,40,0.10)",
            }}
          >
            Ordre modifié
          </div>
        </div>
      )}

      {/* List */}
      <ElementList reorderMode={mode === "reorder"} />

      {/* Add form */}
      {showAdd && (
        <AddForm
          levels={levels}
          onAdd={handleAdd}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* Footer */}
      <div
        className="px-4 flex items-center shrink-0"
        style={{
          height: "76px",
          backgroundColor: "#F9FAFB",
          borderTop: "1px solid #D0D5DD",
        }}
      >
        {mode === "normal" ? (
          <div className="flex gap-3 w-full items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdd(!showAdd)}
              className="rounded-full shrink-0"
            >
              <Plus size={18} />
            </Button>
            <Button
              onClick={() => {
                setShowAdd(false);
                setMode("reorder");
              }}
              className="flex-1 text-white rounded-xl"
              style={{ height: "44px", backgroundColor: "#17B26A" }}
            >
              Éditer ordre des espaces
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setMode("normal")}
              className="flex-1 rounded-xl"
              style={{ height: "44px" }}
            >
              Annuler
            </Button>
            <Button
              variant="outline"
              onClick={handleValider}
              className="flex-1 rounded-xl"
              style={{ height: "44px" }}
            >
              Valider
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
