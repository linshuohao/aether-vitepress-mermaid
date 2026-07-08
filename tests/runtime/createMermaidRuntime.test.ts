import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMermaidRuntime } from '../../src/runtime/createMermaidRuntime'
import { resetMermaidLoaderForTest } from '../../src/runtime/loadMermaid'

const initialize = vi.fn()
const render = vi.fn(async () => ({
  svg: '<svg></svg>',
  bindFunctions: vi.fn()
}))

vi.mock('mermaid', () => ({
  default: {
    initialize,
    render
  }
}))

describe('createMermaidRuntime', () => {
  beforeEach(() => {
    initialize.mockClear()
    render.mockClear()
    resetMermaidLoaderForTest()
  })

  it('initializes mermaid and inserts svg', async () => {
    const runtime = createMermaidRuntime()
    const container = document.createElement('div')

    await runtime.render({
      id: 'm1',
      code: 'flowchart TD\nA --> B',
      isDark: false,
      container
    })

    expect(initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'default'
      })
    )
    expect(render).toHaveBeenCalledWith('m1', 'flowchart TD\nA --> B')
    expect(container.innerHTML).toBe('<svg></svg>')
  })
})
