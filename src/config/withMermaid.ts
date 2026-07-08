import type { UserConfig } from 'vitepress'
import { mermaidPlugin } from '../plugin'
import { resolvePluginOptions } from './resolveOptions'
import type { MermaidOptions } from '../shared/types'

export function withMermaid(
  config: UserConfig,
  options: MermaidOptions = {}
): UserConfig {
  const resolvedMarkdownOptions = resolvePluginOptions(options.markdown)
  const userMarkdownConfig = config.markdown?.config

  return {
    ...config,
    markdown: {
      ...config.markdown,
      config(md) {
        userMarkdownConfig?.(md)
        md.use(mermaidPlugin(resolvedMarkdownOptions))
      }
    }
  }
}
