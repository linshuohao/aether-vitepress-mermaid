import type { Theme } from 'vitepress'
import MermaidDiagram from '../components/MermaidDiagram.vue'
import { installMermaid } from './installMermaid'
import type { MermaidRuntimeOptions } from '../shared/types'
import '../styles/index.css'

export function withMermaidTheme(
  theme: Theme,
  options: MermaidRuntimeOptions = {}
): Theme {
  return {
    ...theme,
    enhanceApp(ctx) {
      theme.enhanceApp?.(ctx)
      ctx.app.component('MermaidDiagram', MermaidDiagram)
      installMermaid(ctx.app, options)
    }
  }
}
