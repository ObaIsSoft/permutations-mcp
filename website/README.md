# Permutations V2 / V3 Dogfooding Site

This is a Vite/React application built exclusively to test and dogfood the **Permutations MCP Engine**.

**Rules of this UI:**
1. Zero human aesthetic assumptions.
2. The UI code (CSS, spacing, typography, colors, animations, WebGL configurations, and 3D properties) is injected strictly from the generated DNA JSON and output config files of the Engine.
3. Any visual element found here must be mathematically derived from the linguistic prompt and the project context (e.g., "Biological Planetary Adaptation").

Current supported dependencies managed by V3 DNA:
- `tailwindcss` (via `tailwind.config.js`)
- `lucide-react` (with DNA forbidding generic icons based on certain contextual cues)
- `@react-three/fiber` & `@react-three/drei` (Spatial chromosomes)

```bash
npm install
npm run dev
```
