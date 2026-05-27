<template>
  <div class="slidev-layout rh-section">
    <div class="rh-section-content">
      <div class="rh-section-accent" />
      <div class="rh-section-text">
        <slot />
      </div>
    </div>
    <div class="rh-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.rh-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--slidev-rh-bg-alt);
  padding: var(--slidev-rh-space-3xl);
  position: relative;
  height: 100%;
  overflow: hidden;
}

.rh-section-content {
  display: flex;
  align-items: flex-start;
  gap: var(--slidev-rh-space-xl);
}

.rh-section-accent {
  width: 8px;
  min-height: 4rem;
  background: var(--slidev-rh-brand-red);
  border-radius: 2px;
  flex-shrink: 0;
  align-self: stretch;
}

.rh-section-text :deep(h1) {
  font-size: 3rem;
  font-weight: 700;
}

.rh-section-text :deep(p) {
  color: var(--slidev-rh-text-secondary);
  font-size: 1.25rem;
  margin-top: var(--slidev-rh-space-lg);
}

.rh-footer {
  position: absolute;
  bottom: var(--slidev-rh-space-md);
  left: var(--slidev-rh-space-3xl);
  right: var(--slidev-rh-space-3xl);
  font-size: 0.75rem;
  color: var(--slidev-rh-text-secondary);
}

.rh-footer:empty {
  display: none;
}
</style>
