<template>
  <div class="ac">

    <!-- ══════════ ROSA Classic ══════════ -->
    <div class="ac-panel">
      <div class="ac-panel-head">
        <span class="ac-badge ac-badge--bad">ROSA Classic</span>
        <span class="ac-count">9+ nodes in your AWS account</span>
      </div>

      <div class="ac-account">
        <div class="ac-account-label">Your AWS Account</div>

        <div class="ac-group">
          <div class="ac-group-label ac-group-label--bad">
            Master Nodes · 3
            <span class="ac-group-note">control plane — your availability</span>
          </div>
          <div class="ac-nodes">
            <div
              v-for="i in 3" :key="'m'+i"
              class="ac-node ac-node--master"
            >
              <span class="ac-node-icon">M</span>
            </div>
          </div>
        </div>

        <div class="ac-group">
          <div class="ac-group-label ac-group-label--warn">
            Infrastructure Nodes · 3
            <span class="ac-group-note">platform services — your ops</span>
          </div>
          <div class="ac-nodes">
            <div
              v-for="i in 3" :key="'i'+i"
              class="ac-node ac-node--infra"
            >
              <span class="ac-node-icon">I</span>
            </div>
          </div>
        </div>

        <div class="ac-group">
          <div class="ac-group-label ac-group-label--ok">
            Worker Nodes · 3+
            <span class="ac-group-note">your workloads</span>
          </div>
          <div class="ac-nodes">
            <div v-for="i in 3" :key="'w'+i" class="ac-node ac-node--worker">
              <span class="ac-node-icon">W</span>
            </div>
            <div class="ac-node ac-node--more">+N</div>
          </div>
        </div>
      </div>

      <div class="ac-verdict ac-verdict--bad">
        💸 6 of 9 nodes are control-plane overhead
      </div>
    </div>

    <div class="ac-sep"></div>

    <!-- ══════════ ROSA HCP ══════════ -->
    <div class="ac-panel">
      <div class="ac-panel-head">
        <span class="ac-badge ac-badge--good">ROSA HCP</span>
        <span class="ac-count">2+ nodes in your AWS account</span>
      </div>

      <div class="ac-hcp-layout">
        <div class="ac-account ac-account--redhat">
          <div class="ac-account-label">Red Hat AWS Account</div>
          <div class="ac-group">
            <div class="ac-group-label ac-group-label--rh">
              Hosted Control Plane
              <span class="ac-group-note">Red Hat SRE · not your bill</span>
            </div>
            <div class="ac-nodes">
              <div class="ac-node ac-node--rh">
                <span class="ac-node-icon">⎈</span>
              </div>
              <div class="ac-node ac-node--rh ac-node--rh2">
                <span class="ac-node-icon">⎈</span>
              </div>
              <div class="ac-node ac-node--rh ac-node--rh3">
                <span class="ac-node-icon">⎈</span>
              </div>
            </div>
          </div>
          <div class="ac-rh-note">Managed · patched · monitored by Red Hat</div>
        </div>

        <div class="ac-pl">
          <div class="ac-pl-wire"></div>
          <div class="ac-pl-label">🔒 PrivateLink</div>
          <div class="ac-pl-wire"></div>
        </div>

        <div class="ac-account">
          <div class="ac-account-label">Your AWS Account</div>
          <div class="ac-group">
            <div class="ac-group-label ac-group-label--ok">
              Worker Nodes · 2+
              <span class="ac-group-note">your workloads only</span>
            </div>
            <div class="ac-nodes">
              <div v-for="i in 2" :key="'hw'+i" class="ac-node ac-node--worker">
                <span class="ac-node-icon">W</span>
              </div>
              <div class="ac-node ac-node--more">+N</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ac-verdict ac-verdict--good">
        ✓ 6 fewer EC2 instances — control plane is Red Hat's problem
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* ── Root ────────────────────────────────────── */
.ac {
  display: flex;
  width: 100%;
  height: 100%;
  font-family: var(--slidev-rh-font-body, sans-serif);
  font-size: 0.7rem;
}

.ac-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.55rem;
  padding: 0.1rem 1.2rem 0.4rem;
}

.ac-sep {
  width: 1px;
  background: var(--slidev-rh-border-subtle, #555);
  align-self: stretch;
  margin: 0 0.5rem;
  opacity: 0.4;
}

/* ── Panel header ────────────────────────────── */
.ac-panel-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.ac-badge {
  padding: 0.15rem 0.65rem;
  border-radius: 3px;
  font-weight: 700;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-family: var(--slidev-rh-font-heading, sans-serif);
}
.ac-badge--bad  { background: #C9190B; color: #fff; }
.ac-badge--good { background: #3D7317; color: #fff; }

.ac-count {
  font-size: 0.65rem;
  color: var(--slidev-rh-text-secondary, #aaa);
}

/* ── Account boxes ───────────────────────────── */
.ac-account {
  border: 1.5px solid var(--slidev-rh-border-subtle, #555);
  border-radius: 7px;
  padding: 0.5rem 0.6rem;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.ac-account--redhat {
  border-color: rgba(238, 0, 0, 0.35);
  background: rgba(238, 0, 0, 0.04);
}

.ac-account-label {
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--slidev-rh-text-secondary, #aaa);
}

/* ── Node groups ─────────────────────────────── */
.ac-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.ac-group-label {
  font-size: 0.62rem;
  font-weight: 600;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.ac-group-note {
  font-weight: 400;
  font-size: 0.56rem;
  color: var(--slidev-rh-text-secondary, #aaa);
}

.ac-group-label--bad  { color: #ff7070; }
.ac-group-label--warn { color: #F0AB00; }
.ac-group-label--ok   { color: #87BB62; }
.ac-group-label--rh   { color: #73BCF7; }

.ac-rh-note {
  font-size: 0.56rem;
  color: var(--slidev-rh-text-secondary, #aaa);
  font-style: italic;
  text-align: center;
}

/* ── Nodes ───────────────────────────────────── */
.ac-nodes {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.ac-node {
  width: 38px;
  height: 38px;
  border-radius: 5px;
  border: 1.5px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.65rem;
}

.ac-node-icon { font-size: 0.72rem; }

.ac-node--master {
  border-color: rgba(201, 25, 11, 0.5);
  background: rgba(201, 25, 11, 0.08);
  color: #ff7070;
}

.ac-node--infra {
  border-color: rgba(240, 171, 0, 0.5);
  background: rgba(240, 171, 0, 0.08);
  color: #F0AB00;
}

.ac-node--worker {
  border-color: rgba(61, 115, 23, 0.5);
  background: rgba(61, 115, 23, 0.08);
  color: #87BB62;
}

.ac-node--more {
  border-color: var(--slidev-rh-border-subtle, #555);
  background: transparent;
  color: var(--slidev-rh-text-secondary, #aaa);
  font-size: 0.6rem;
}

.ac-node--rh {
  border-color: rgba(115, 188, 247, 0.5);
  background: rgba(115, 188, 247, 0.08);
  color: #73BCF7;
  font-size: 1rem;
}
.ac-node--rh2 { opacity: 0.65; }
.ac-node--rh3 { opacity: 0.35; }

/* ── HCP layout ──────────────────────────────── */
.ac-hcp-layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  width: 100%;
}

.ac-pl {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0;
  flex-shrink: 0;
}

.ac-pl-wire {
  height: 1px;
  flex: 1;
  background: rgba(115, 188, 247, 0.4);
}

.ac-pl-label {
  font-size: 0.54rem;
  color: #73BCF7;
  letter-spacing: 0.05em;
  font-weight: 600;
  white-space: nowrap;
}

/* ── Verdict banners ─────────────────────────── */
.ac-verdict {
  font-weight: 700;
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  text-align: center;
}

.ac-verdict--bad {
  background: rgba(201, 25, 11, 0.14);
  border: 1px solid #C9190B;
  color: #ff7070;
}

.ac-verdict--good {
  background: rgba(61, 115, 23, 0.14);
  border: 1px solid #3D7317;
  color: #87BB62;
}

</style>
