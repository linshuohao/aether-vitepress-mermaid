import { describe, expect, it } from 'vitest'
import { parseFenceInfo } from '../../src/plugin/parseFenceInfo'

describe('parseFenceInfo', () => {
  it('returns empty lang/meta for empty info', () => {
    expect(parseFenceInfo('')).toEqual({ lang: '', meta: {} })
    expect(parseFenceInfo()).toEqual({ lang: '', meta: {} })
  })

  it('parses a bare language with no meta', () => {
    expect(parseFenceInfo('mermaid')).toEqual({ lang: 'mermaid', meta: {} })
  })

  it('lowercases the language', () => {
    expect(parseFenceInfo('Mermaid')).toEqual({ lang: 'mermaid', meta: {} })
  })

  it('treats boolean flags without a value as true', () => {
    expect(parseFenceInfo('mermaid showSource interactive')).toEqual({
      lang: 'mermaid',
      meta: { showSource: true, interactive: true }
    })
  })

  it('respects an explicit "false" value for boolean flags', () => {
    expect(parseFenceInfo('mermaid showSource=false interactive=false')).toEqual({
      lang: 'mermaid',
      meta: { showSource: false, interactive: false }
    })
  })

  it('parses a double-quoted title containing spaces', () => {
    expect(parseFenceInfo('mermaid title="My Diagram"')).toEqual({
      lang: 'mermaid',
      meta: { title: 'My Diagram' }
    })
  })

  it('parses a single-quoted title', () => {
    expect(parseFenceInfo("mermaid title='My Diagram'")).toEqual({
      lang: 'mermaid',
      meta: { title: 'My Diagram' }
    })
  })

  it('parses an unquoted title with no spaces', () => {
    expect(parseFenceInfo('mermaid title=Diagram')).toEqual({
      lang: 'mermaid',
      meta: { title: 'Diagram' }
    })
  })

  it('ignores unknown meta keys', () => {
    expect(parseFenceInfo('mermaid foo="bar" showSource')).toEqual({
      lang: 'mermaid',
      meta: { showSource: true }
    })
  })

  it('trims surrounding whitespace before parsing', () => {
    expect(parseFenceInfo('  mermaid title="Trimmed"  ')).toEqual({
      lang: 'mermaid',
      meta: { title: 'Trimmed' }
    })
  })
})
