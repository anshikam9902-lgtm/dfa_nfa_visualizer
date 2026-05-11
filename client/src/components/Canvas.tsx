import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

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

interface CanvasProps {
  states: State[];
  transitions: Transition[];
  selectedState: string | null;
  onStateClick: (id: string) => void;
  onCanvasClick: (x: number, y: number) => void;
  machineType: "dfa" | "nfa";
}

const STATE_RADIUS = 30;

export default function Canvas({
  states,
  transitions,
  selectedState,
  onStateClick,
  onCanvasClick,
  machineType,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [animatingPath, setAnimatingPath] = useState<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = "#f0f4f8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#e8ecf1";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw transitions
    transitions.forEach((transition) => {
      const fromState = states.find((s) => s.id === transition.from);
      const toState = states.find((s) => s.id === transition.to);

      if (!fromState || !toState) return;

      const isAnimating = animatingPath.includes(`${transition.from}-${transition.to}`);

      // Draw arrow
      const dx = toState.x - fromState.x;
      const dy = toState.y - fromState.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > STATE_RADIUS * 2) {
        const startX = fromState.x + (dx / distance) * STATE_RADIUS;
        const startY = fromState.y + (dy / distance) * STATE_RADIUS;
        const endX = toState.x - (dx / distance) * STATE_RADIUS;
        const endY = toState.y - (dy / distance) * STATE_RADIUS;

        ctx.strokeStyle = isAnimating ? "#00d9ff" : "#8b92a9";
        ctx.lineWidth = isAnimating ? 3 : 2;
        ctx.setLineDash(isAnimating ? [] : [5, 5]);

        // Draw curved line
        const controlX = (startX + endX) / 2 + dy * 0.2;
        const controlY = (startY + endY) / 2 - dx * 0.2;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrowhead
        const angle = Math.atan2(endY - controlY, endX - controlX);
        const arrowSize = 12;
        ctx.fillStyle = isAnimating ? "#00d9ff" : "#8b92a9";
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        // Draw label
        const labelX = controlX + 15;
        const labelY = controlY - 15;
        ctx.fillStyle = "#1a1f36";
        ctx.font = "12px 'Space Mono'";
        ctx.textAlign = "center";
        ctx.fillText(transition.label, labelX, labelY);
      }
    });

    // Draw states
    states.forEach((state) => {
      const isSelected = selectedState === state.id;
      const isHovered = hoveredState === state.id;

      // Draw state circle
      ctx.fillStyle = isSelected ? "#00d9ff" : isHovered ? "#e8ecf1" : "#ffffff";
      ctx.strokeStyle = isSelected ? "#00d9ff" : "#1a1f36";
      ctx.lineWidth = isSelected ? 3 : state.isAccepting ? 3 : 2;

      ctx.beginPath();
      ctx.arc(state.x, state.y, STATE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw accepting state indicator (double circle)
      if (state.isAccepting) {
        ctx.strokeStyle = "#1a1f36";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(state.x, state.y, STATE_RADIUS - 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw label
      ctx.fillStyle = "#1a1f36";
      ctx.font = "bold 14px 'Space Mono'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.label, state.x, state.y);
    });
  }, [states, transitions, selectedState, hoveredState, animatingPath]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a state
    let clickedState = false;
    for (const state of states) {
      const distance = Math.sqrt((x - state.x) ** 2 + (y - state.y) ** 2);
      if (distance <= STATE_RADIUS) {
        onStateClick(state.id);
        clickedState = true;
        break;
      }
    }

    // If not clicking on a state, add new state (with minimum distance check)
    if (!clickedState) {
      let tooClose = false;
      for (const state of states) {
        const distance = Math.sqrt((x - state.x) ** 2 + (y - state.y) ** 2);
        if (distance < 100) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose || states.length === 0) {
        onCanvasClick(x, y);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hoveredId = null;
    for (const state of states) {
      const distance = Math.sqrt((x - state.x) ** 2 + (y - state.y) ** 2);
      if (distance <= STATE_RADIUS) {
        hoveredId = state.id;
        break;
      }
    }

    setHoveredState(hoveredId);
    canvas.style.cursor = hoveredId ? "pointer" : "crosshair";
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{machineType.toUpperCase()}</span> • Click to add states • Right-click for options
        </p>
      </div>
      <motion.canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="flex-1 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
