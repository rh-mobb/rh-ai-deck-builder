# Deck Design Doc: Surviving Sudden Traffic Spikes on ROSA HCP

## Core Thesis

Autoscaling alone can't save you from instant traffic spikes — you need a layered defense strategy that absorbs the shockwave before it reaches your pods.

## Know — Feel — Do Framework

### Know: 5 Key Messages (5-5-5 Rule, compressed to 20 min)

| Message | ~Slides | ~Minutes |
|---------|---------|----------|
| 1. The cold-start penalty — why autoscaling alone fails | 3 | 4 |
| 2. Platform hardening — Karpenter + Balloon Pods + HPA/VPA | 3 | 4 |
| 3. In-cluster protection — HAProxy + Service Mesh circuit breaking | 3 | 4 |
| 4. Async buffering — SQS + KEDA keeps compute on ROSA | 3 | 4 |
| 5. Edge shielding — WAF + Virtual Waiting Rooms | 2 | 3 |
| **Opening + Closing** | **3** | **3** |
| **Total** | **~17** | **~20** |

### Feel

**Confidence** — this problem is fully understood and fully solvable on ROSA HCP.
**Relief** — Red Hat has done this before; they don't have to figure it out alone.

### Do

Engage Red Hat Consulting for a Well-Architected Review and implementation engagement.

## Audience Profile

- Who: Enterprise architects
- Technical depth: Intermediate-advanced (know Kubernetes, understand cloud scaling concepts)
- Existing knowledge: Aware they have a scaling problem; likely have tried or considered autoscaling as the fix
- Constraints: Want proven patterns, not theory; care about reliability and avoiding outages

## Talk Structure

- Length: 20 minutes
- Flow: Problem → layered solution → architecture summary → next steps
- **Narrative framework:** SCR — audience is ready to move forward, no extended justification needed
- Sections:
  1. Opening — establish the context (you're on ROSA, spikes happen)
  2. The cold-start penalty — show the 5-minute void that autoscaling can't bridge
  3. Platform hardening — the first line of defense
  4. In-cluster intelligence — the second line of defense
  5. Async buffering — decouple ingestion from compute
  6. Edge shielding — stop the storm at the perimeter
  7. Complete architecture + CTA

## Pyramid Principle

- **Apex:** A layered defense strategy eliminates the traffic shockwave that autoscaling alone cannot handle
- **Tier 2 (arguments):**
  1. The cold-start penalty is real — provisioning takes 5+ minutes, spikes happen in seconds
  2. Platform hardening provides instant compute headroom (balloon pods + Karpenter)
  3. In-cluster traffic shaping prevents pod collapse under load
  4. Async queuing decouples ingestion from processing, keeping compute on ROSA
  5. Edge protection stops raw, unqualified traffic before it ever reaches the cluster
- **Tier 3 (evidence):** Timeline diagram, component specs, architecture diagram

## Narrative Arc (SCR)

```
Opening (Slides 1–2) — SITUATION
You're on ROSA HCP. Traffic is unpredictable. This is the reality.
↓ Tone: grounded, professional

Section 1 (Slides 3–5) — COMPLICATION
The cold-start penalty: autoscaling triggers, but the 5-minute void kills you.
Timeline diagram showing the gap between spike and ready pods.
↓ Tone: sobering clarity — "this is the real problem"

Section 2 (Slides 6–8) — RESOLUTION begins
Platform hardening: balloon pods + Karpenter buy immediate headroom.
↓ Tone: confidence building — "here's the foundation"

Section 3 (Slides 9–11)
In-cluster intelligence: HAProxy rate limits + Service Mesh circuit breaking.
↓ Tone: relief — "the platform does the heavy lifting"

Section 4 (Slides 12–14)
Async buffering: SQS absorbs the storm, KEDA scales ROSA workers to drain it.
↓ Tone: confidence — "compute stays on OpenShift"

Section 5 (Slides 15–16)
Edge shielding: WAF + Virtual Waiting Rooms meter traffic before it enters.
↓ Tone: completeness — "nothing gets through unchecked"

Closing (Slides 17) — CTA
Complete architecture diagram + next steps with Red Hat Consulting.
↓ Tone: momentum — "let's start"
```

## Key Stories & Examples

- **The 5-minute void** is the hook — make it visceral with a timeline (0s spike → 5m+ pods ready, users gone by then)
- **Balloon pods** are counterintuitive and memorable — "we waste capacity on purpose so we can steal it instantly"
- **SQS as dumb cheap storage** framing — we use AWS for queuing, ROSA for compute; clean separation of concerns

## Visual Style

- Tone: Formal, data-driven, consulting-grade
- Red Hat branding: prominent throughout
- Emphasis: Visuals-heavy — the architecture diagram is the centrepiece

## Diagrams & Animations

### Diagram Approach
- Vue components throughout (no Mermaid)
- Animate only where motion tells the story

### Key Diagrams Needed

| Slide | Diagram | Animate? |
|-------|---------|----------|
| Cold-start penalty | Timeline: 0s spike → 5m+ ready | ✅ Yes — motion shows the painful gap in real time |
| Two lines of defense | Concentric shields protecting ROSA workloads | No — static is cleaner |
| Platform hardening | Node diagram with balloon pod eviction | No — fact-based |
| In-cluster protection | Traffic cop routing + circuit breaker | No — static |
| Async buffering | SQS → KEDA → ROSA worker flow | No — static |
| Edge shielding | Funnel: raw traffic → WAF → metered stream | No — static |
| Architecture summary | Full end-to-end diagram | No — static reference |

### Animation Notes

The **cold-start timeline** is the one place animation earns its keep: showing traffic spike at 0s, pods crashing, HPA triggering, EC2 provisioning, and users abandoning — beat by beat — makes the problem viscerally real in a way a static diagram cannot.

## Success Criteria

- Architects leave understanding exactly why their current autoscaling approach has a gap
- They can name at least 2 of the 5 defense layers without prompting
- The meeting ends with a booked follow-up engagement or clear next step with Red Hat Consulting
