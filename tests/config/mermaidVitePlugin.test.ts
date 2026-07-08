import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { injectMermaidAppSetup } from '../../src/config/mermaidVitePlugin'

const vitepressAppEntry = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../node_modules/vitepress/dist/client/app/index.js'
)

describe('injectMermaidAppSetup', () => {
  it('injects imports and registers MermaidDiagram in the VitePress app entry', () => {
    const source = readFileSync(vitepressAppEntry, 'utf8')
    const result = injectMermaidAppSetup(source)

    expect(result).not.toBeNull()
    expect(result).toContain("import '@aether-labs/vitepress-mermaid/style.css'")
    expect(result).toContain(
      "import { MermaidDiagram, installMermaid } from '@aether-labs/vitepress-mermaid/runtime'"
    )
    expect(result).toContain("import mermaidRuntimeOptions from 'virtual:aether-mermaid-runtime-options'")
    expect(result).toContain("app.component('MermaidDiagram', MermaidDiagram)")
    expect(result).toContain('installMermaid(app, mermaidRuntimeOptions)')
  })

  it('returns null when the VitePress app entry marker is absent', () => {
    expect(injectMermaidAppSetup('export const app = {}')).toBeNull()
  })
})
