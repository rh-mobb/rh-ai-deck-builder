<template>
  <div class="nd">

    <!-- ═══════════════ ROSA Classic ═══════════════ -->
    <div class="nd-panel">
      <div class="nd-panel-head">
        <span class="nd-tag nd-tag--bad">ROSA Classic</span>
        <span class="nd-subtitle">master nodes in your account</span>
      </div>

      <div class="nd-attacker">
        <span class="nd-attacker-skull">💀</span>
        <span>Attacker</span>
      </div>

      <div class="nd-travel-zone">
        <div class="nd-travel-line"></div>
        <div
          class="nd-packet"
          :class="{
            'nd-packet--moving': phase === 'moving',
            'nd-packet--hit':    phase === 'result',
          }"
        ></div>
      </div>

      <div class="nd-vpc nd-vpc--yours" :class="{ 'nd-vpc--breach': phase === 'result' }">
        <div class="nd-vpc-label">Your AWS Account</div>
        <div class="nd-node-row">
          <div class="nd-node nd-node--danger" :class="{ 'nd-node--breach': phase === 'result' }">
            <div class="nd-node-name">Master Nodes</div>
            <div class="nd-node-sub">3 × control plane</div>
          </div>
          <div class="nd-h-wire"></div>
          <div class="nd-node">
            <div class="nd-node-name">Worker Nodes</div>
            <div class="nd-node-sub">your workloads</div>
          </div>
        </div>
      </div>

      <Transition name="nd-pop">
        <div v-if="phase === 'result'" class="nd-verdict nd-verdict--bad">
          💥 Control plane breached!
        </div>
      </Transition>
    </div>

    <div class="nd-sep"></div>

    <!-- ═══════════════ ROSA HCP ═══════════════ -->
    <div class="nd-panel">
      <div class="nd-panel-head">
        <span class="nd-tag nd-tag--good">ROSA HCP</span>
        <span class="nd-subtitle">control plane in Red Hat VPC</span>
      </div>

      <div class="nd-attacker">
        <span class="nd-attacker-skull">💀</span>
        <span>Attacker</span>
      </div>

      <div class="nd-travel-zone nd-travel-zone--short">
        <div class="nd-travel-line"></div>
        <div
          class="nd-packet nd-packet--hcp"
          :class="{
            'nd-packet--moving':  phase === 'moving',
            'nd-packet--blocked': phase === 'result',
          }"
        ></div>
      </div>

      <div class="nd-barrier" :class="{ 'nd-barrier--active': phase === 'result' }">
        <span class="nd-barrier-icon">🛡</span>
        <span class="nd-barrier-name">AWS PrivateLink</span>
        <Transition name="nd-pop">
          <span v-if="phase === 'result'" class="nd-blocked-label">✗ BLOCKED</span>
        </Transition>
      </div>

      <div class="nd-tunnel">
        <div class="nd-tunnel-line"></div>
        <span class="nd-tunnel-label">private encrypted tunnel</span>
      </div>

      <div class="nd-hcp-row">
        <div class="nd-vpc nd-vpc--redhat">
          <div class="nd-vpc-label">Red Hat VPC</div>
          <div class="nd-node nd-node--green">
            <div class="nd-node-name">Control Plane</div>
            <div class="nd-node-sub">managed by Red Hat SRE</div>
          </div>
        </div>
        <div class="nd-h-wire nd-h-wire--long"></div>
        <div class="nd-vpc">
          <div class="nd-vpc-label">Your AWS Account</div>
          <div class="nd-node">
            <div class="nd-node-name">Worker Nodes</div>
            <div class="nd-node-sub">your workloads only</div>
          </div>
        </div>
      </div>

      <Transition name="nd-pop">
        <div v-if="phase === 'result'" class="nd-verdict nd-verdict--good">
          ✓ Control plane isolated — attack surface eliminated
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const phase = ref('idle') // idle | moving | result
let timers = []

function clearTimers() {
  timers.forEach(clearTimeout)
  timers = []
}

function runCycle() {
  phase.value = 'moving'
  timers.push(setTimeout(() => {
    phase.value = 'result'
    timers.push(setTimeout(() => {
      phase.value = 'idle'
      timers.push(setTimeout(runCycle, 1400))
    }, 2600))
  }, 1300))
}

onMounted(() => { timers.push(setTimeout(runCycle, 900)) })
onUnmounted(clearTimers)
</script>

<style scoped>
/* ── Root layout ─────────────────────────────────────── */
.nd {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 0;
  font-size: 0.72rem;
  font-family: var(--slidev-rh-font-body, sans-serif);
}

.nd-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  padding: 0.1rem 1.5rem 0.5rem;
}

.nd-sep {
  width: 1px;
  background: var(--slidev-rh-border-subtle, #555);
  align-self: stretch;
  margin: 0 0.5rem;
  opacity: 0.5;
}

/* ── Panel headers ───────────────────────────────────── */
.nd-panel-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
}

.nd-tag {
  padding: 0.15rem 0.65rem;
  border-radius: 3px;
  font-weight: 700;
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-family: var(--slidev-rh-font-heading, sans-serif);
}
.nd-tag--bad  { background: #C9190B; color: #fff; }
.nd-tag--good { background: #3D7317; color: #fff; }

.nd-subtitle {
  color: var(--slidev-rh-text-secondary, #aaa);
  font-size: 0.62rem;
}

/* ── Attacker box ────────────────────────────────────── */
.nd-attacker {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(201, 25, 11, 0.1);
  border: 1.5px solid #C9190B;
  color: #ff7070;
  font-weight: 600;
  padding: 0.25rem 0.9rem;
  border-radius: 5px;
  font-size: 0.72rem;
}
.nd-attacker-skull { font-size: 0.85rem; }

/* ── Animated travel zone ────────────────────────────── */
.nd-travel-zone {
  position: relative;
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.nd-travel-zone--short { height: 32px; }

.nd-travel-line {
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, rgba(201, 25, 11, 0.5), rgba(201, 25, 11, 0.05));
}

/* ── Attack packet ───────────────────────────────────── */
.nd-packet {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #C9190B;
  box-shadow: 0 0 8px rgba(201, 25, 11, 0.9), 0 0 2px #fff;
  opacity: 0;
  transition: transform 1.2s ease-in, opacity 0.2s ease;
}

/* Classic packet - travels full distance, hits nodes */
.nd-packet--moving {
  opacity: 1;
  transform: translateX(-50%) translateY(38px);
}

.nd-packet--hit {
  opacity: 0;
  transform: translateX(-50%) translateY(48px);
  transition: transform 0.25s ease-out, opacity 0.35s ease;
}

/* HCP packet - shorter travel, stops at barrier */
.nd-packet--hcp.nd-packet--moving {
  opacity: 1;
  transform: translateX(-50%) translateY(22px);
}

.nd-packet--hcp.nd-packet--blocked {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
  transition: transform 0.25s ease-out, opacity 0.35s ease;
}

/* ── VPC containers ──────────────────────────────────── */
.nd-vpc {
  width: 100%;
  border: 1.5px solid var(--slidev-rh-border-subtle, #555);
  border-radius: 7px;
  padding: 0.45rem 0.55rem;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.35s, box-shadow 0.45s;
}

.nd-vpc-label {
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--slidev-rh-text-secondary, #aaa);
  margin-bottom: 0.45rem;
}

.nd-vpc--yours { border-color: rgba(255, 255, 255, 0.12); }

.nd-vpc--breach {
  border-color: #C9190B !important;
  box-shadow: 0 0 16px rgba(201, 25, 11, 0.35);
}

.nd-vpc--redhat {
  flex: 1;
  border-color: rgba(238, 0, 0, 0.35);
  background: rgba(238, 0, 0, 0.04);
}

/* ── Node pair (classic) ─────────────────────────────── */
.nd-node-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.nd-node {
  flex: 1;
  background: var(--slidev-rh-surface, #2a2a2a);
  border: 1px solid var(--slidev-rh-border-subtle, #555);
  border-radius: 5px;
  padding: 0.35rem 0.4rem;
  text-align: center;
  transition: border-color 0.35s, box-shadow 0.35s, background 0.35s;
}

.nd-node-name { font-weight: 600; font-size: 0.7rem; }
.nd-node-sub  { font-size: 0.58rem; color: var(--slidev-rh-text-secondary, #aaa); margin-top: 0.1rem; }

.nd-node--danger { border-color: rgba(201, 25, 11, 0.35); }

.nd-node--breach {
  border-color: #C9190B !important;
  background: rgba(201, 25, 11, 0.18) !important;
  box-shadow: 0 0 12px rgba(201, 25, 11, 0.5);
  animation: pulse-red 0.55s ease-in-out 3;
}

.nd-node--green {
  border-color: rgba(61, 115, 23, 0.5);
  background: rgba(61, 115, 23, 0.08);
}

.nd-h-wire {
  width: 14px;
  height: 1.5px;
  background: var(--slidev-rh-border-subtle, #555);
  flex-shrink: 0;
}
.nd-h-wire--long { width: 24px; }

/* ── PrivateLink barrier ─────────────────────────────── */
.nd-barrier {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.7rem;
  border: 1.5px solid var(--slidev-rh-border-subtle, #555);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.03);
  font-weight: 600;
  font-size: 0.72rem;
  transition: border-color 0.35s, box-shadow 0.45s, background 0.35s;
}

.nd-barrier--active {
  border-color: #3D7317;
  background: rgba(61, 115, 23, 0.14);
  box-shadow: 0 0 16px rgba(61, 115, 23, 0.35);
  animation: pulse-green 0.5s ease-in-out 3;
}

.nd-barrier-icon { font-size: 0.9rem; }
.nd-barrier-name { flex: 1; }

.nd-blocked-label {
  font-weight: 700;
  font-size: 0.68rem;
  color: #87BB62;
  white-space: nowrap;
}

/* ── Encrypted tunnel connector ──────────────────────── */
.nd-tunnel {
  position: relative;
  height: 22px;
  width: 2px;
  background: rgba(61, 115, 23, 0.4);
  display: flex;
  justify-content: center;
}

.nd-tunnel-label {
  position: absolute;
  left: 8px;
  top: 3px;
  font-size: 0.54rem;
  white-space: nowrap;
  color: var(--slidev-rh-text-secondary, #aaa);
}

/* ── HCP side-by-side VPCs ───────────────────────────── */
.nd-hcp-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  width: 100%;
}

.nd-hcp-row .nd-vpc { flex: 1; }

/* ── Verdict banners ─────────────────────────────────── */
.nd-verdict {
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 0.72rem;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  line-height: 1.3;
}

.nd-verdict--bad {
  background: rgba(201, 25, 11, 0.15);
  border: 1px solid #C9190B;
  color: #ff7070;
}

.nd-verdict--good {
  background: rgba(61, 115, 23, 0.15);
  border: 1px solid #3D7317;
  color: #87BB62;
}

/* ── Vue transition ──────────────────────────────────── */
.nd-pop-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.nd-pop-enter-from   { opacity: 0; transform: scale(0.88) translateY(5px); }

/* ── Keyframe animations ─────────────────────────────── */
@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 10px rgba(201, 25, 11, 0.5); }
  50%       { box-shadow: 0 0 24px rgba(201, 25, 11, 0.9), 0 0 6px #C9190B; }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 10px rgba(61, 115, 23, 0.35); }
  50%       { box-shadow: 0 0 24px rgba(61, 115, 23, 0.8), 0 0 6px #3D7317; }
}
</style>
