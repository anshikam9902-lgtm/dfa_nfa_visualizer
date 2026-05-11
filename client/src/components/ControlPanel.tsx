import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface State {
  id: string;
  x: number;
  y: number;
  label: string;
  isAccepting: boolean;
}

interface Transition {
  from: string;
  to: string;
  label: string;
}

interface ControlPanelProps {
  states: State[];
  transitions: Transition[];
  selectedState: string | null;
  onUpdateState: (id: string, updates: Partial<State>) => void;
  onDeleteState: (id: string) => void;
  onAddTransition: (from: string, to: string, label: string) => void;
  onDeleteTransition: (index: number) => void;
  onClearAll: () => void;
  machineType: "dfa" | "nfa";
}

export default function ControlPanel({
  states,
  transitions,
  selectedState,
  onUpdateState,
  onDeleteState,
  onAddTransition,
  onDeleteTransition,
  onClearAll,
  machineType,
}: ControlPanelProps) {
  const [newTransitionFrom, setNewTransitionFrom] = useState<string>("");
  const [newTransitionTo, setNewTransitionTo] = useState<string>("");
  const [newTransitionLabel, setNewTransitionLabel] = useState<string>("");

  const selectedStateObj = states.find((s) => s.id === selectedState);

  const handleAddTransition = () => {
    if (newTransitionFrom && newTransitionTo && newTransitionLabel) {
      onAddTransition(newTransitionFrom, newTransitionTo, newTransitionLabel);
      setNewTransitionFrom("");
      setNewTransitionTo("");
      setNewTransitionLabel("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* States Section */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
          States
        </h2>

        <div className="space-y-3 max-h-48 overflow-y-auto">
          <AnimatePresence>
            {states.map((state) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedState === state.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/30 hover:bg-muted/50"
                }`}
                onClick={() => onUpdateState(state.id, {})}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-mono font-semibold text-foreground">{state.label}</p>
                    <p className="text-xs text-muted-foreground">({state.x.toFixed(0)}, {state.y.toFixed(0)})</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteState(state.id);
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {states.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Click on the canvas to add states</p>
        )}
      </div>

      {/* Selected State Details */}
      {selectedStateObj && (
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="text-sm font-semibold text-foreground mb-3">State Details</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Label</Label>
              <Input
                value={selectedStateObj.label}
                onChange={(e) => onUpdateState(selectedStateObj.id, { label: e.target.value })}
                className="mt-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="accepting"
                checked={selectedStateObj.isAccepting}
                onCheckedChange={(checked) =>
                  onUpdateState(selectedStateObj.id, { isAccepting: checked as boolean })
                }
              />
              <Label htmlFor="accepting" className="text-sm cursor-pointer">
                Accepting State
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Transitions Section */}
      <div className="p-6 border-b border-border flex-1 overflow-hidden flex flex-col">
        <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
          Transitions
        </h2>

        <div className="space-y-2 flex-1 overflow-y-auto mb-4">
          <AnimatePresence>
            {transitions.map((transition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-2 rounded bg-muted/30 border border-border flex items-center justify-between text-sm"
              >
                <span className="font-mono">
                  {transition.from} <span className="text-primary">→</span> {transition.to}
                  <span className="text-muted-foreground ml-2">({transition.label})</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTransition(index)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Transition */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">From</Label>
              <select
                value={newTransitionFrom}
                onChange={(e) => setNewTransitionFrom(e.target.value)}
                className="w-full px-2 py-1 rounded border border-border bg-background text-sm"
              >
                <option value="">Select...</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">To</Label>
              <select
                value={newTransitionTo}
                onChange={(e) => setNewTransitionTo(e.target.value)}
                className="w-full px-2 py-1 rounded border border-border bg-background text-sm"
              >
                <option value="">Select...</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Symbol</Label>
            <Input
              placeholder="a, b, ε"
              value={newTransitionLabel}
              onChange={(e) => setNewTransitionLabel(e.target.value)}
              className="text-sm"
            />
          </div>
          <Button
            onClick={handleAddTransition}
            disabled={!newTransitionFrom || !newTransitionTo || !newTransitionLabel}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transition
          </Button>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={onClearAll}
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10 border-destructive"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
