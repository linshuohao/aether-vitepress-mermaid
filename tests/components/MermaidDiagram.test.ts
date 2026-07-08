import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MermaidDiagram from '../../src/components/MermaidDiagram.vue'
import { mermaidRuntimeKey } from '../../src/runtime/injectionKeys'
import type { MermaidRenderInput } from '../../src/shared/types'

const isDark = ref(false)

vi.mock('vitepress', () => ({
  useData: () => ({ isDark })
}))

afterEach(() => {
  isDark.value = false
})

type RenderMock = ReturnType<typeof vi.fn<(input: MermaidRenderInput) => Promise<void>>>

function mountDiagram(
  props: Record<string, unknown>,
  render: RenderMock = vi.fn(async () => {})
) {
  const wrapper = mount(MermaidDiagram, {
    props: { id: 'mermaid-1', code: encodeURIComponent('flowchart TD\nA --> B'), ...props },
    global: {
      provide: {
        [mermaidRuntimeKey as symbol]: { render }
      }
    }
  })

  return { wrapper, render }
}

describe('MermaidDiagram', () => {
  it('decodes the code prop and renders through the injected runtime on mount', async () => {
    const { render } = mountDiagram({})
    await flushPromises()

    expect(render).toHaveBeenCalledTimes(1)
    const [input] = render.mock.calls[0]!
    expect(input.code).toBe('flowchart TD\nA --> B')
    expect(input.id).toBe('mermaid-1-light')
    expect(input.isDark).toBe(false)
  })

  it('appends "-dark" to the render id when isDark is true', async () => {
    isDark.value = true
    const { render } = mountDiagram({})
    await flushPromises()

    const [input] = render.mock.calls[0]!
    expect(input.id).toBe('mermaid-1-dark')
  })

  it('shows an error message and the source fallback when rendering fails', async () => {
    const { wrapper } = mountDiagram(
      {},
      vi.fn(async () => {
        throw new Error('invalid diagram syntax')
      })
    )
    await flushPromises()

    expect(wrapper.text()).toContain('invalid diagram syntax')
    expect(wrapper.find('details').exists()).toBe(true)
  })

  it('renders the title as a figcaption when provided', async () => {
    const { wrapper } = mountDiagram({ title: 'My Diagram' })
    await flushPromises()

    expect(wrapper.find('figcaption').text()).toBe('My Diagram')
  })

  it('shows the source block when showSource is true even without an error', async () => {
    const { wrapper } = mountDiagram({ showSource: true })
    await flushPromises()

    expect(wrapper.find('details').exists()).toBe(true)
  })

  it('re-renders when the theme (isDark) changes', async () => {
    const { render } = mountDiagram({})
    await flushPromises()
    expect(render).toHaveBeenCalledTimes(1)

    isDark.value = true
    await flushPromises()

    expect(render).toHaveBeenCalledTimes(2)
    const [, secondCall] = render.mock.calls
    expect(secondCall![0].isDark).toBe(true)
  })
})
