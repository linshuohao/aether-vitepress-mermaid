<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="vp-mermaid-error" role="alert">
    <strong>Mermaid 渲染失败</strong>
    <p>{{ message }}</p>
  </div>
</template>
