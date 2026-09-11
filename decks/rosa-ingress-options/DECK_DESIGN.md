# Deck Design Doc: ROSA Ingress Security Group Mitigation Options

## Context

Internal architecture review with Cathay Pacific's platform team to determine their best path forward. BYO Security Group for NLBs is unlikely to be available on their current Classic ROSA clusters. The customer surfaced the issue: `loadBalancerSourceRanges` whitelisting causes AWS Security Group quota exhaustion.

## Core Thesis

Red Hat has proven patterns available now that eliminate the need to wait for NLBs with built-in Security Groups.

## Know — Feel — Do Framework

### Know: 5 Key Messages

| Message | ~Slides | ~Minutes |
|---------|---------|----------|
| 1. Root cause — `loadBalancerSourceRanges` creates 3 SG rules per CIDR on worker nodes, not on the NLB | 5 | 5 |
| 2. Roadmap reality — NLBs with attached Security Groups are not coming soon for Classic clusters (no OCP 5 / ROSA 5.0 specifics) | 4 | 4 |
| 3. Five options today — Route allowlists, ALBO, chained ALB, CloudFront public, CloudFront VPC Origin | 8 | 8 |
| 4. Decision criteria — Routes vs Ingress, SecOps control, WAF needs, app-team impact | 4 | 4 |
| 5. Recommended path — Phase 1: HAProxy allowlists to unblock; Phase 2: evaluate gateway architecture | 4 | 4 |
| **Total** | **~25** | **~25** |

### Feel

**Confidence** — They have a clear, proven path forward without waiting on a platform release.

### Do

- Pick a pattern to pursue
- Schedule a follow-up call with Red Hat to assist in evaluating options

## Audience Profile

- **Who:** Mixed roles — platform engineers, network/security architects, cluster admins
- **Technical depth:** Intermediate — understand basic ROSA ingress
- **Existing knowledge:** They identified the SG quota problem themselves; problem-aware and seeking alternatives
- **Constraints:** Need to unblock deployments now; likely care about app-team impact, SecOps control, and staying on Routes where possible

## Talk Structure

- **Length:** 30 minutes (~25 min content + 5 min Q&A)
- **Flow:** Problem → options → decision matrix → recommendation
- **Narrative framework:** SCR (Situation → Complication → Resolution)
- **Sections:**
  1. Situation — ROSA ingress expansion, NLB migration, IP whitelisting requirements
  2. Complication — Root cause and SG quota exhaustion; platform fix not imminent for Classic
  3. Resolution — Five proven patterns, decision matrix, phased action plan

## Pyramid Principle

- **Apex:** Proven architectural patterns unblock Cathay Pacific today — no need to wait for NLB Security Groups.
- **Tier 2 arguments:**
  1. The root cause is understood and fixable without platform changes
  2. Five validated Red Hat Cloud Experts patterns cover every use case
  3. A phased approach unblocks immediately while enabling strategic standardization
- **Tier 3 evidence:** Traffic flow diagrams, option architectures, decision matrix, Phase 1/2 action plan

## Narrative Arc (SCR + Dot-Dash)

**Opening (Slides 1-3) — SITUATION**
- Hook: Cathay Pacific expanding ROSA footprint, migrating ingress to NLB, enforcing IP whitelisting
- Feel: Recognition — "yes, that's our situation"

**Section 1 (Message 1) — ROOT CAUSE — COMPLICATION**
- Dot: Whitelisting via `loadBalancerSourceRanges` hits worker node SGs, not the NLB
- Dashes: 3 rules per CIDR multiplier, quota exhaustion, deployment blockers
- Diagram: Animated Vue — traffic flow showing SG rule creation at worker layer
- Feel: Clarity — "that's why we're blocked"

**Section 2 (Message 2) — ROADMAP REALITY**
- Dot: NLB Security Group attachment is not available on Classic ROSA clusters in the near term
- Dashes: Cannot backport without breaking IAM changes; don't wait
- Feel: Acceptance — platform fix isn't the answer for now

**Section 3 (Message 3) — FIVE OPTIONS**
- Dot: Five proven patterns bypass worker SG limits entirely
- Dashes: One slide per option with animated Vue architecture diagram
  - Option 1: HAProxy Route allowlists (immediate unblock)
  - Option 2: ALBO + Kubernetes Ingress
  - Option 3: Chained ALB gateway in front of router
  - Option 4: CloudFront + WAF (public)
  - Option 5: CloudFront VPC Origin sandwich (private)
- Feel: Confidence — "we have real choices"

**Section 4 (Message 4) — DECISION MATRIX**
- Dot: The right pattern depends on your constraints
- Dashes: RhTable comparison — ingress resource, AWS infra, BYO SG, WAF, app-team impact, use case
- Feel: Clarity — "I can see which fits us"

**Section 5 (Message 5) — RECOMMENDED PATH — RESOLUTION**
- Dot: Two-phase approach — unblock now, standardize strategically
- Dashes: Phase 1 pilot HAProxy allowlists; Phase 2 evaluate gateway (Options 3/4/5)
- Feel: Confidence + motivation to act

**Closing — CTA**
- Pick a pattern and/or schedule Red Hat architecture follow-up
- Feel: Ready to move forward

## Key Stories & Examples

- Customer brought the SG quota issue to Red Hat — they understand the problem
- Enterprise multi-subnet architectures amplify the 3-rules-per-CIDR multiplier
- Option 1 as immediate unblock (0-2 weeks); Options 3/4/5 for strategic edge (2-6 weeks)
- Red Hat Cloud Experts reference: `rosa/nlb-cf-vpco` for Option 5

## Reference Material

- `reference/ROSA Ingress Architecture Report.md` (primary)
- Red Hat Cloud Experts patterns (cloud.redhat.com/experts)
- AWS documentation (NLB, ALB, CloudFront, WAF, Security Groups)

## Visual Style

- **Tone:** Conversational / collaborative — working session, not a lecture
- **Red Hat branding:** Yes — standard theme
- **Emphasis:** Architecture diagrams and decision matrix front and center; text-minimal headlines

## Diagrams & Animations

### Diagram Approach

- **Vue components only** — all architecture diagrams in `components/`
- **Animate where motion tells the story** — traffic flowing, filtering at different layers, SG rule accumulation

### Key Diagrams Needed

| Component | Section | Animation |
|-----------|---------|-----------|
| `RootCauseFlow.vue` | Message 1 | Traffic flows NLB → worker SG (rules appear per CIDR) → router |
| `Option1RouteAllowlist.vue` | Option 1 | Traffic reaches NLB, filtered at HAProxy layer |
| `Option2Albo.vue` | Option 2 | ALB with BYO SG + WAF → NodePorts → pods |
| `Option3ChainedAlb.vue` | Option 3 | Outer ALB filters → private NLB → router → pods |
| `Option4CloudFrontPublic.vue` | Option 4 | Edge WAF filters → CloudFront → public NLB |
| `Option5VpcOriginSandwich.vue` | Option 5 | CloudFront → outer gateway LB (SG) → inner NLB → router |

### Animation Ideas

- Root cause: CIDR blocks appearing as SG rules on worker nodes (multiplier effect visualized)
- Option 1: Unwanted traffic reaching router then dropped (contrast with SG filtering)
- Option 5: Outer/inner gateway sandwich — traffic path through two LB tiers

## Success Criteria

- Platform team can articulate why `loadBalancerSourceRanges` caused the quota issue
- Team identifies 1-2 options that fit their constraints
- Follow-up call scheduled or Phase 1 pilot agreed
- Audience leaves confident they are not blocked waiting on a platform release

## Constraints & Guardrails

- Do **not** mention OCP 5 / ROSA 5.0 specifics to the customer
- Frame roadmap as "not coming soon for Classic clusters" without version numbers
- Customer name (Cathay Pacific) acceptable in working session context
- No em-dashes in any file content
