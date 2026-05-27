<template>
  <div class="slidev-layout rh-image-right">
    <div class="rh-content-side">
      <div class="rh-accent-bar" />
      <div class="rh-content-inner">
        <slot />
      </div>
    </div>
    <div class="rh-image-side" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const imageStyle = computed(() => ({
  backgroundImage: `url(${$frontmatter.image})`,
  backgroundSize: $frontmatter.backgroundSize || 'cover',
  backgroundPosition: $frontmatter.backgroundPosition || 'center',
}))
</script>

<style scoped>
.rh-image-right {
  display: flex;
  padding: 0;
}

.rh-content-side {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.rh-accent-bar {
  height: 4px;
  background: var(--slidev-rh-brand-red);
  flex-shrink: 0;
}

.rh-content-inner {
  flex: 1;
  padding: var(--slidev-rh-space-3xl);
  overflow: auto;
}

.rh-image-side {
  width: 50%;
  flex-shrink: 0;
}
</style>
