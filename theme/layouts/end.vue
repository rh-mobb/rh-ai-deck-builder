<template>
  <div class="slidev-layout rh-end">
    <div class="rh-end-content">
      <slot />
    </div>
    <div class="rh-end-bar" />
  </div>
</template>

<style scoped>
.rh-end {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--slidev-rh-space-3xl);
  position: relative;
}

.rh-end-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rh-end-content :deep(h1) {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--slidev-rh-space-xl);
}

.rh-end-content :deep(p) {
  color: var(--slidev-rh-text-secondary);
  font-size: 1.125rem;
  margin-bottom: var(--slidev-rh-space-md);
}

.rh-end-content :deep(a) {
  color: var(--slidev-rh-link);
}

.rh-end-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--slidev-rh-brand-red);
}
</style>
