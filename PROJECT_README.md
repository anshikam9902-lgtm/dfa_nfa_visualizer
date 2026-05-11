# DFA/NFA Visualizer - Interactive State Machine Designer

A modern, interactive web application for designing and testing Deterministic Finite Automata (DFA) and Non-deterministic Finite Automata (NFA) state machines. Perfect for learning automata theory, compiler design, and formal languages.

## Features

### Core Functionality
- **Interactive Canvas**: Drag-and-drop interface for creating states and transitions
- **DFA & NFA Support**: Toggle between deterministic and non-deterministic modes
- **State Management**: Add, edit, delete, and configure states with accepting state markers
- **Transition Editor**: Create labeled transitions between states with support for epsilon (ε) transitions in NFA mode
- **String Testing**: Test if input strings are accepted or rejected by your automaton
- **Real-time Feedback**: Visual feedback for state selection, transitions, and test results

### Design Philosophy
The interface follows **Modern Technical Minimalism** with:
- Clean, spacious layout with a soft slate and cyan color scheme
- Asymmetric split-screen design (Canvas on left, Controls on right)
- Smooth animations and transitions for interactive feedback
- Monospace typography for technical authenticity
- High contrast and accessibility-focused design

## Getting Started

### Adding States
1. Click anywhere on the canvas to add a new state
2. States are automatically labeled (q0, q1, q2, etc.)
3. Click on a state to select it and modify its properties
4. Mark states as "Accepting" using the checkbox in the State Details panel

### Creating Transitions
1. Select a "From" state and "To" state from the dropdowns
2. Enter a symbol (a, b, ε, etc.)
3. Click "Add Transition" to create the connection
4. Transitions appear as curved dashed lines on the canvas

### Testing Strings
1. Enter an input string in the "Test String" field (e.g., "aabb")
2. Click the Play button or press Enter
3. The app will show whether the string is accepted or rejected
4. For DFA: Shows the exact path taken through the machine
5. For NFA: Shows if any valid path leads to an accepting state

## Machine Types

### DFA (Deterministic Finite Automata)
- Each state has exactly one transition per input symbol
- No epsilon transitions
- Deterministic path through the machine
- Faster execution, more states typically required

### NFA (Non-deterministic Finite Automata)
- States can have multiple transitions for the same symbol
- Supports epsilon (ε) transitions for state changes without input
- Explores all possible paths simultaneously
- More compact representation, easier to design

## User Interface

### Header
- **Machine Type Toggle**: Switch between DFA and NFA modes
- **Learn More**: Link to educational resources

### Canvas Panel (Left)
- Grid background for visual reference
- Interactive state nodes with labels
- Curved transition arrows with labels
- Hover effects for better visibility

### Control Panel (Right)
- **States Section**: List of all states with quick access
- **State Details**: Edit selected state properties
- **Transitions Section**: Manage all transitions
- **Add Transition**: Form to create new transitions
- **Clear All**: Reset the entire machine

### Test String Panel (Bottom)
- Input field for test strings
- Play button to execute test
- Results display with acceptance status
- Detailed path information

## Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Primary Accent | #00d9ff (Cyan) | Active states, buttons, highlights |
| Background | #f0f4f8 (Light Gray) | Canvas and main background |
| Foreground | #1a1f36 (Deep Slate) | Text and structure |
| Secondary | #8b92a9 (Muted Gray) | Borders, transitions, inactive elements |
| Destructive | #ff4757 (Red) | Errors, delete actions |
| Accepting State | Double circle | Visual indicator for accepting states |

## Keyboard Shortcuts
- **Enter**: Test the current string
- **Click**: Select state or add new state
- **Delete**: Remove selected state (via button)

## Technical Stack
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with custom theme
- **Animation**: Framer Motion for smooth transitions
- **Canvas**: HTML5 Canvas for state machine visualization
- **UI Components**: shadcn/ui for consistent design

## Tips for Effective Design

### DFA Design
1. Start with the start state (q0)
2. Define all transitions for each symbol
3. Mark accepting states clearly
4. Test with various input strings

### NFA Design
1. Use epsilon transitions to simplify complex logic
2. Leverage multiple transitions for the same symbol
3. Design intuitively without worrying about determinism
4. Test to verify your logic before converting to DFA

## Example: Binary String Ending with "01"

### DFA Approach
1. Create states: q0 (start), q1 (saw 0), q2 (saw 01, accepting)
2. From q0: on '0' → q1, on '1' → q0
3. From q1: on '0' → q1, on '1' → q2
4. From q2: on '0' → q1, on '1' → q0
5. Mark q2 as accepting

### Test Cases
- "01" → Accepted ✓
- "001" → Accepted ✓
- "0011" → Rejected ✓
- "10" → Rejected ✓

## Learning Resources
- [Automata Theory Basics](https://en.wikipedia.org/wiki/Finite-state_machine)
- [DFA vs NFA Comparison](https://www.geeksforgeeks.org/difference-between-dfa-and-nfa/)
- [Formal Languages and Automata](https://www.coursera.org/learn/formal-languages-automata)

## Browser Compatibility
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### States not appearing
- Ensure you're clicking on the canvas, not outside it
- Check that states aren't overlapping (minimum 100px distance)

### Transitions not working
- Verify both "From" and "To" states are selected
- Ensure the symbol field is not empty
- For DFA, check that no duplicate transitions exist

### String testing shows errors
- Verify the start state is q0 (the first state created)
- Check that all required transitions are defined
- For DFA, ensure no missing transitions

## Future Enhancements
- Visual NFA to DFA conversion tool
- Export/import automata definitions (JSON)
- Regex pattern to NFA converter
- Step-by-step path visualization
- Minimization algorithms for DFA
- Performance metrics and analysis

---

**Created with ❤️ for automata enthusiasts and computer science students**

For feedback or suggestions, please reach out!
