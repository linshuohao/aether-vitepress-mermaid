<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import MermaidError from './MermaidError.vue'
import MermaidLoading from './MermaidLoading.vue'
import MermaidSource from './MermaidSource.vue'
import { createMermaidRuntime } from '../runtime/createMermaidRuntime'
import { mermaidRuntimeKey } from '../runtime/injectionKeys'

const props = defineProps<{
  id: string
  code: string
  title?: string
  interactive?: boolean
  showSource?: boolean
}>()

const { isDark } = useData()
const runtime = inject(mermaidRuntimeKey, createMermaidRuntime())

const error = ref('')
const loading = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const decodedCode = computed(() => {
  try {
    return decodeURIComponent(props.code)
  } catch {
    return props.code
  }
})

async function render() {
  if (typeof window === 'undefined') return
  if (!containerRef.value) return

  loading.value = true
  error.value = ''

  await nextTick()

  try {
    await runtime.render({
      id: `${props.id}-${isDark.value ? 'dark' : 'light'}`,
      code: decodedCode.value,
      isDark: isDark.value,
      container: containerRef.value,
      interactive: props.interactive
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

onMounted(render)

watch(
  [() => props.code, () => props.id, isDark],
  () => {
    render()
  },
  { flush: 'post' }
)
</script>

<template>
  <figure class="vp-mermaid-diagram">
    <figcaption v-if="title" class="vp-mermaid-title">
      {{ title }}
    </figcaption>

    <MermaidLoading v-if="loading" />

    <div
      ref="containerRef"
      class="vp-mermaid-container"
      :data-mermaid-id="id"
    />

    <MermaidError v-if="error" :message="error" />

    <MermaidSource v-if="error || showSource" :code="decodedCode" />
  </figure>
</template>
