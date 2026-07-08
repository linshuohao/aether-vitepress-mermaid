import type { ResolvedMermaidRuntimeOptions } from '../shared/types'

interface MermaidVitePlugin {
  name: string
  enforce: 'post'
  resolveId(id: string): string | undefined
  load(id: string): string | undefined
  transform(code: string, id: string): { code: string; map: null } | undefined
}

const VIRTUAL_MODULE_ID = 'virtual:aether-mermaid-runtime-options'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`
const VITEPRESS_APP_ENTRY = 'vitepress/dist/client/app/index.js'
const CLIENT_ONLY_MARKER = "app.component('ClientOnly', ClientOnly);"

export function injectMermaidAppSetup(source: string): string | null {
  if (!source.includes(CLIENT_ONLY_MARKER)) return null

  const injection = `${CLIENT_ONLY_MARKER}
    app.component('MermaidDiagram', MermaidDiagram)
    installMermaid(app, mermaidRuntimeOptions)`

  return [
    `import '@aether-labs/vitepress-mermaid/style.css'`,
    `import { MermaidDiagram, installMermaid } from '@aether-labs/vitepress-mermaid/runtime'`,
    `import mermaidRuntimeOptions from '${VIRTUAL_MODULE_ID}'`,
    source.replace(CLIENT_ONLY_MARKER, injection)
  ].join('\n')
}

export function mermaidVitePlugin(
  runtimeOptions: ResolvedMermaidRuntimeOptions
): MermaidVitePlugin {
  return {
    name: 'aether-vitepress-mermaid',
    enforce: 'post',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(runtimeOptions)}`
      }
    },

    transform(code, id) {
      if (!id.includes(VITEPRESS_APP_ENTRY)) return

      const next = injectMermaidAppSetup(code)
      if (!next) return

      return { code: next, map: null }
    }
  }
}
