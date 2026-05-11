import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface HeaderProps {
  machineType: "dfa" | "nfa";
  setMachineType: (type: "dfa" | "nfa") => void;
}

export default function Header({ machineType, setMachineType }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Mono', monospace" }}>
            DFA/NFA Visualizer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Design and test finite state machines interactively
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Machine Type:</span>
            <ToggleGroup
              type="single"
              value={machineType}
              onValueChange={(value) => {
                if (value) setMachineType(value as "dfa" | "nfa");
              }}
              className="border border-border rounded-lg"
            >
              <ToggleGroupItem
                value="dfa"
                aria-label="DFA"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                DFA
              </ToggleGroupItem>
              <ToggleGroupItem
                value="nfa"
                aria-label="NFA"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                NFA
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://manus.im", "_blank")}
          >
            Learn More
          </Button>
        </div>
      </div>
    </header>
  );
}
