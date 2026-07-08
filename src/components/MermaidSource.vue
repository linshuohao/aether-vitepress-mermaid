<script setup lang="ts">
defineProps<{
  code: string
}>()
</script>

<template>
  <details class="vp-mermaid-source">
    <summary>查看 Mermaid 源码</summary>
    <pre><code>{{ code }}</code></pre>
  </details>
</template>
