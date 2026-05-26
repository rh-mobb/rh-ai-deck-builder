# Deck Design Doc: ROSA Classic vs ROSA HCP

## Core Thesis
The operational, technical, and cost improvements of ROSA HCP over Classic justify the effort and cost of migrating a production cluster and its workloads.

## Know — Feel — Do Framework

### Know: 5 Key Messages (5-5-5 Rule)
| Message | ~Slides | ~Minutes |
|---------|---------|----------|
| 1. Cost Efficiency (6 fewer EC2 instances on prod clusters) | 5 | 5 |
| 2. Infrastructure Simplification (no master/infra nodes to manage) | 5 | 5 |
| 3. Faster Deployment & Autoscaling | 5 | 5 |
| 4. Improved Security & Compliance | 5 | 5 |
| 5. Roadmap Advantage (new features like Autonode, scale-to-zero come to HCP, not Classic) | 5 | 5 |
| **Total** | **~25** | **~25** |

**Pacing note:** 30-min talk = ~25 min content + 5 min Q&A

### Feel
Create a narrative arc that builds from problem → relief → confidence → urgency:
- **Problem phase** (opening): Acknowledge the ops burden of Classic (manual control plane management, cost, limited innovation)
- **Relief phase** (sections 1-2): Show how HCP eliminates the operational burden and reduces infrastructure
- **Confidence phase** (sections 3-4): Demonstrate technical advantages (speed, security) that show HCP is production-ready
- **Urgency phase** (section 5): Emphasize that new features and the future belong to HCP; Classic is being sunset

### Do
Schedule an architecture review with Red Hat with a plan to create a migration runbook.

## Audience Profile
- **Who:** Ops/SRE teams currently running ROSA Classic in production
- **Technical depth:** Expert/intermediate (they know Kubernetes, AWS, and ROSA already)
- **Existing knowledge:** Deep familiarity with Classic; learning curve for HCP management
- **Constraints:** Migration pain (new cluster, workload migration), operational disruption, team retraining
- **What they care about:** Operational overhead reduction, cost, reliability, feature parity, migration effort

## Talk Structure
- **Length:** 30 minutes (standard)
- **Flow:** Problem → Solution → Results
  - **Problem (opening):** Pain of Classic ops: managing control plane, infrastructure costs, limited roadmap
  - **Solution (sections 1-5):** Five concrete HCP advantages that address Classic pain points
  - **Results (closing):** ROI justifies migration; clear path forward via architecture review
- **Narrative framework:** SCR (Situation-Complication-Resolution)
  - **Why SCR:** Audience is expert/familiar with ROSA; they're ready to move forward, not skeptical. SCR is faster and more decisive than SCQA.

## Pyramid Principle: Hierarchical Organization

**Apex (main idea):** HCP migration justifies the effort and cost.

**Arguments (tier 2 — the 5 key messages):**
1. Cost efficiency: 6 fewer EC2 instances = $X/mo savings
2. Infrastructure simplification: No master/infra nodes to manage
3. Faster deployment & autoscaling: 40 min → 10 min provisioning
4. Improved security & compliance: PrivateLink isolation, better audit
5. Roadmap advantage: New features (Autonode, scale-to-zero) ship to HCP, not Classic

**Evidence (tier 3 — concrete data and examples):**
- Production cluster baseline: Classic 9-node (3 master + 3 infra + 3 worker) vs HCP 2+ worker nodes
- EC2 cost comparison: 6 fewer instances × [unit cost] × 12 months = ROI timeline
- Deployment speed: benchmarked timing (40 min Classic, 10 min HCP)
- Security features: PrivateLink technical advantages over same-VPC Classic
- Roadmap timeline: Classic sunset date vs HCP feature releases (Autonode Q2 2026, scale-to-zero Q3 2026)

## Key Stories & Examples
- **Opening story:** A Classic ops team's typical week—monitoring master/infra nodes in their AWS account, managing node capacity, responding to cost overages from running 9 always-on nodes
- **Cost concrete example:** Show a prod cluster: Classic = 9 multi-AZ nodes (3 master + 3 infra + 3+ worker) vs HCP = 2+ worker nodes; 6+ fewer EC2 instances saves $X per month
- **Speed example:** Classic cluster deployment ~40 min vs HCP ~10 min; why this matters for elasticity and rapid scaling
- **Roadmap story:** Features like Autonode and scale-to-zero are HCP-first; Classic gets no new feature love after deprecation
- **Migration reality check:** Yes, it's a new cluster and workload migration—but the operational and cost gains compound over time

## Visual Style
- **Tone:** Red Hat official, technically authoritative, consultative (not hype-y)
- **Red Hat branding:** Prominent; use official ROSA visuals and Red Hat design language
- **Emphasis:** Balanced (not visuals-heavy, not text-heavy)
- **Mood:** Professional, data-driven, but empathetic to migration concerns

## Narrative Arc: SCR + Dot-Dash + Pyramid

**Story beats (using SCR framework):**

```
Opening (SITUATION)
  Slide: "The Cost & Ops Burden of Running ROSA Classic"
  ↓ Feel: "This is familiar—it's our life right now"

Section 1–5 (COMPLICATION → RESOLUTION)
  Each section presents one Pyramid argument (a dot) + evidence (dashes):
  
  Message 1 (DOT): "HCP cuts infrastructure costs by 6 EC2 instances"
  └─ Dashes: cluster baseline, instance pricing, monthly ROI
  ↓ Feel: Relief—we can save money

  Message 2 (DOT): "No master/infra nodes means no control plane management"
  └─ Dashes: tasks eliminated (updates, monitoring, patching), time reclaimed
  ↓ Feel: Confidence—this is simpler to operate

  Message 3 (DOT): "Deployment & autoscaling happen 4× faster (10 min vs 40 min)"
  └─ Dashes: timing benchmarks, why speed matters for elasticity
  ↓ Feel: Urgency—we need this for competitive advantage

  Message 4 (DOT): "PrivateLink isolation improves security posture"
  └─ Dashes: attack surface comparison, audit capabilities
  ↓ Feel: Confidence—compliance and security are solved

  Message 5 (DOT): "New features ship to HCP; Classic is on sunset path"
  └─ Dashes: roadmap timeline (Autonode Q2, scale-to-zero Q3), deprecation date
  ↓ Feel: Urgency—we need to move before features gap widens

Closing (RESOLUTION)
  Slide: "Schedule architecture review to build migration runbook"
  ↓ Feel: Empowered—we know what to do next
```

**Golden Rule:** Read only the dots (slide headlines) in sequence. The complete story—"Classic burdens → HCP solves cost/ops/speed/security → future is HCP-only"—should be clear without the dashes.

### Diagram Approach
- **Mermaid (simple, fast):** Architecture comparisons, node count tables, upgrade flows, feature roadmap
- **Vue animations (stunning, time-intensive):** 2-3 "wow" moments to drive home impact
- **Hybrid strategy:** Mermaid handles technical substance; Vue animations for emotional connection

### Key Diagrams Needed
- **Section 1 (Cost):** Vue animation showing 9 EC2 instances (Classic) collapsing to 2 (HCP) + hosted control plane
- **Section 2 (Infrastructure):** Mermaid diagram of Classic (3 master + 3 infra nodes) vs HCP (2+ worker, hosted control plane)
- **Section 3 (Speed):** Mermaid timeline/sequence: provisioning speed comparison, autoscaling responsiveness
- **Section 4 (Security):** Mermaid diagram of network isolation (PrivateLink in HCP vs same-VPC in Classic)
- **Section 5 (Roadmap):** Vue animation showing Autonode and scale-to-zero features coming to HCP, not Classic

### Animation Ideas
- **Opening:** Show a Classic cluster "simplified" into HCP (remove nodes, show hosted control plane appearing)
- **Cost moment:** Animate 6 EC2 instances disappearing, showing cost savings per month
- **Roadmap moment:** Timeline showing Classic deprecation path vs HCP's active feature roadmap (Autonode, scale-to-zero, etc.)

## Success Criteria
- **Metric:** At least 50% of attendees schedule an architecture review within 2 weeks
- **Outcome:** Ops teams leave with a clear understanding of HCP advantages and confidence in migration path
- **Feeling:** They feel seen (we get your Classic burden), relieved (HCP removes it), and motivated (roadmap advantage)

## Reference Materials Consulted
- AWS ROSA Architecture Guide
- Red Hat ROSA Capability Matrix
- ROSA HCP vs Classic technical comparison docs
- Red Hat announcement: ROSA HCP GA (Jan 2024)
- Migration guide: Transitioning to ROSA HCP from Classic via MTC
