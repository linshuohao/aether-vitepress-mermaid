import { describe, expect, it } from 'vitest'
import { encodeCode } from '../../src/plugin/encodeCode'

describe('encodeCode', () => {
  it('percent-encodes special characters so the result is HTML-attribute safe', () => {
    const code = 'flowchart TD\n  A["<script>alert(1)</script>"] --> B'
    const encoded = encodeCode(code)

    expect(encoded).not.toContain('<')
    expect(encoded).not.toContain('>')
    expect(encoded).not.toContain('"')
    expect(decodeURIComponent(encoded)).toBe(code)
  })

  it('round-trips through decodeURIComponent unchanged', () => {
    const code = 'sequenceDiagram\n  Alice->>Bob: 你好，世界'
    expect(decodeURIComponent(encodeCode(code))).toBe(code)
  })

  it('encodes an empty string to an empty string', () => {
    expect(encodeCode('')).toBe('')
  })
})
