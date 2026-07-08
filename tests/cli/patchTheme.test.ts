import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { patchThemeFile } from '../../src/cli/patchTheme'

function makeTmpFile(contents?: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'vp-mermaid-theme-'))
  const file = join(dir, 'index.ts')
  if (contents !== undefined) writeFileSync(file, contents)
  return file
}

describe('patchThemeFile', () => {
  it('creates a new theme file from the template when none exists', () => {
    const file = makeTmpFile()
    const result = patchThemeFile(file)

    expect(result.changed).toBe(true)
    expect(result.reason).toBe('created theme file')
    expect(result.code).toContain('withMermaidTheme')
  })

  it('is a no-op when withMermaidTheme is already used', () => {
    const file = makeTmpFile(
      `import DefaultTheme from 'vitepress/theme'\nimport { withMermaidTheme } from '@aether-labs/vitepress-mermaid/runtime'\n\nexport default withMermaidTheme(DefaultTheme)\n`
    )
    const result = patchThemeFile(file)

    expect(result.changed).toBe(false)
    expect(result.reason).toBe('theme already uses withMermaidTheme')
  })

  it('wraps a plain "export default DefaultTheme" with withMermaidTheme', () => {
    const file = makeTmpFile(`import DefaultTheme from 'vitepress/theme'\n\nexport default DefaultTheme\n`)
    const result = patchThemeFile(file)

    expect(result.changed).toBe(true)
    expect(result.code).toContain(
      "import { withMermaidTheme } from '@aether-labs/vitepress-mermaid/runtime'"
    )
    expect(result.code).toContain('export default withMermaidTheme(DefaultTheme)')
  })

  it('wraps an object literal theme export', () => {
    const file = makeTmpFile(
      `import DefaultTheme from 'vitepress/theme'\n\nexport default {\n  extends: DefaultTheme\n}\n`
    )
    const result = patchThemeFile(file)

    expect(result.changed).toBe(true)
    expect(result.code).toContain('export default withMermaidTheme({')
    expect(result.code.trim().endsWith('})')).toBe(true)
  })

  it('reports a manual-patch reason when there is no export default', () => {
    const file = makeTmpFile(`export const theme = {}\n`)
    const result = patchThemeFile(file)

    expect(result.changed).toBe(false)
    expect(result.reason).toBe('no export default found; manual patch required')
  })
})
