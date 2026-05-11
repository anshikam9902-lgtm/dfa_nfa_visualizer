import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, CheckCircle, XCircle } from "lucide-react";
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

interface StringTesterProps {
  states: State[];
  transitions: Transition[];
  machineType: "dfa" | "nfa";
}

interface TestResult {
  accepted: boolean;
  path: string[];
  message: string;
}

export default function StringTester({
  states,
  transitions,
  machineType,
}: StringTesterProps) {
  const [testString, setTestString] = useState<string>("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testString_DFA = (input: string): TestResult => {
    if (states.length === 0) {
      return { accepted: false, path: [], message: "No states defined" };
    }

    // Find start state (first state)
    const startState = states[0];
    let currentState = startState.id;
    const path = [currentState];

    for (const symbol of input) {
      const transition = transitions.find(
        (t) => t.from === currentState && t.label === symbol
      );

      if (!transition) {
        return {
          accepted: false,
          path,
          message: `No transition from ${states.find((s) => s.id === currentState)?.label} on symbol '${symbol}'`,
        };
      }

      currentState = transition.to;
      path.push(currentState);
    }

    const finalState = states.find((s) => s.id === currentState);
    const accepted = finalState?.isAccepting ?? false;

    return {
      accepted,
      path,
      message: accepted
        ? `String accepted! Path: ${path.map((id) => states.find((s) => s.id === id)?.label).join(" → ")}`
        : `String rejected. Final state ${finalState?.label} is not accepting.`,
    };
  };

  const testString_NFA = (input: string): TestResult => {
    if (states.length === 0) {
      return { accepted: false, path: [], message: "No states defined" };
    }

    // For NFA, we need to explore all possible paths
    const startState = states[0];
    let currentStates = new Set([startState.id]);
    const path = [startState.id];

    for (const symbol of input) {
      const nextStates = new Set<string>();

      for (const state of Array.from(currentStates)) {
        const possibleTransitions = transitions.filter(
          (t) => t.from === state && (t.label === symbol || t.label === "ε")
        );

        for (const transition of possibleTransitions) {
          nextStates.add(transition.to);
        }
      }

      if (nextStates.size === 0) {
        return {
          accepted: false,
          path,
          message: `No valid transitions for symbol '${symbol}'`,
        };
      }

      currentStates = nextStates;
      path.push(...Array.from(currentStates));
    }

    // Check if any final state is accepting
    const accepted = Array.from(currentStates).some(
      (stateId) => states.find((s) => s.id === stateId)?.isAccepting
    );

    return {
      accepted,
      path,
      message: accepted
        ? `String accepted! One or more paths lead to accepting states.`
        : `String rejected. No path leads to an accepting state.`,
    };
  };

  const handleTest = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const testResult =
      machineType === "dfa"
        ? testString_DFA(testString)
        : testString_NFA(testString);

    setResult(testResult);
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Space Mono', monospace" }}>
        Test String
      </h2>

      <div>
        <Label className="text-sm">Input String</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="e.g., aabb"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTest()}
            className="flex-1"
          />
          <Button
            onClick={handleTest}
            disabled={isLoading || states.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border-2 ${
              result.accepted
                ? "border-green-500/30 bg-green-50 dark:bg-green-950/20"
                : "border-destructive/30 bg-destructive/5"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.accepted ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    result.accepted ? "text-green-700 dark:text-green-400" : "text-destructive"
                  }`}
                >
                  {result.accepted ? "Accepted" : "Rejected"}
                </p>
                <p className="text-sm text-foreground/80 mt-1">{result.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {states.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Add states and transitions to test strings
        </p>
      )}
    </div>
  );
}
