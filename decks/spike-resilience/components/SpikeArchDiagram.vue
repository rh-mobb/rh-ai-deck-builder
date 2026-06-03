<!--
  SpikeArchDiagram.vue - Static complete defense-in-depth architecture diagram.

  Shows the full traffic path:
    Internet -> AWS Edge Shield (WAF + Waiting Room + ALB)
             -> ROSA HCP boundary (HAProxy -> Service Mesh -> App Pods)
             -> Supporting infra: Balloon Pods + Karpenter, SQS, KEDA

  Static component - no animation needed here.
-->
<template>
  <div class="sad-root">

    <!-- Main horizontal flow -->
    <div class="sad-flow">

      <!-- Traffic source -->
      <div class="sad-source">
        <div class="sad-source-icon">⚡</div>
        <div class="sad-source-label">Traffic Spike</div>
        <div class="sad-source-sub">10x surge</div>
      </div>

      <div class="sad-connector">→</div>

      <!-- AWS Edge box -->
      <div class="sad-box-aws">
        <div class="sad-box-header">AWS Edge Shield</div>
        <div class="sad-chips">
          <div class="sad-chip sad-chip-aws">WAF + DDoS Shield</div>
          <div class="sad-chip sad-chip-aws">Virtual Waiting Room</div>
          <div class="sad-chip sad-chip-aws">Application LB</div>
        </div>
      </div>

      <div class="sad-connector">→</div>

      <!-- ROSA HCP boundary -->
      <div class="sad-rosa">
        <div class="sad-rosa-badge">ROSA HCP</div>

        <!-- Traffic path inside ROSA -->
        <div class="sad-rosa-path">
          <div class="sad-node sad-node-ocp">
            <div class="sad-node-name">HAProxy Router</div>
            <div class="sad-node-desc">Rate Limiting</div>
          </div>
          <div class="sad-arrow-sm">→</div>
          <div class="sad-node sad-node-ocp">
            <div class="sad-node-name">Service Mesh</div>
            <div class="sad-node-desc">Circuit Breaking</div>
          </div>
          <div class="sad-arrow-sm">→</div>
          <div class="sad-node sad-node-pods">
            <div class="sad-node-name">App Pods</div>
            <div class="sad-node-desc">Your workload</div>
          </div>
        </div>

        <!-- Supporting infrastructure layer -->
        <div class="sad-rosa-infra">
          <div class="sad-infra">
            <div class="sad-infra-name">Balloon Pods</div>
            <div class="sad-infra-sub">+ Karpenter</div>
          </div>
          <div class="sad-infra">
            <div class="sad-infra-name">SQS Queue</div>
            <div class="sad-infra-sub">Shock absorber</div>
          </div>
          <div class="sad-infra">
            <div class="sad-infra-name">KEDA</div>
            <div class="sad-infra-sub">Queue-driven scale</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="sad-legend">
      <div class="sad-legend-item">
        <span class="sad-pip" style="background: #F0AB00"></span>AWS Edge
      </div>
      <div class="sad-legend-item">
        <span class="sad-pip" style="background: #EE0000"></span>OpenShift Platform
      </div>
      <div class="sad-legend-item">
        <span class="sad-pip" style="background: #5BA352"></span>App Workload
      </div>
      <div class="sad-legend-item">
        <span class="sad-pip" style="background: #818cf8"></span>Platform Infra
      </div>
    </div>
  </div>
</template>

<style scoped>
.sad-root {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.15em;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 6px 0;
}

/* ── Main flow row ──────────────────────────────────────────── */
.sad-flow {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sad-connector {
  color: #555;
  font-size: 1.3em;
  flex-shrink: 0;
}

/* ── Traffic source ─────────────────────────────────────────── */
.sad-source {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  min-width: 72px;
}
.sad-source-icon  { font-size: 1.5em; }
.sad-source-label { font-size: 0.58em; font-weight: 700; color: #e2e2e2; text-transform: uppercase; letter-spacing: 0.05em; }
.sad-source-sub   { font-size: 0.48em; color: #555; }

/* ── AWS Edge box ───────────────────────────────────────────── */
.sad-box-aws {
  border: 1px solid rgba(240,171,0,0.3);
  background: rgba(240,171,0,0.07);
  border-radius: 8px;
  padding: 10px 13px;
  flex-shrink: 0;
}
.sad-box-header {
  font-size: 0.58em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #F0AB00;
  margin-bottom: 8px;
  text-align: center;
}
.sad-chips        { display: flex; flex-direction: column; gap: 5px; }
.sad-chip         { font-size: 0.5em; padding: 3px 10px; border-radius: 4px; text-align: center; }
.sad-chip-aws     { background: rgba(240,171,0,0.15); border: 1px solid rgba(240,171,0,0.25); color: #F0AB00; }

/* ── ROSA HCP boundary ──────────────────────────────────────── */
.sad-rosa {
  flex: 1;
  border: 1.5px dashed rgba(238,0,0,0.4);
  border-radius: 10px;
  padding: 14px 14px 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sad-rosa-badge {
  position: absolute;
  top: -9px;
  left: 14px;
  background: #ffffff;
  padding: 0 7px;
  font-size: 0.52em;
  font-weight: 700;
  color: #EE0000;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ── Traffic path row inside ROSA ───────────────────────────── */
.sad-rosa-path {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sad-arrow-sm { color: #444; font-size: 1em; flex-shrink: 0; }

.sad-node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  text-align: center;
}
.sad-node-ocp  { background: rgba(238,0,0,0.1); border-color: rgba(238,0,0,0.25); }
.sad-node-pods { background: rgba(91,163,82,0.1); border-color: rgba(91,163,82,0.25); }

.sad-node-name { font-size: 0.6em; font-weight: 700; margin-bottom: 2px; }
.sad-node-ocp  .sad-node-name  { color: #EE0000; }
.sad-node-pods .sad-node-name  { color: #5BA352; }
.sad-node-desc { font-size: 0.46em; color: #555; }

/* ── Supporting infra row ───────────────────────────────────── */
.sad-rosa-infra {
  display: flex;
  gap: 6px;
}
.sad-infra {
  flex: 1;
  padding: 10px 8px;
  border-radius: 6px;
  border: 1px solid rgba(99,102,241,0.25);
  background: rgba(99,102,241,0.08);
  text-align: center;
}
.sad-infra-name { font-size: 0.52em; font-weight: 700; color: #818cf8; }
.sad-infra-sub  { font-size: 0.44em; color: #4a4a4a; margin-top: 2px; }

/* ── Legend ─────────────────────────────────────────────────── */
.sad-legend {
  display: flex;
  gap: 18px;
  justify-content: center;
}
.sad-legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.5em;
  color: #555;
}
.sad-pip {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}
</style>
