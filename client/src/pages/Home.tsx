import { useState } from "react";
import Canvas from "@/components/Canvas";
import ControlPanel from "@/components/ControlPanel";
import StringTester from "@/components/StringTester";
import Header from "@/components/Header";

export default function Home() {
  const [states, setStates] = useState<Array<{id: string; x: number; y: number; label: string; isAccepting: boolean}>>([]);
  const [transitions, setTransitions] = useState<Array<{from: string; to: string; label: string}>>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [machineType, setMachineType] = useState<"dfa" | "nfa">("dfa");

  const addState = (x: number, y: number) => {
    const newState = {
      id: `q${states.length}`,
      x,
      y,
      label: `q${states.length}`,
      isAccepting: false,
    };
    setStates([...states, newState]);
  };

  const updateState = (id: string, updates: Partial<typeof states[0]>) => {
    setStates(states.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteState = (id: string) => {
    setStates(states.filter(s => s.id !== id));
    setTransitions(transitions.filter(t => t.from !== id && t.to !== id));
  };

  const addTransition = (from: string, to: string, label: string) => {
    setTransitions([...transitions, { from, to, label }]);
  };

  const deleteTransition = (index: number) => {
    setTransitions(transitions.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setStates([]);
    setTransitions([]);
    setSelectedState(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      <Header machineType={machineType} setMachineType={setMachineType} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Panel */}
        <div className="flex-1 bg-white border-r border-border">
          <Canvas
            states={states}
            transitions={transitions}
            selectedState={selectedState}
            onStateClick={setSelectedState}
            onCanvasClick={addState}
            machineType={machineType}
          />
        </div>

        {/* Control Panel */}
        <div className="w-96 bg-card border-l border-border overflow-y-auto flex flex-col">
          <ControlPanel
            states={states}
            transitions={transitions}
            selectedState={selectedState}
            onUpdateState={updateState}
            onDeleteState={deleteState}
            onAddTransition={addTransition}
            onDeleteTransition={deleteTransition}
            onClearAll={clearAll}
            machineType={machineType}
          />
          
          <div className="border-t border-border">
            <StringTester
              states={states}
              transitions={transitions}
              machineType={machineType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
