import { defineConfig } from 'vitepress'
import { withMermaid } from '../../../src'

export default withMermaid(
  defineConfig({
    title: 'Mermaid Playground',
    description: 'Playground for @aether-labs/vitepress-mermaid'
  })
)
