import { describe, expect, it } from 'vitest'
import { renderComponent } from '../../src/plugin/renderComponent'

const baseInput = {
  id: 'mermaid-123',
  code: 'flowchart%20TD',
  componentName: 'MermaidDiagram',
  className: 'vp-mermaid',
  clientOnly: true,
  meta: {}
}

describe('renderComponent', () => {
  it('wraps the component in <ClientOnly> when clientOnly is true', () => {
    const html = renderComponent(baseInput)
    expect(html).toContain('<ClientOnly>')
    expect(html).toContain('<MermaidDiagram')
    expect(html).toContain('id="mermaid-123"')
    expect(html).toContain('class="vp-mermaid"')
  })

  it('does not wrap the component when clientOnly is false', () => {
    const html = renderComponent({ ...baseInput, clientOnly: false })
    expect(html).not.toContain('ClientOnly')
    expect(html).toContain('<MermaidDiagram')
  })

  it('emits show-source/interactive bindings based on meta booleans', () => {
    const html = renderComponent({
      ...baseInput,
      meta: { showSource: true, interactive: false }
    })

    expect(html).toContain(':show-source="true"')
    expect(html).toContain(':interactive="false"')
  })

  it('omits the title attribute when no title is provided', () => {
    const html = renderComponent(baseInput)
    expect(html).not.toContain('title=')
  })

  it('escapes HTML-sensitive characters in the title', () => {
    const html = renderComponent({
      ...baseInput,
      meta: { title: '<b>"quoted" & special</b>' }
    })

    expect(html).toContain('title="&lt;b&gt;&quot;quoted&quot; &amp; special&lt;/b&gt;"')
    expect(html).not.toContain('<b>')
  })
})
