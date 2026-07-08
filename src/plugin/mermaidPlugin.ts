import type MarkdownIt from 'markdown-it'
import { resolvePluginOptions } from '../config/resolveOptions'
import type { MermaidPluginOptions } from '../shared/types'
import { createDiagramId } from './createDiagramId'
import { encodeCode } from './encodeCode'
import { parseFenceInfo } from './parseFenceInfo'
import { renderComponent } from './renderComponent'

export function mermaidPlugin(options: MermaidPluginOptions = {}) {
  const resolved = resolvePluginOptions(options)

  return function apply(md: MarkdownIt) {
    const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules)

    md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
      const token = tokens[idx]
      const parsed = parseFenceInfo(token.info)

      if (!resolved.languages.includes(parsed.lang)) {
        return defaultFence
          ? defaultFence(tokens, idx, opts, env, self)
          : self.renderToken(tokens, idx, opts)
      }

      const id = createDiagramId({
        code: token.content,
        idx,
        env
      })

      return renderComponent({
        id,
        code: encodeCode(token.content),
        componentName: resolved.componentName,
        className: resolved.className,
        clientOnly: resolved.clientOnly,
        meta: {
          ...resolved.defaultMeta,
          ...parsed.meta
        }
      })
    }
  }
}
