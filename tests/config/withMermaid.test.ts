import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { withMermaid } from '../../src/config/withMermaid'

describe('withMermaid', () => {
  it('registers the mermaid markdown plugin so mermaid fences render as a component', () => {
    const config = withMermaid({})
    const md = new MarkdownIt()

    config.markdown!.config!(md)

    const html = md.render('```mermaid\nflowchart TD\n  A --> B\n```\n')
    expect(html).toContain('<MermaidDiagram')
  })

  it('still invokes the user-provided markdown.config callback', () => {
    const userConfig = vi.fn()
    const config = withMermaid({ markdown: { config: userConfig } })
    const md = new MarkdownIt()

    config.markdown!.config!(md)

    expect(userConfig).toHaveBeenCalledWith(md)
  })

  it('preserves other top-level VitePress config fields', () => {
    const config = withMermaid({ title: 'My Docs', base: '/docs/' })
    expect(config.title).toBe('My Docs')
    expect(config.base).toBe('/docs/')
  })

  it('forwards markdown plugin options such as a custom component name', () => {
    const config = withMermaid({}, { markdown: { componentName: 'CustomDiagram' } })
    const md = new MarkdownIt()

    config.markdown!.config!(md)

    const html = md.render('```mermaid\nflowchart TD\n  A --> B\n```\n')
    expect(html).toContain('<CustomDiagram')
  })
})
