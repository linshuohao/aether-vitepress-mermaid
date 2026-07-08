import { describe, expect, it } from 'vitest'
import {
  resolveMermaidOptions,
  resolvePluginOptions,
  resolveRuntimeOptions
} from '../../src/config/resolveOptions'

describe('resolvePluginOptions', () => {
  it('applies documented defaults when called with no options', () => {
    expect(resolvePluginOptions()).toEqual({
      componentName: 'MermaidDiagram',
      className: 'vp-mermaid',
      languages: ['mermaid'],
      clientOnly: true,
      defaultMeta: {
        title: undefined,
        interactive: false,
        showSource: false
      }
    })
  })

  it('lets explicit options override defaults', () => {
    const resolved = resolvePluginOptions({
      componentName: 'CustomDiagram',
      className: 'my-diagram',
      languages: ['mmd'],
      clientOnly: false,
      defaultMeta: { title: 'Default title', interactive: true, showSource: true }
    })

    expect(resolved).toEqual({
      componentName: 'CustomDiagram',
      className: 'my-diagram',
      languages: ['mmd'],
      clientOnly: false,
      defaultMeta: { title: 'Default title', interactive: true, showSource: true }
    })
  })

  it('merges partial defaultMeta with defaults', () => {
    const resolved = resolvePluginOptions({ defaultMeta: { showSource: true } })
    expect(resolved.defaultMeta).toEqual({
      title: undefined,
      interactive: false,
      showSource: true
    })
  })
})

describe('resolveRuntimeOptions', () => {
  it('applies documented defaults when called with no options', () => {
    expect(resolveRuntimeOptions()).toEqual({
      securityLevel: 'strict',
      theme: { light: 'default', dark: 'dark' },
      mermaidOptions: {}
    })
  })

  it('lets explicit options override defaults', () => {
    const resolved = resolveRuntimeOptions({
      securityLevel: 'loose',
      theme: { light: 'neutral', dark: 'forest' },
      mermaidOptions: { fontFamily: 'monospace' }
    })

    expect(resolved).toEqual({
      securityLevel: 'loose',
      theme: { light: 'neutral', dark: 'forest' },
      mermaidOptions: { fontFamily: 'monospace' }
    })
  })

  it('merges a partial theme override with defaults', () => {
    const resolved = resolveRuntimeOptions({ theme: { dark: 'forest' } })
    expect(resolved.theme).toEqual({ light: 'default', dark: 'forest' })
  })
})

describe('resolveMermaidOptions', () => {
  it('resolves both markdown and runtime sub-options with defaults', () => {
    const resolved = resolveMermaidOptions()
    expect(resolved.markdown).toEqual(resolvePluginOptions())
    expect(resolved.runtime).toEqual(resolveRuntimeOptions())
  })

  it('forwards nested overrides to the respective resolvers', () => {
    const resolved = resolveMermaidOptions({
      markdown: { componentName: 'Custom' },
      runtime: { securityLevel: 'sandbox' }
    })

    expect(resolved.markdown?.componentName).toBe('Custom')
    expect(resolved.runtime?.securityLevel).toBe('sandbox')
  })
})
