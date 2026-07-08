import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { mermaidPlugin, parseFenceInfo } from '../../src/plugin'

describe('mermaidPlugin', () => {
  it('renders mermaid fence as MermaidDiagram', () => {
    const md = new MarkdownIt()
    md.use(mermaidPlugin())

    const html = md.render(`\n\`\`\`mermaid\nflowchart TD\n  A --> B\n\`\`\`\n`)

    expect(html).toContain('<ClientOnly>')
    expect(html).toContain('<MermaidDiagram')
    expect(html).toContain('code="flowchart%20TD')
  })

  it('keeps non-mermaid code fences on default renderer', () => {
    const md = new MarkdownIt()
    md.use(mermaidPlugin())

    const html = md.render(`\n\`\`\`ts\nconst a = 1\n\`\`\`\n`)

    expect(html).toContain('<pre><code')
    expect(html).not.toContain('<MermaidDiagram')
  })

  it('parses supported meta', () => {
    expect(parseFenceInfo('mermaid title="架构图" showSource interactive')).toEqual({
      lang: 'mermaid',
      meta: {
        title: '架构图',
        showSource: true,
        interactive: true
      }
    })
  })
})
