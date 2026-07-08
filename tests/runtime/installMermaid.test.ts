import { createApp } from 'vue'
import { describe, expect, it } from 'vitest'
import { installMermaid } from '../../src/runtime/installMermaid'
import { mermaidRuntimeKey } from '../../src/runtime/injectionKeys'

describe('installMermaid', () => {
  it('provides a mermaid runtime with a render function on the app', () => {
    const app = createApp({})
    installMermaid(app)

    const provided = app._context.provides[mermaidRuntimeKey]
    expect(provided).toBeDefined()
    expect(typeof provided.render).toBe('function')
  })
})
