# Civilization Tier Design System

## The Philosophy

Finding life (basic design) is common. Finding **civilization** (advanced/sophisticated design) requires intentional complexity.

The system uses a **14-tier biological model**: 8 ecosystem tiers (0.00–0.80) where organisms scale from zero to a full fauna, then 6 civilization tiers (0.81–1.00) where CivilizationGenerator activates and architecture emerges from the ecosystem.

---

## Probability Mechanics (The Fermi Solution)

Intent-driven complexity injection — not pure randomness:

```
Base Complexity = f(traits)               // 0.0–0.6 (normal range)
Intent Multiplier = g(intent_keywords)    // 1.0–1.5x (capped keyword boost)
Sophistication Bonus = h(context)         // +0.0–0.3

Final Complexity = min(1.0, Base × Multiplier + Bonus)
```

### Intent Keywords That Boost Complexity:
- `dashboard`, `platform`, `system`, `suite` → +0.18–0.20
- `3d`, `immersive`, `spatial`, `webgl` → +0.15–0.18
- `data visualization`, `real-time`, `live` → +0.15–0.19
- `animation`, `motion`, `physics`, `spring` → +0.10–0.12
- `multiplayer`, `collaborative`, `social` → +0.11–0.14

### Context Sophistication Scoring:
- Length > 100 chars → +0.05
- Mentions multiple user types → +0.05
- Specifies technical constraints → +0.05
- References design systems/patterns → +0.05
- Mentions accessibility requirements → +0.05
- Specifies performance needs → +0.05

---

## 14-Tier Biological Model

### Ecosystem Tiers (0.00–0.80) — EcosystemGenerator

| Tier | Range | Organisms |
|------|-------|-----------|
| `abiotic` | 0.00–0.10 | 0 — no life, HTML/CSS only |
| `prokaryotic` | 0.11–0.22 | First microbial organisms |
| `protist` | 0.23–0.33 | Microbial + basic interaction states |
| `bryophyte` | 0.34–0.44 | Microbial + first flora containers |
| `vascular_flora` | 0.45–0.56 | Growing flora, stateful components |
| `invertebrate_fauna` | 0.57–0.65 | First fauna organisms emerge |
| `ectotherm_fauna` | 0.66–0.73 | Complex data-dense organisms |
| `endotherm_fauna` | 0.74–0.80 | All 32 chromosomes active, max organism count |

Organism counts scale from 0 (abiotic) to ~38 max (endotherm_fauna). No hardcoded ranges.

### Civilization Tiers (0.81–1.00) — CivilizationGenerator

Civilization **always emerges from an ecosystem**. CivilizationGenerator activates at complexity ≥ 0.81.

---

## Civilization Tier Specs

Each tier progressively expands the allowed values for ch30 (`stateTopology`), ch31 (`routingPattern`), and ch32 (`tokenInheritance`). The chromosome biases within the tier's allowed set — it doesn't override tier constraints.

### Tier 1: Tribal (0.81–0.86)
**First civilization — shared resources, simple governance**

- State: `local` (useState per-component)
- Routing: `single_page` | `multi_page`
- Tokens: `flat` | `semantic`
- Components: 8–12, basic variants
- Animation: sequential

```typescript
architecture: {
  stateTopology: 'local',           // ch30 — capped to ['local']
  routingPattern: 'single_page',    // ch31 — capped to ['single_page','multi_page']
  tokenInheritance: 'flat'          // ch32 — capped to ['flat','semantic']
}
```

---

### Tier 2: City-State (0.87–0.91)
**Organised settlement — governed by rules**

- State: `local` | `shared_context`
- Routing: `single_page` | `multi_page` | `protected`
- Tokens: `flat` | `semantic`
- Components: 15–20, compound patterns
- Keyboard: full navigation, command palette

```typescript
architecture: {
  stateTopology: 'shared_context',  // ch30 — capped to ['local','shared_context']
  routingPattern: 'protected',      // ch31 — capped to ['single_page','multi_page','protected']
  tokenInheritance: 'semantic'      // ch32 — capped to ['flat','semantic']
}
```

---

### Tier 3: Nation-State (0.92–0.94)
**Unified governance — standardised systems**

- State: `local` | `shared_context` | `reactive_store`
- Routing: `multi_page` | `protected` | `platform`
- Tokens: `flat` | `semantic` | `component`
- Components: 25–35, design system
- Tailwind config emitted, WCAG AA

```typescript
architecture: {
  stateTopology: 'reactive_store',  // ch30 — capped to ['local','shared_context','reactive_store']
  routingPattern: 'platform',       // ch31 — capped to ['multi_page','protected','platform']
  tokenInheritance: 'component'     // ch32 — capped to ['flat','semantic','component']
}
```

---

### Tier 4: Empire (0.95–0.96)
**Distributed authority — decentralised but coherent**

- State: `shared_context` | `reactive_store` | `distributed`
- Routing: `protected` | `platform` | `federated`
- Tokens: `semantic` | `component` | `governed`
- Components: 40+, micro-frontend ready

```typescript
architecture: {
  stateTopology: 'distributed',     // Zustand + persist middleware
  routingPattern: 'federated',      // Module Federation routing
  tokenInheritance: 'governed'      // tokens only changed via design system PRs
}
```

---

### Tier 5: Network (0.97–0.98)
**Post-geographic coordination — protocol over geography**

- State: `reactive_store` | `distributed` | `federated`
- Routing: `platform` | `federated`
- Tokens: `component` | `governed` | `cross_system`
- Full Module Federation, cross-app event bus

```typescript
architecture: {
  stateTopology: 'federated',       // cross-app event bus
  routingPattern: 'federated',      // Module Federation routing
  tokenInheritance: 'cross_system'  // tokens published as packages
}
```

---

### Tier 6: Singularity (0.99–1.00)
**Convergence — one living system**

- State: `distributed` | `federated`
- Routing: `platform` | `federated`
- Tokens: `governed` | `cross_system`
- Full federated state + event bus + cross-system token graph

```typescript
architecture: {
  stateTopology: 'federated',
  routingPattern: 'federated',
  tokenInheritance: 'cross_system'
}
```

---

## Architecture Fields (ArchitectureSpec)

```typescript
interface ArchitectureSpec {
  pattern: string;
  modules: number;
  stateTopology: StateTopology;     // ch30: local | shared_context | reactive_store | distributed | federated
  routingPattern: RoutingPattern;   // ch31: single_page | multi_page | protected | platform | federated
  tokenInheritance: TokenInheritance; // ch32: flat | semantic | component | governed | cross_system
}
```

> `stateManagement` and `routing` (old fields) have been removed. All architecture is driven by ch30–ch32.

---

## The Probability Fix

1. **Keyword Detection**: Recognise complexity words in intent
2. **Context Analysis**: Longer, more specific context = higher complexity
3. **Archetype Override**: Choose "platform" or "system" archetype for +0.2 complexity
4. **Explicit Request**: Pass `min_tier: 'tribal'` (or higher) to `generate_civilization` to force minimum tier

Civilization is achievable (not random) but still requires intentional complexity ≥ 0.81.
