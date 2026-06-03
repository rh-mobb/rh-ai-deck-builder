---
theme: red-hat-deck
title: "Surviving Sudden Traffic Spikes on ROSA HCP"
info: |
  Architectural patterns for instant traffic spikes.
  Red Hat Consulting · 2026
highlighter: shiki
lineNumbers: false
fonts:
  sans: Red Hat Text
  serif: Red Hat Display
  mono: JetBrains Mono
addons:
  - slidev-addon-red-hat-components
---

<!-- SLIDE 1 - AI disclaimer (mandatory first slide, flex-centered) -->

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

<!-- SLIDE 2 - Title -->

# Surviving Sudden Traffic Spikes on ROSA HCP

## Moving beyond autoscaling to build bulletproof, resilient applications

<div class="mt-8 text-[var(--rh-muted)]">
Red Hat Consulting · 2026
</div>

<!--
Speaker note: Welcome. Today we address a specific and painful problem - what happens when traffic hits your ROSA cluster faster than your autoscaler can respond. We will walk through five layers of defense that together eliminate the shockwave.
-->

---

<!-- SLIDE 3 - Agenda -->

# This Talk

<div class="cols-2">
<div>

**Your autoscaler cannot outrun physics.**

A traffic spike at 0 seconds leaves a 5-minute window where your application is completely on its own. This talk is about closing that window - before the next spike hits.

</div>
<div>

**What we will cover:**

1. The cold-start penalty
2. Platform hardening
3. In-cluster intelligence
4. Async buffering
5. Edge shielding

</div>
</div>

<!--
Speaker note: Autoscaling is necessary but not sufficient. We need a layered defense strategy. Each layer handles what the previous layer cannot. We will go through them in order, from the inside out.
-->

---
layout: section
class: section-header
---

<!-- SLIDE 4 - Section: Cold-Start Penalty -->

# Section 1
## The Cold-Start Penalty

<!--
Speaker note: Before we can solve the problem, we need to understand exactly what happens in the first five minutes of a sudden traffic spike. The answer is more painful than most teams realize.
-->

---

<!-- SLIDE 5 - Animated cold-start timeline -->

# Autoscaling Triggers. Users Do Not Wait.

<div class="text-sm text-[var(--rh-muted)] text-center mb-3">

Watch what actually happens during a sudden 10x traffic spike on a standard autoscaling setup.

</div>

<ColdStartTimeline />

<!--
Speaker note: Walk through each phase using the dot controls. The critical point is The Void - the 3 to 5 minute gap between when autoscaling triggers and when new pods are actually ready. During this window, users see 502 errors and leave. Click a dot to pause on that phase.
-->

---

<!-- SLIDE 6 - Why autoscaling alone fails -->

# Cloud Capacity Is Infinite. Cloud Speed Is Not.

- **HPA triggers in ~10 seconds** - but only places an EC2 request; it does not provision compute
- **EC2 provisioning takes 3-5+ minutes** - instance startup, cluster join, image pull, readiness probes
- **During that window** existing pods absorb 10x their normal load - OOM kills, CPU starvation, 502 Bad Gateways
- **By the time new pods are ready** the majority of users have already abandoned

> *We do not shift the bottleneck. We eliminate the shockwave.*

<!--
Speaker note: This is not a ROSA limitation - it is a physical constraint of cloud infrastructure. No matter how aggressively your autoscaler is configured, EC2 instances take minutes to provision. A faster autoscaler is not the answer. A layered defense is.
-->

---
layout: section
class: section-header
---

<!-- SLIDE 7 - Section: Platform Hardening -->

# Section 2
## Line 1: Platform Hardening

<!--
Speaker note: The first line of defense is hardening the platform itself. These components give us instant compute headroom and rapid node provisioning before any spike can exhaust our capacity.
-->

---

<!-- SLIDE 8 - Balloon Pods + Karpenter -->

# Buy Instant Compute Headroom Before You Need It

<RhTwoColumn>
  <template #left>

  ### Balloon Pods (Overprovisioning)

  Low-priority "do-nothing" pods that **reserve warm EC2 slots** on real nodes ahead of any spike.

  When HPA requests space, the scheduler preempts balloon pods **in under 1 second** - no waiting for new nodes.

  - PriorityClass: -1 (always first to evict)
  - Sized to your expected burst headroom
  - Cost: minimal - slots reserved, not consumed

  </template>
  <template #right>

  ### Karpenter

  Replaces the Cluster Autoscaler with **AWS-native, just-in-time node provisioning**.

  After balloon pods are evicted, Karpenter provisions new EC2 instances - right-sized for the actual workload.

  - Provisions directly against EC2 APIs (no ASG delay)
  - Selects optimal instance type per workload
  - Consolidates underused nodes to reduce cost

  </template>
</RhTwoColumn>

<!--
Speaker note: Balloon pods are the key insight - we deliberately reserve capacity so we can steal it instantly during a spike. Karpenter then restores that headroom in the background. Together they give us a 1-2 minute cushion of instant capacity that buys time for the rest of the defense layers to activate.
-->

---

<!-- SLIDE 9 - HPA + VPA -->

# Configure Your Autoscalers to Respond, Not React

- **HPA with aggressive scale-up thresholds** - lower the CPU threshold that triggers scaling; do not wait until pods are at 80% before adding replicas
- **VPA in Recommender-only mode** - runs silently in the background, auditing resource requests and limits; surfaces silent CPU throttling before a spike exposes it
- **Pre-warm with minReplicas** - configure based on expected off-peak load, not zero; cold pods cannot serve traffic
- **Custom metrics via KEDA** - for queue-based workloads, scale on queue depth before CPU becomes a signal

> *Right-sizing is not optional. An undersized pod under spike load is a ticking OOM kill.*

<!--
Speaker note: These are configuration changes, not new components. Run VPA in recommender mode for two to three weeks before any planned spike event and fix what it surfaces. It will find pods that are silently CPU-throttled at normal load - those are the first to die during a spike.
-->

---
layout: section
class: section-header
---

<!-- SLIDE 10 - Section: In-Cluster Intelligence -->

# Section 3
## Line 2: In-Cluster Intelligence

<!--
Speaker note: Even with platform hardening, during the provisioning window we need the cluster itself to be smart about how it handles load. This is where OpenShift's native capabilities do the heavy lifting - with zero application code changes.
-->

---

<!-- SLIDE 11 - HAProxy + Service Mesh -->

# Shape Traffic at the Container Boundary

<RhTwoColumn>
  <template #left>

  ### HAProxy Router - Rate Limiting

  OpenShift's built-in router supports **native Route annotations** for traffic shaping - no third-party ingress controller needed.

  - `haproxy.router.openshift.io/rate-limit-connections: "true"`
  - Per-pod concurrent connection limits prevent collapse under queuing
  - Per-IP rate limits block retry storms from impatient clients

  </template>
  <template #right>

  ### OpenShift Service Mesh - Circuit Breaking

  Configure **circuit breakers and outlier detection** at the mesh layer without changing application code.

  - Circuit breaker trips when error rate exceeds threshold, serving fallbacks instantly
  - Outlier detection removes struggling pods from the load balancer automatically
  - Zero application changes - configured at the platform layer

  </template>
</RhTwoColumn>

<!--
Speaker note: These are OpenShift-native capabilities. We are not introducing new technology - we are activating what is already in the platform. The key point about Service Mesh is zero application changes required. Developers do not need to implement circuit breaker libraries in their code.
-->

---
layout: section
class: section-header
---

<!-- SLIDE 12 - Section: Async Buffering -->

# Section 4
## Async Buffering: SQS + KEDA

<!--
Speaker note: For transaction-heavy workloads, the most powerful pattern is to completely decouple ingestion from processing. AWS provides the buffer, but all intelligent compute stays on ROSA.
-->

---

<!-- SLIDE 13 - SQS + KEDA -->

# Decouple Ingestion from Processing - Compute Stays on ROSA

<RhTwoColumn>
  <template #left>

  ### AWS SQS - The Shock Absorber

  SQS acts as a **virtually unlimited buffer** between your traffic edge and your compute layer.

  - Accepts millions of messages instantly with no compute overhead
  - Decouples the spike from the processing obligation
  - Provides natural back-pressure and retry semantics

  **Key principle:** SQS is dumb, cheap storage. It does not process anything. OpenShift does.

  </template>
  <template #right>

  ### KEDA on ROSA - Queue-Driven Autoscaling

  KEDA runs on ROSA and **scales worker pods based on queue depth** - not CPU.

  - Monitors SQS queue length in real time
  - Scales workers from 0 to N as the queue grows
  - Scales back to 0 when the queue is drained
  - 100% of compute processing runs on OpenShift

  **Result:** Your cluster processes transactions at exactly the rate it can handle - no more, no less.

  </template>
</RhTwoColumn>

<!--
Speaker note: This pattern eliminates the OOM kill risk for transaction workloads. The cluster never processes more than it can handle because KEDA controls the flow. And because compute stays on ROSA, your operations, security, and compliance posture stays intact. No Lambda, no serverless sprawl.
-->

---
layout: section
class: section-header
---

<!-- SLIDE 14 - Section: Edge Shielding -->

# Section 5
## Edge Shielding

<!--
Speaker note: The final layer of defense happens before traffic ever reaches your cluster. Trying to rate-limit a DDoS or a massive marketing event inside the cluster exhausts ingress bandwidth. Push that defense to the edge.
-->

---

<!-- SLIDE 15 - WAF + Virtual Waiting Rooms -->

# Stop the Storm at the Perimeter

<RhTwoColumn>
  <template #left>

  ### AWS WAF - Automated Threat Filtering

  Attached to your Application Load Balancer, WAF handles unqualified traffic so ROSA never sees it.

  - **IP rate limiting** - blocks retry storms from individual sources
  - **DDoS shielding** - absorbs volumetric attacks at the AWS network edge
  - **Bot detection** - filters automated scrapers and credential stuffers
  - Only clean, qualified traffic reaches OpenShift ingress

  </template>
  <template #right>

  ### Virtual Waiting Rooms

  For **planned high-traffic events** - launches, ticket sales, marketing drops - a waiting room holds users on static edge infrastructure and trickles them into ROSA at a controlled rate.

  - Holds 100,000+ simultaneous users on edge servers, not pods
  - Delivers users to ROSA at exactly the rate HPA can absorb
  - Provides a positive user experience vs. 502 errors
  - Examples: AWS VWR, Cloudflare Waiting Room, Queue-it

  </template>
</RhTwoColumn>

<!--
Speaker note: These two components handle very different threat models. WAF handles unplanned malicious or automated traffic. Virtual waiting rooms handle planned massive-but-legitimate events. Both prevent raw, unfiltered traffic from touching ROSA's ingress layer.
-->

---

<!-- SLIDE 16 - Complete Architecture -->

# The Complete Resilient Architecture

<SpikeArchDiagram />

<!--
Speaker note: This is what the full solution looks like end to end. Walk through each layer left to right. Each layer has a specific job - nothing overlaps, nothing is redundant. The edge absorbs the raw storm, the platform provides headroom, the cluster shapes load, the queue decouples processing. Together they eliminate the 5-minute void.
-->

---
layout: center
class: text-center
---

<!-- SLIDE 17 - CTA -->

# Your Next Spike Is Coming.

<div class="text-3xl font-bold mt-4" style="color: var(--rh-red); font-family: 'Red Hat Display', sans-serif">
Let's build your defense before it arrives.
</div>

<div class="mt-10 text-left max-w-lg mx-auto text-sm">

**Start here with Red Hat Consulting:**

- Well-Architected Review of your current ingress paths
- Balloon Pod + Karpenter configuration workshop
- OpenShift Service Mesh implementation engagement

</div>

<div class="mt-8 text-sm" style="color: var(--rh-muted)">

Contact your Red Hat account team to schedule a discovery call.

</div>

<!--
Speaker note: The question is not "will you get a spike?" It is "will you be ready?" Red Hat Consulting has implemented these patterns for customers across every industry. Let's start with a Well-Architected Review of your current ingress paths - that conversation will show us exactly where your gaps are.
-->
