import { describe, expect, it } from 'vitest'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { patchConfigFile } from '../../src/cli/patchConfig'

describe('patchConfigFile', () => {
  it('wraps defineConfig with withMermaid', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vp-mermaid-'))
    const file = join(dir, 'config.ts')

    writeFileSync(
      file,
      `import { defineConfig } from 'vitepress'\n\nexport default defineConfig({\n  title: 'Docs'\n})\n`
    )

    const result = patchConfigFile(file)

    expect(result.changed).toBe(true)
    expect(result.code).toContain("import { withMermaid } from '@aether-labs/vitepress-mermaid'")
    expect(result.code).toContain('export default withMermaid(defineConfig({')
  })
})
