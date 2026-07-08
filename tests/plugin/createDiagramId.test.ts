import { describe, expect, it } from 'vitest'
import { createDiagramId } from '../../src/plugin/createDiagramId'

describe('createDiagramId', () => {
  it('produces a stable id for the same input', () => {
    const input = { code: 'flowchart TD\nA --> B', idx: 0, env: { path: '/guide.md' } }
    expect(createDiagramId(input)).toBe(createDiagramId({ ...input }))
  })

  it('is prefixed with "mermaid-"', () => {
    expect(createDiagramId({ code: 'A --> B', idx: 0 })).toMatch(/^mermaid-/)
  })

  it('produces different ids for different code', () => {
    const a = createDiagramId({ code: 'A --> B', idx: 0 })
    const b = createDiagramId({ code: 'A --> C', idx: 0 })
    expect(a).not.toBe(b)
  })

  it('produces different ids for different indices on the same page', () => {
    const a = createDiagramId({ code: 'A --> B', idx: 0, env: { path: '/guide.md' } })
    const b = createDiagramId({ code: 'A --> B', idx: 1, env: { path: '/guide.md' } })
    expect(a).not.toBe(b)
  })

  it('produces different ids for the same code/index on different pages', () => {
    const a = createDiagramId({ code: 'A --> B', idx: 0, env: { path: '/a.md' } })
    const b = createDiagramId({ code: 'A --> B', idx: 0, env: { path: '/b.md' } })
    expect(a).not.toBe(b)
  })

  it('does not throw when env is missing or malformed', () => {
    expect(() => createDiagramId({ code: 'A --> B', idx: 0 })).not.toThrow()
    expect(() => createDiagramId({ code: 'A --> B', idx: 0, env: null })).not.toThrow()
    expect(() => createDiagramId({ code: 'A --> B', idx: 0, env: 'not-an-object' })).not.toThrow()
  })
})
