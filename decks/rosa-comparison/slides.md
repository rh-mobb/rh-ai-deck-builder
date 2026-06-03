---
theme: red-hat-deck
title: "ROSA Classic vs ROSA HCP: The Case for Migration"
info: |
  Why the operational, technical, and cost improvements of ROSA HCP
  justify the effort to migrate from ROSA Classic.
  Red Hat Managed Services · 2026
highlighter: shiki
lineNumbers: false
fonts:
  sans: Red Hat Text
  serif: Red Hat Display
  mono: JetBrains Mono
addons:
  - slidev-addon-red-hat-components
---

<div class="h-full flex flex-col items-center justify-center text-center">

# A Note on This Presentation

<div class="mt-6 max-w-2xl mx-auto text-[var(--rh-muted)] leading-relaxed">

This presentation was created with the assistance of AI. While the visuals are polished and the structure is sound, the content may contain inaccuracies. Please verify any technical claims, pricing figures, or roadmap dates before relying on them.

</div>

<div class="mt-8 text-xs text-[var(--rh-muted)] italic">

AI-assisted · verify before you trust

</div>

</div>

---

# ROSA Classic vs ROSA HCP

## The Case for Migration

<div class="mt-8 text-[var(--rh-muted)]">
Red Hat · Managed Services · 2026
</div>

<!--
Speaker note: Welcome the ops/SRE teams. This talk is for teams running ROSA Classic in production.
We know Classic works - it got you here. But there is a better way, and today we will show you the ROI clearly.
Brand rule: title ≤2 lines (official Red Hat standard).
-->

---

# Meet the Speaker

<div class="cols-2 mt-2 gap-6 text-sm leading-snug [&_h3]:!text-xl [&_h3]:!mt-0 [&_h3]:!mb-1">
<div class="flex flex-col items-center text-center">

<img src="/speaker.png" alt="Speaker" class="w-28 h-28 shrink-0 rounded-full object-cover object-top mb-2 border-2 border-[var(--rh-red)]" />

### Paul Czarkowski
<div class="rh-tag mb-2">Red Hat</div>

Senior Principal Cloud Specialist

Red Hat Managed OpenShift Black Belt - 15+ years in cloud infrastructure, focused on Kubernetes, OpenShift, ROSA, and ARO.

<div class="mt-1.5 text-[var(--rh-muted)] text-xs">

[github.com/paulczar](https://github.com/paulczar) · [redhat.com](https://redhat.com)

</div>
</div>
<div class="flex flex-col items-center text-center">

<div class="w-28 h-28 shrink-0 rounded-full mb-2 border-2 border-[var(--rh-blue)] flex items-center justify-center text-4xl" style="background: var(--rh-surface)">⎈</div>

### Your Team
<div class="rh-tag mb-2" style="background: var(--rh-blue)">You</div>

Ops/SRE teams running ROSA Classic in production.

You know Kubernetes, AWS, and ROSA. You are ready to evaluate the next step.

<div class="mt-1.5 text-[var(--rh-muted)] text-xs">

Running ROSA Classic today

</div>
</div>
</div>

<!--
Speaker note: Brief intro. Keep it under 60 seconds.
The second column frames the audience - this helps them self-identify as the right room.
Brand rule: speaker photo optional; red circle border alone is sufficient if no headshot.
-->

---

# This Talk

<div class="cols-2">
<div>

**6 fewer EC2 instances. Zero control plane management. 4× faster deployments.**

If you are running ROSA Classic, you are paying an operational tax every day - in money, in toil, and in roadmap lag. This talk quantifies the tax and shows the path out.

</div>
<div>

**What we will cover:**

1. Cost efficiency - 6 fewer instances
2. Infrastructure simplification
3. Faster deployment and autoscaling
4. Improved security and compliance
5. Roadmap advantage - HCP is the future

</div>
</div>

<!--
Speaker note: Set the stakes. The audience knows Classic. They have invested in it.
The hook: we are not telling them Classic is bad - we are telling them there is a better way with clear ROI.
Brand rule: agenda lists max 5-6 items per column.
-->

---

# Running ROSA Classic: The Hidden Tax

A Classic ops team's typical week: monitoring master/infra nodes in your AWS account, managing node capacity, responding to cost overages from running 9 always-on instances. It works - but it demands constant attention.

<div class="cols-2 divided mt-4 text-sm">
<div>

**What you manage in Classic:**
- 3 master nodes (your account, your availability)
- 3 infrastructure nodes (platform services)
- N worker nodes (your applications)
- **9+ instances running 24/7**

</div>
<div>

**What it costs beyond the bill:**
- Control plane monitoring and patching
- Capacity planning for master/infra nodes
- On-call rotation for control plane events
- Team bandwidth taken from application work

</div>
</div>

<!--
Speaker note: SCR Situation slide. Paint the picture of Classic ops life - empathetically.
This is not a dig at Classic. It has been solid. But the operational overhead is real and cumulative.
Transition: there is a better way, and you are ready for it.
Brand rule: title ≤1 line.
-->

---
layout: section
---

# Section 1
## Cost Efficiency: 6 Fewer Instances

<!--
Section header: Moving from situation to resolution - first concrete advantage: money.
Cost resonates immediately with any audience. Relief starts here.
Brand rule: divider text ≤3 lines.
-->

---

# The Infrastructure Math

**HCP eliminates the master and infra nodes from your AWS account entirely.**

<RhTwoColumn divided>
  <template #left>

  ### ROSA Classic (multi-AZ)
  - 3 master nodes - AWS-managed but in your account
  - 3 infrastructure nodes - platform services
  - 3+ worker nodes - your applications
  - **Total: 9+ instances running 24/7**

  </template>
  <template #right>

  ### ROSA HCP (hosted control plane)
  - 0 master/infra nodes - Red Hat's managed AWS account
  - 2+ worker nodes - your applications only
  - **Total: 2+ instances running 24/7**
  - 6+ fewer EC2 instances in your bill

  </template>
</RhTwoColumn>

> *Six fewer instances per cluster. The control plane moves to Red Hat's account - and off your bill.*

<!--
Speaker note: The core message is simple: HCP externalizes the control plane.
You only pay for the nodes running your workloads.
Brand rule: ≤5 bullets per column.
-->

---

# Cost Savings: The Numbers

<RhTable
  :headers="['Cluster type', 'Instances in your account', 'Monthly delta (m5.xlarge, us-east-1)', 'Annual savings']"
  :rows="[
    ['ROSA Classic (3 AZ)', '9+ (master + infra + worker)', '--', '--'],
    ['ROSA HCP (3 AZ)', '3+ (worker only)', '~$830/cluster saved', '~$10,000/cluster'],
    ['5 ROSA HCP clusters', '15+', '~$4,150/month saved', '~$50,000'],
  ]"
/>

<div class="mt-4 text-sm text-[var(--rh-muted)]">

Savings are instance cost only. Secondary savings: eliminated EBS volumes, reduced data transfer, and reduced ops toil are additive.

</div>

<div class="mt-2 text-xs text-[var(--rh-muted)]">

Source: AWS EC2 on-demand pricing, m5.xlarge, us-east-1, May 2026. Actual savings vary by instance type and region.

</div>

<!--
Speaker note: Ground the math in a realistic instance type. Ops teams will push back on the numbers - be ready.
The $830/cluster/month is conservative (m5.xlarge at $0.19/hr × 730 hr × 6 nodes).
For larger instance types (m5.2xlarge), the savings double.
Brand rule: always cite the source on data slides.
-->

---

# ROI: Migration Pays for Itself

**Typical ROI timeline: migration effort is recovered within 6-12 months per cluster.**

<div class="cols-2 divided mt-4 text-sm">
<div>

**Migration costs (one-time):**
- New cluster provisioning: hours
- Workload migration (stateless): days
- Workload migration (stateful, DBs): 1-2 weeks
- Team training on HCP patterns: 1-2 days

</div>
<div>

**Ongoing savings (every month):**
- 6 fewer EC2 instances per cluster
- Eliminated control plane patching cycles
- Reduced on-call overhead
- Team bandwidth redirected to product work

</div>
</div>

<div class="mt-6 p-4 bg-[var(--rh-surface)] rounded text-sm">

**Multi-cluster environments:** With 5+ clusters, migration effort amortizes across all clusters. Teams who migrate dev/test first gain experience before touching production - reducing the per-cluster migration cost significantly.

</div>

<!--
Speaker note: Do not over-sell. Migration is real work. But the math is clear.
And cost is just the first advantage. The next section is about ops burden - often the bigger win for teams.
-->

---
layout: section

---

# Section 2
## Infrastructure Simplification: No Control Plane Management

<!--
Section header: Moving from cost (financial win) to ops burden (the human win).
This is where teams feel the real relief - fewer pages, fewer runbooks, less cognitive load.
Brand rule: divider text ≤3 lines.
-->

---

# What Disappears in HCP

**ROSA HCP moves the control plane to Red Hat's managed environment. Your account runs worker nodes only.**

- Monitoring master node health (CPU, disk, etcd latency) - gone
- Patching master/infra nodes on a schedule - gone
- Troubleshooting master node evictions or capacity events - gone
- Managing platform service replicas (ingress, logging, monitoring) - gone
- Scaling the control plane when it hits limits - gone

**What remains:** Worker node autoscaling, application deployments, and your actual product work.

<div class="mt-4 text-sm text-[var(--rh-muted)]">

The ops surface area shrinks by two thirds. Entire categories of runbooks and alerts become unnecessary.

</div>

<!--
Speaker note: This is the human win. Ops teams hate being paged for control plane issues.
Those events are invisible to the business but very visible to your on-call rotation.
HCP removes that entire category.
-->

---

# Architecture Before and After

<ArchitectureComparison />

<!--
Speaker note: The animation pulses the master and infra nodes to highlight what is your responsibility in Classic.
In HCP, those 6 nodes move to Red Hat's account entirely - you only run workers.
That is the architectural shift: from managing infrastructure to managing workloads.
-->

---
layout: section

---

# Section 3
## Faster Deployment and Autoscaling

<!--
Section header: Building urgency. Cost and ops simplification are wins; speed is competitive advantage.
Teams that can spin up clusters in 10 minutes instead of 40 operate differently.
Brand rule: divider text ≤3 lines.
-->

---

# Deployment Speed: 40 Minutes vs 10 Minutes

<RhTwoColumn divided>
  <template #left>

  ### ROSA Classic - ~40 minutes
  1. API call creates cluster
  2. AWS provisions 3 master + 3 infra + N worker nodes
  3. etcd initialises, cluster readiness checks run
  4. Network config, security groups, IAM roles
  5. Control plane health checks pass
  6. Cluster is ready

  </template>
  <template #right>

  ### ROSA HCP - ~10 minutes
  1. API call creates cluster
  2. Red Hat activates a hosted control plane endpoint (seconds)
  3. AWS provisions N worker nodes
  4. Network config, PrivateLink endpoint, IAM roles
  5. Worker nodes join - cluster is ready

  </template>
</RhTwoColumn>

> *A 4× speed improvement changes what you can do: ephemeral test clusters, rapid DR, on-demand environments.*

<!--
Speaker note: Ops teams do not think about cluster provisioning speed until they need it.
Then it becomes critical for CI/CD (ephemeral test clusters), DR scenarios, and regional failover.
HCP changes the architecture of what is possible.
Source: Red Hat internal benchmarks, ROSA HCP GA documentation.
-->

---

# Why Speed Changes Your Architecture

**Faster cluster lifecycle enables patterns that are impractical with Classic.**

- **Ephemeral test clusters:** Spin up per-branch, tear down after CI - not realistic at 40 min
- **Disaster recovery:** A 10-minute RTO for a new cluster vs. 40 minutes changes your SLA story
- **Dev/test environments:** Scale to zero overnight, restore in the morning (especially with scale-to-zero on HCP roadmap)
- **Regional failover:** Multi-region active-active becomes operationally feasible

<div class="mt-6 p-4 bg-[var(--rh-surface)] rounded text-sm">

**Autoscaling benefit:** HCP's separation of control plane from worker nodes eliminates control plane contention during rapid scale events. Worker autoscaling is a pure EC2 event - predictable and linear.

</div>

<!--
Speaker note: This slide connects speed to architecture choices.
The teams who benefit most from this are those running ephemeral environments or needing rapid recovery.
Transition: speed and cost are now covered. Next: security, which closes compliance conversations.
-->

---
layout: section

---

# Section 4
## Improved Security and Compliance

<!--
Section header: Building confidence. HCP is not just cheaper and faster - it is more secure.
This section closes compliance objections and gives security teams a reason to support the migration.
Brand rule: divider text ≤3 lines.
-->

---

# Network Isolation: PrivateLink Architecture

<NetworkIsolationDiagram />

<!--
Speaker note: The animation runs automatically - Classic shows the attacker breaching master nodes in your account,
HCP shows the attacker stopped at the PrivateLink boundary before it can reach the control plane.
This is the key security architectural difference: blast radius isolation.
-->

---

# Security and Compliance Benefits

<RhTwoColumn divided>
  <template #left>

  ### ROSA Classic
  - Control plane and workers in same VPC blast radius
  - Master node security managed by you
  - etcd backup - your runbook
  - Audit logs - your configuration
  - Control plane patching - your schedule

  </template>
  <template #right>

  ### ROSA HCP
  - Control plane isolated via PrivateLink (separate VPC)
  - Red Hat manages control plane security
  - etcd encrypted and backed up automatically
  - Audit logs integrated with CloudTrail
  - Control plane patched by Red Hat SRE team

  </template>
</RhTwoColumn>

> *Compliance win: reduced attack surface for SOC 2, FedRAMP, and PCI-DSS audits.*

<!--
Speaker note: For enterprise teams, audit is non-negotiable. HCP bakes it in.
Classic teams often layer on external tooling to satisfy audit requirements.
HCP ships with it built in - less to configure, less to maintain, cleaner audit story.
-->

---
layout: section

---

# Section 5
## Roadmap Advantage: The Future is HCP

<!--
Section header: Building urgency and motivation. This section is about momentum.
Classic is maintenance mode. HCP is where innovation happens. The feature gap will compound.
Brand rule: divider text ≤3 lines.
-->

---

# Classic Gets Patches. HCP Gets Features.

**New features in ROSA are HCP-first. Classic receives security patches and bug fixes - not innovation.**

<div class="cols-2 divided mt-4 text-sm">
<div>

**Coming to HCP:**
- **Autonode** - right-size nodes automatically (Q2 2026)
- **Scale-to-zero** - eliminate idle node costs (Q3 2026)
- **Enhanced DR** - automated zero-RTO failover
- **Advanced observability** - integrated metrics and tracing
- **Next-gen security** - pod security and network policies

</div>
<div>

**Classic status:**
- Security patches and bug fixes only
- No new features planned
- Deprecation path announced (sunset TBD)
- Feature gap with HCP widens every quarter

</div>
</div>

<div class="mt-4 text-xs text-[var(--rh-muted)]">

Source: Red Hat ROSA roadmap announcements, ROSA HCP GA blog post (January 2024). Roadmap dates subject to change.

</div>

<!--
Speaker note: This creates urgency. The feature gap is real and it compounds.
Teams on Classic today will be learning new HCP features in 2027 that HCP teams have had since 2025.
That is two years of operational maturity to catch up on.
Brand rule: cite the source on roadmap data.
-->

---

# Project Timeline: HCP Feature Delivery

<RhTimeline
  :milestones="[
    { date: 'Jan 2024', label: 'ROSA HCP\nGA launch',         color: '#5BA352' },
    { date: 'Q2 2026', label: 'Autonode\nGA',                  color: '#73BCF7' },
    { date: 'Q3 2026', label: 'Scale-to-zero\nGA',             color: '#73BCF7' },
    { date: 'Q4 2026', label: 'Enhanced DR\nGA',               color: '#73BCF7' },
    { date: 'TBD',     label: 'Classic\nsunset',               color: '#C9190B' },
  ]"
  :legend="[
    { color: '#5BA352', label: 'Shipped' },
    { color: '#73BCF7', label: 'Roadmap (HCP)' },
    { color: '#C9190B', label: 'Classic end' },
  ]"
/>

<div class="mt-4 text-sm text-[var(--rh-muted)]">

Each quarter on Classic is a quarter further behind on operational maturity and feature readiness.

</div>

<!--
Speaker note: The timeline makes the gap visual. Every green dot is something HCP teams have that Classic teams are waiting for.
The red Classic sunset date is the forcing function - migration is not optional, it is a question of when.
Source: Red Hat ROSA roadmap announcements. Dates subject to change.
-->

---

# Why HCP Gets Features First

**HCP is structurally simpler for Red Hat to operate. That enables faster iteration.**

- **Single code version:** All HCP clusters run the same control plane version - testing is cheaper
- **Direct telemetry:** Red Hat sees every cluster's health without requiring customer-side agents
- **Faster release cycles:** Bug fixes ship to all customers simultaneously - no customer-side deployment required
- **Capital efficiency:** One managed control plane fleet serves thousands of customer clusters

<div class="mt-6 p-4 bg-[var(--rh-surface)] rounded text-sm">

**For your team:** Features arrive faster. You are not waiting for coordination between Red Hat's release and your maintenance window. HCP clusters self-update their control planes on Red Hat's schedule.

</div>

<!--
Speaker note: This is not just marketing - it is structural.
HCP is genuinely simpler for Red Hat to operate, which means faster iteration for you.
The audience needs to understand why the roadmap split exists - it is an architectural reality, not a business preference.
-->

---
layout: center
class: text-center
---

# The Case, Summarised

<v-clicks>

💰 **Cost** - 6 fewer EC2 instances per cluster, $10K+ annual savings

🔧 **Simplification** - zero control plane management, entire runbook categories eliminated

⚡ **Speed** - 10-minute cluster provisioning vs. 40 minutes; clean autoscaling

🔒 **Security** - PrivateLink isolation, managed audit, automated etcd backup

🚀 **Roadmap** - Autonode and scale-to-zero ship to HCP; Classic is maintenance-only

</v-clicks>

<!--
Speaker note: Read these with the audience. Let each one land.
The goal is for every bullet to resonate with something they experienced in Classic.
Transition: so what do we do next?
Brand rule: centre layout - use sparingly, one per major section at most.
-->

---

# Next Steps: Start the Conversation

**You are not committing to migrate today. You are committing to understand your path.**

1. **Schedule an architecture review** with Red Hat
   - Discuss your cluster topology (single, multi-cluster, regional)
   - Understand workload migration patterns for your specific apps
   - Clarify timing, dependencies, and team capacity

2. **Start with a non-production cluster** (recommended)
   - Validate your migration runbook in a low-risk environment
   - Your team learns HCP patterns before touching production

3. **Build the migration runbook together**
   - DNS and network cutover plan
   - Data migration strategy for stateful workloads
   - Rollback procedures and team training

<!--
Speaker note: We are not asking them to migrate tomorrow.
We are asking them to start the conversation. Most teams find the ROI case is clear once they map it to their environment.
The architecture review is the call to action - make it easy to say yes.
-->

---
layout: center
class: text-center
---

# Classic carries a daily operational tax.
## HCP removes it.

<div class="text-3xl font-bold mt-6" style="color: var(--rh-red); font-family: 'Red Hat Display', sans-serif">
Schedule an architecture review. Let's build your migration runbook.
</div>

<div class="mt-12 text-sm" style="color: var(--rh-muted)">

[docs.openshift.com/rosa](https://docs.openshift.com/rosa/) ·
[console.redhat.com](https://console.redhat.com) ·
Contact your Red Hat account team

</div>

<div class="mt-6 text-xs italic" style="color: var(--rh-muted)">

*The migration is real work. The ROI is clearer once you map it to your clusters. Start with dev.*

</div>

<!--
Speaker note: End with the single idea you want ringing in their ears.
Classic costs them every day. HCP removes that cost. The next step is the architecture review.
Brand rule: closing slide should leave one idea and 2-3 actionable links.
-->
