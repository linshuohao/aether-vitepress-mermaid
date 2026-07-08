import { resolveRuntimeOptions } from '../config/resolveOptions'
import type { MermaidRuntime, MermaidRuntimeOptions } from '../shared/types'
import { loadMermaid } from './loadMermaid'

export function createMermaidRuntime(
  options: MermaidRuntimeOptions = {}
): MermaidRuntime {
  const resolved = resolveRuntimeOptions(options)

  return {
    async render(input) {
      const mermaid = await loadMermaid()

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: resolved.securityLevel,
        theme: input.isDark ? resolved.theme.dark : resolved.theme.light,
        ...resolved.mermaidOptions
      })

      const result = await mermaid.render(input.id, input.code)

      input.container.innerHTML = result.svg

      if (input.interactive && typeof result.bindFunctions === 'function') {
        result.bindFunctions(input.container)
      }
    }
  }
}
