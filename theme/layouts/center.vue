<template>
  <div class="slidev-layout rh-center">
    <div class="rh-accent-bar" />
    <div class="rh-center-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.rh-center {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--slidev-rh-space-3xl);
}
</style>
