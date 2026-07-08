import type { UserConfig } from 'vitepress'
import { mermaidPlugin } from '../plugin'
import { mermaidVitePlugin } from './mermaidVitePlugin'
import { resolvePluginOptions, resolveRuntimeOptions } from './resolveOptions'
import type { MermaidOptions } from '../shared/types'

export function withMermaid(
  config: UserConfig,
  options: MermaidOptions = {}
): UserConfig {
  const resolvedMarkdownOptions = resolvePluginOptions(options.markdown)
  const resolvedRuntimeOptions = resolveRuntimeOptions(options.runtime)
  const userMarkdownConfig = config.markdown?.config
  const userViteConfig = config.vite ?? {}
  const userPlugins = userViteConfig.plugins ?? []

  return {
    ...config,
    markdown: {
      ...config.markdown,
      config(md) {
        userMarkdownConfig?.(md)
        md.use(mermaidPlugin(resolvedMarkdownOptions))
      }
    },
    vite: {
      ...userViteConfig,
      plugins: [...userPlugins, mermaidVitePlugin(resolvedRuntimeOptions)]
    }
  }
}
