export function getConfigTemplate(): string {
  return `import { defineConfig } from 'vitepress'
import { withMermaid } from '@aether-labs/vitepress-mermaid'

export default withMermaid(
  defineConfig({
    title: 'Docs'
  })
)
`
}

export function getThemeTemplate(): string {
  return `import DefaultTheme from 'vitepress/theme'
import { withMermaidTheme } from '@aether-labs/vitepress-mermaid/runtime'

export default withMermaidTheme(DefaultTheme)
`
}
