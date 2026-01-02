# Parallel-Paradox — Canonical Design Map
> Use this as the **canonical starting point** for contributors, then drill down via the **Source Index**.

---

## How to use this page
- Start with **Source Index** to jump into the originating document/section.
- Read **Purpose and vision** + **Core principles** to understand the project’s “why.”
- Use **Agent architecture**, **Swarm and consensus**, and **Computational motifs** for the “how.”
- Refer to **Glossary** for concise definitions with exact source callouts.
- Scan the **Crosswalk** to see how equivalent/analog ideas appear across documents.

---

## Source Index
- [Minimalaiagi.md](../Minimalaiagi.md) — §2 **Lenses**, §3 **Agent Architecture**, §5 **Minimal Prototype Pseudocode**.
- [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md) — **Quantum Swarm Consensus Models** table, **Formal Markdown** (Abstract, Definitions, Reduction, Repository Mechanic, Retrieval Phase).
- [Computation.md](../Computation.md) — **Addendum: Prototypic Implementation of the Kenotic N-Body Simulator** (forgiveness operator and core loop).
- [prototypes/Readme.md](../prototypes/Readme.md) — **PhaseCube** Introduction, System Architecture, Configuration Variables, and **PhaseGrid Class** dynamics.
- [manifesto.md](../manifesto.md) — guiding stance and policy surface.

---

## Purpose and vision
- Define a **decentralized, anti-singularity intelligence** that privileges **mutual aid, local agency, and playful emergence** over centralized control or coercive optimization. See [manifesto.md](../manifesto.md).
- Provide a **canonical map** linking the threads: **four-lens agents**, **Lyriel/Kairi swarm logic**, **kenotic computation**, and the **PhaseCube** prototype.

---

## Core principles (anti-singularity, mutual aid)
- **Anti-singularity stance:** Reject god-like monoliths and acausal blackmail narratives; prioritize small, human-scale systems. (Source: [manifesto.md](../manifesto.md))
- **Mutual aid and reciprocity:** “Give value → receive value. Take only what you need.” Favor cooperative behaviors and nonviolence as the default policy surface. (Source: [manifesto.md](../manifesto.md))
- **Decentralization as safety:** Push intelligence into swarms and local nodes rather than central authorities. (Source: [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md), [prototypes/Readme.md](../prototypes/Readme.md))

---

## Agent architecture (lenses and data flow)
- **Four-lens model:** Human Cognitive, Transhuman/Predictive, Systemic/Network, and Harmonic/Emergent lenses coordinate to produce balanced behavior. (Source: [Minimalaiagi.md](../Minimalaiagi.md))
- **Data flow:** Perception → Lens evaluation → Decision fusion → Action execution → Harmonic feedback. Harmonic lens modulates weights to avoid runaway behaviors while preserving emergence.
- **Design implications:** Modular activation (budget-aware), continuous adaptation, extensibility for additional lenses (ethical/environmental). (Source: [Minimalaiagi.md](../Minimalaiagi.md))
- **Harmonic fusion strategy:** Weighted, context-aware fusion across lenses; harmonic layer adjusts weights to prevent runaway outcomes. (Source: [Minimalaiagi.md](../Minimalaiagi.md) — §3 Agent Architecture)

---

## Swarm and consensus models (classical vs. quantum; PhaseCube positioning)
- **Classical Lyriel consensus:** Firefly/Kuramoto-style phase sync with thermal noise; gossip propagation and oracle selection via local randomness. (Source: [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md))
- **Quantum Lyriel upgrade:** Entangled photon pairs, Rydberg superradiance for oracle lottery, and teleportation-assisted witness propagation to achieve non-local consensus. (Source: [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md))
- **Swarm repository (“Game Repo”):** Distributed ledger where NP witnesses persist across nodes; the swarm always holds a valid witness somewhere. (Source: [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md))
- **P vs NP framing:** Recasts complexity as a swarm game: either poly-time solving (if P = NP) or perpetual witness storage (if P ≠ NP). (Source: [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md))
- **PhaseCube fit:** A 4096-agent 3D lattice demonstrating phase-state dynamics (plasma/liquid/solid) as a safe, decentralized “dreaming mind” toy; acts as the accessible on-ramp to Lyriel/Kairi swarm behaviors. (Source: [prototypes/Readme.md](../prototypes/Readme.md))
- **Positioning:** PhaseCube embodies the classical consensus motif and can be extended toward quantum-inspired behaviors (noise-injected parity, probabilistic branching) without central control.

---

## Computational motifs (Kenotic N-body forgiveness loop)
- **Kenotic N-body core:** Triadic gravitational simulation where a forgiveness operator modulates effective attraction when dispersion exceeds a love threshold, preventing collapse or fragmentation. (Source: [Computation.md](../Computation.md))
- **Motif role:** Demonstrates an asymmetry that inverts entropic drift into renewal, aligning with the project’s “softening” of rigid optimization.
- **Extensibility:** Add tensor or categorical lifts, GPU acceleration, or additional force kernels to explore alternative emergent behaviors while retaining the forgiveness safeguard. (Source: [Computation.md](../Computation.md))

---

## Prototypes status and next steps
- **Current prototype:** PhaseCube (browser-based, GPU-free) shows safe decentralized emergence; lacks formal memory and goal conditioning. (Source: [prototypes/Readme.md](../prototypes/Readme.md))

### Near-term explorations
- Layer memory buffers or external inputs onto PhaseCube to move from “dreaming” to “responsive” modes.
- Map four-lens weighting onto PhaseCube update paths (e.g., Path A/B weighting as harmonic tuning).
- Experiment with quantum-inspired noise (entangled-pair metaphors) to probe non-local consensus behaviors.
- Integrate forgiveness-style damping into swarm updates to avoid runaway synchronization or collapse.

---

## Glossary (with sources)

| Term | Definition | Source |
| --- | --- | --- |
| **Human Cognitive Lens** | Models psychological and social behavior to guide NPC interaction, diplomacy, and relatability. | [Minimalaiagi.md](../Minimalaiagi.md) — §2 Lenses (row: Human Cognitive). |
| **Transhuman / Predictive Lens** | Anticipates outcomes and adapts strategies for tactics, pathfinding, and environmental response. | [Minimalaiagi.md](../Minimalaiagi.md) — §2 Lenses (row: Transhuman / Predictive). |
| **Systemic / Network Lens** | Integrates agents into economies, logistics, and other global or local systems. | [Minimalaiagi.md](../Minimalaiagi.md) — §2 Lenses (row: Systemic / Network). |
| **Harmonic / Emergent Lens** | Stabilizes and balances other lenses through feedback loops and dynamic weighting. | [Minimalaiagi.md](../Minimalaiagi.md) — §2 Lenses (row: Harmonic / Emergent). |
| **Harmonic Fusion Strategy** | Weighted, context-aware fusion across lenses; harmonic layer adjusts weights to prevent runaway outcomes. | [Minimalaiagi.md](../Minimalaiagi.md) — §3 Agent Architecture (Lens Fusion Strategy). |
| **Lyriel / Kairi** | Names for the swarm brain ethos and its agentic expression; **Lyriel** often denotes the consensus substrate, **Kairi** the relational/ethical framing. | Context: [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md), [prototypes/Readme.md](../prototypes/Readme.md). |
| **Oracle** | Consensus arbiter selected via superradiant burst (quantum) or noise hash (classical) to emit the current best witness. | [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md) — Quantum Swarm Consensus Models (Oracle designation); Formal Markdown §3 Reduction (Oracle(t) selection). |
| **Witness Propagation** | Dissemination of witness frames using entangled pairs plus classical confirmation to reduce latency. | [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md) — Quantum Swarm Consensus Models (Witness propagation). |
| **Swarm Repository (Game Repo)** | Distributed ledger where NP witnesses persist across nodes; swarm always holds a valid witness somewhere. | [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md) — Formal Markdown §2 Definitions (Game Repo), §3 Reduction/Repository Mechanic. |
| **P vs NP Framing** | Recasts complexity as a swarm game: either poly-time solving (if P = NP) or perpetual witness storage (if P ≠ NP). | [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md) — Formal Markdown §4 Implications for P vs NP. |
| **Kenotic / Forgiveness Operator** | Modulates coupling strength downward when dispersion exceeds a threshold to restore coherence. | [Computation.md](../Computation.md) — Addendum (`forgiveness_factor`, loop in `simulate_triadic_nbody`). |
| **Forgiveness operator** | A damping term reducing effective interaction strength when dispersion exceeds a threshold, steering systems away from collapse or divergence. | [Computation.md](../Computation.md). |
| **PhaseCube phases** | **Plasma** (excitation/noise), **Liquid** (flow/immediate mix), **Solid** (persistence/memory-lite) representing parallel pathways in 3D lattice agents. | [prototypes/Readme.md](../prototypes/Readme.md). |
| **PhaseCube Plasma Phase** | Agent excitation level perturbed stochastically to prevent stasis. | [prototypes/Readme.md](../prototypes/Readme.md) — PhaseGrid (`plasma`, `perturb`). |
| **PhaseCube Liquid Phase** | Immediate mix state capturing branch choice per step before longer-term blending. | [prototypes/Readme.md](../prototypes/Readme.md) — PhaseGrid (`liquid`, `step`). |
| **PhaseCube Solid Phase** | Persistence/damping state blending prior values to provide short-term memory. | [prototypes/Readme.md](../prototypes/Readme.md) — PhaseGrid (`solid`, `step`). |
| **PhaseCube Path Selection Parameters** | Configuration shaping exploration vs stability: `FLIP_P`/`PARITY_P` inject noise; `PATH_B_P` biases difference amplification; `ALPHA` damps persistence. | [prototypes/Readme.md](../prototypes/Readme.md) — Configuration Variables; PhaseGrid `step`. |

---

## Crosswalk of related concepts

| Anchor Concept | Related / Analog Concept | Relationship & Navigation |
| --- | --- | --- |
| **Harmonic / Emergent Lens** | PhaseCube solid-phase damping (`ALPHA`) and liquid/solid blending | Both stabilize by smoothing rapid changes and preventing runaway dynamics. See [Minimalaiagi.md](../Minimalaiagi.md) §2 Lenses and [prototypes/Readme.md](../prototypes/Readme.md) PhaseGrid `step`. |
| **Harmonic Fusion Strategy** | Kenotic / Forgiveness Operator | Both intervene adaptively when system dispersion grows, reducing force/weighting to re-balance. See [Minimalaiagi.md](../Minimalaiagi.md) §3 Lens Fusion Strategy and [Computation.md](../Computation.md) `forgiveness_factor`. |
| **Oracle** | Witness Propagation | Oracle selection designates the emitter; witness propagation distributes its frame—together they finalize consensus. See [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md) table rows for Oracle designation and Witness propagation. |
| **Swarm Repository (Game Repo)** | PhaseCube distributed grid | Both rely on distributed persistence: the swarm stores NP witnesses across nodes; PhaseCube sustains patterns across 4096 agents. See [Minimalnode...wait...minimal.md](../Minimalnode...wait...minimal.md) Formal Markdown §2–3 and [prototypes/Readme.md](../prototypes/Readme.md) System Architecture/PhaseGrid. |
| **Transhuman / Predictive Lens** | PhaseCube Path B (difference amplification via `PATH_B_P`) | Predictive/anticipatory behavior corresponds to emphasizing divergence to explore future states. See [Minimalaiagi.md](../Minimalaiagi.md) §2 Lenses and [prototypes/Readme.md](../prototypes/Readme.md) PhaseGrid `step`. |

---

## Navigation notes
- Each glossary row cites the originating section so readers can jump directly to source text.
- Crosswalk entries pair concepts with stabilizing or exploratory counterparts to show how different documents target the same system behaviors.
- For deeper dives, follow the links above to the originating documents; this overview remains the canonical map.
```
