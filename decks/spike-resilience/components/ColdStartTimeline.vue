<!--
  ColdStartTimeline.vue - Pattern B reactive phase animation.

  Animates the 5 phases of a cold-start traffic spike:
    1. At Rest        - normal operations, healthy pods
    2. Spike Hits     - 0s, traffic surges, pods crash
    3. HPA Triggers   - ~10s, autoscaler fires, EC2 requested
    4. The Void       - 30s-5min, EC2 provisioning, users abandoning
    5. Too Late       - 5min+, new pods ready but users gone

  See AGENTS.md → "Animated components → Pattern B" for authoring guide.
-->
<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useIsSlideActive } from '@slidev/client'

type StatusState = 'ok' | 'warn' | 'danger' | 'recover' | 'gone'

interface StatusItem { label: string; state: StatusState }
interface Phase {
  label: string
  timeRange: string
  sublabel: string
  pods: StatusItem
  infra: StatusItem
  users: StatusItem
  isVoid: boolean
}

const PHASES: Phase[] = [
  {
    label: 'At Rest',
    timeRange: 'Normal',
    sublabel: 'Steady traffic. All pods healthy. Cluster operating normally.',
    pods:  { label: 'Healthy',       state: 'ok'      },
    infra: { label: 'Idle',          state: 'ok'      },
    users: { label: 'Fully served',  state: 'ok'      },
    isVoid: false,
  },
  {
    label: 'Spike Hits',
    timeRange: '0 seconds',
    sublabel: 'Traffic surges 10x instantly. Existing pods absorb the shock - OOM kills begin.',
    pods:  { label: 'Crashing',      state: 'danger'  },
    infra: { label: 'Overwhelmed',   state: 'danger'  },
    users: { label: 'Degraded',      state: 'warn'    },
    isVoid: false,
  },
  {
    label: 'HPA Triggers',
    timeRange: '~10 seconds',
    sublabel: 'Autoscaler fires. EC2 API request sent to AWS. Now we wait.',
    pods:  { label: 'Failing',       state: 'danger'  },
    infra: { label: 'EC2 requested', state: 'warn'    },
    users: { label: 'Failing',       state: 'danger'  },
    isVoid: false,
  },
  {
    label: 'THE VOID',
    timeRange: '30s - 5 minutes',
    sublabel: 'EC2 provisioning. Instance joining. Image pulling. Readiness probes. Your users are not waiting.',
    pods:  { label: 'Down',          state: 'danger'  },
    infra: { label: 'Provisioning',  state: 'warn'    },
    users: { label: 'Abandoning',    state: 'danger'  },
    isVoid: true,
  },
  {
    label: 'Too Late',
    timeRange: '5+ minutes',
    sublabel: 'New pods are finally ready. The spike is over. Most users have already left.',
    pods:  { label: 'Ready (late)',  state: 'recover' },
    infra: { label: 'Scaled up',     state: 'ok'      },
    users: { label: 'Gone',          state: 'gone'    },
    isVoid: false,
  },
]

const PHASE_MS = 4000
const TICK_MS  = 60

const phaseIndex = ref(0)
const progress   = ref(0)
const paused     = ref(false)
const current    = computed(() => PHASES[phaseIndex.value])

let phaseTimer:    ReturnType<typeof setInterval> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null

function stopTimers() {
  if (phaseTimer)    { clearInterval(phaseTimer);    phaseTimer    = null }
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
}

function startTimers() {
  stopTimers()
  phaseTimer = setInterval(() => {
    phaseIndex.value = (phaseIndex.value + 1) % PHASES.length
    progress.value = 0
  }, PHASE_MS)
  progressTimer = setInterval(() => {
    progress.value = Math.min(100, progress.value + (TICK_MS / PHASE_MS) * 100)
  }, TICK_MS)
}

function selectPhase(i: number) {
  if (paused.value && i === phaseIndex.value) {
    paused.value = false
    progress.value = 0
    startTimers()
  } else {
    phaseIndex.value = i
    paused.value = true
    progress.value = 100
    stopTimers()
  }
}

const isActive = useIsSlideActive()
watch(isActive, (active) => {
  if (active) {
    paused.value     = false
    phaseIndex.value = 0
    progress.value   = 0
    startTimers()
  } else {
    stopTimers()
    phaseIndex.value = 0
    progress.value   = 0
    paused.value     = false
  }
}, { immediate: true })

onUnmounted(() => stopTimers())

const STATE_COLORS: Record<StatusState, string> = {
  ok:      '#5BA352',
  warn:    '#F0AB00',
  danger:  '#ef4444',
  recover: '#73BCF7',
  gone:    '#707070',
}

const STATE_ICONS: Record<StatusState, string> = {
  ok:      '✓',
  warn:    '⚠',
  danger:  '✗',
  recover: '↻',
  gone:    '○',
}
</script>

<template>
  <div class="cst-root">
    <!-- Phase header -->
    <div class="cst-header">
      <div class="cst-dots">
        <span
          v-for="(p, i) in PHASES"
          :key="i"
          class="cst-dot"
          :class="{ active: i === phaseIndex, paused: paused && i === phaseIndex, void: p.isVoid }"
          @click="selectPhase(i)"
          :title="p.label"
        />
      </div>
      <div class="cst-label-main" :class="{ void: current.isVoid }">{{ current.label }}</div>
      <div class="cst-label-sub">
        {{ current.timeRange }}
        <span v-if="paused" class="cst-resume-hint"> · click dot to resume</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="cst-track">
      <div class="cst-bar" :class="{ paused }" :style="{ width: progress + '%' }" />
    </div>

    <!-- Timeline segments -->
    <div class="cst-timeline">
      <div
        v-for="(p, i) in PHASES"
        :key="i"
        class="cst-seg"
        :class="{ active: i === phaseIndex, void: p.isVoid }"
        @click="selectPhase(i)"
      >
        <div class="cst-seg-label" :class="{ void: p.isVoid }">{{ p.label }}</div>
        <div class="cst-seg-time">{{ p.timeRange }}</div>
      </div>
    </div>

    <!-- Status cards -->
    <div class="cst-cards">
      <div
        v-for="card in [
          { label: 'Pods',    item: current.pods  },
          { label: 'Cluster', item: current.infra },
          { label: 'Users',   item: current.users },
        ]"
        :key="card.label"
        class="cst-card"
        :style="{
          borderColor: STATE_COLORS[card.item.state] + '55',
          background:  STATE_COLORS[card.item.state] + '12',
        }"
      >
        <div class="cst-card-icon" :style="{ color: STATE_COLORS[card.item.state] }">
          {{ STATE_ICONS[card.item.state] }}
        </div>
        <div class="cst-card-cat">{{ card.label }}</div>
        <div class="cst-card-val" :style="{ color: STATE_COLORS[card.item.state] }">
          {{ card.item.label }}
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="cst-desc">{{ current.sublabel }}</div>
  </div>
</template>

<style scoped>
.cst-root {
  font-family: 'JetBrains Mono', monospace;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Header ─────────────────────────────────────────────── */
.cst-header { text-align: center; }

.cst-dots { display: flex; gap: 6px; justify-content: center; margin-bottom: 5px; }
.cst-dot  {
  width: 8px; height: 8px; border-radius: 50%;
  background: #2e2e2e; border: 1.5px solid #444;
  cursor: pointer; transition: all 0.3s ease;
}
.cst-dot:hover    { background: #555; }
.cst-dot.active   { background: #EE0000; border-color: #EE0000; transform: scale(1.4); }
.cst-dot.void.active { background: #ef4444; border-color: #ef4444; }
.cst-dot.paused   { box-shadow: 0 0 0 2px #EE0000; }

.cst-label-main {
  font-size: 0.85em; font-weight: 700; color: #e2e2e2;
  letter-spacing: 0.08em; text-transform: uppercase;
  transition: color 0.4s ease;
}
.cst-label-main.void { color: #ef4444; }

.cst-label-sub    { font-size: 0.62em; color: #666; margin-top: 2px; }
.cst-resume-hint  { color: #4a4a4a; font-style: italic; }

/* ── Progress bar ────────────────────────────────────────── */
.cst-track { height: 2px; background: #1e1e1e; border-radius: 1px; overflow: hidden; }
.cst-bar   { height: 100%; background: #EE0000; border-radius: 1px; transition: width 0.06s linear; }
.cst-bar.paused { background: #444; }

/* ── Timeline ────────────────────────────────────────────── */
.cst-timeline {
  display: flex;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  overflow: hidden;
}

.cst-seg {
  flex: 1;
  padding: 7px 4px;
  text-align: center;
  cursor: pointer;
  background: #161616;
  border-right: 1px solid #2a2a2a;
  transition: background 0.4s ease;
}
.cst-seg:last-child       { border-right: none; }
.cst-seg.void             { flex: 1.9; }
.cst-seg.active           { background: rgba(238,0,0,0.1); }
.cst-seg.void.active      { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.35); }

.cst-seg-label {
  font-size: 0.58em; font-weight: 700; color: #555;
  text-transform: uppercase; letter-spacing: 0.04em;
  transition: color 0.4s ease;
}
.cst-seg.active .cst-seg-label { color: #EE0000; }
.cst-seg-label.void             { color: #ef4444; }
.cst-seg.active .cst-seg-label.void { color: #ef4444; }

.cst-seg-time { font-size: 0.5em; color: #3d3d3d; margin-top: 2px; }
.cst-seg.active .cst-seg-time { color: #777; }

/* ── Status cards ────────────────────────────────────────── */
.cst-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.cst-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  text-align: center;
  transition: border-color 0.4s ease, background 0.4s ease;
}

.cst-card-icon { font-size: 1.1em; margin-bottom: 3px; transition: color 0.4s ease; }
.cst-card-cat  { font-size: 0.5em; text-transform: uppercase; letter-spacing: 0.07em; color: #555; margin-bottom: 3px; }
.cst-card-val  { font-size: 0.72em; font-weight: 700; transition: color 0.4s ease; }

/* ── Description ─────────────────────────────────────────── */
.cst-desc {
  font-size: 0.65em;
  color: #888;
  text-align: center;
  line-height: 1.5;
  min-height: 2.4em;
  transition: color 0.3s ease;
}
</style>
