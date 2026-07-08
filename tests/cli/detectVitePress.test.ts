import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { detectVitePress } from '../../src/cli/detectVitePress'

function makeTmpDir(): string {
  return mkdtempSync(join(tmpdir(), 'vp-mermaid-detect-'))
}

describe('detectVitePress', () => {
  it('prefers docs/.vitepress when both docs/.vitepress and .vitepress exist', () => {
    const cwd = makeTmpDir()
    mkdirSync(join(cwd, 'docs', '.vitepress'), { recursive: true })
    mkdirSync(join(cwd, '.vitepress'), { recursive: true })

    const paths = detectVitePress(cwd)
    expect(paths.vitepressDir).toBe(join(cwd, 'docs', '.vitepress'))
  })

  it('falls back to top-level .vitepress when docs/.vitepress does not exist', () => {
    const cwd = makeTmpDir()
    mkdirSync(join(cwd, '.vitepress'), { recursive: true })

    const paths = detectVitePress(cwd)
    expect(paths.vitepressDir).toBe(join(cwd, '.vitepress'))
  })

  it('defaults to docs/.vitepress when neither directory exists yet', () => {
    const cwd = makeTmpDir()
    const paths = detectVitePress(cwd)
    expect(paths.vitepressDir).toBe(join(cwd, 'docs', '.vitepress'))
    expect(paths.configPath).toBeNull()
  })

  it('finds an existing config.ts file', () => {
    const cwd = makeTmpDir()
    const vitepressDir = join(cwd, 'docs', '.vitepress')
    mkdirSync(vitepressDir, { recursive: true })
    writeFileSync(join(vitepressDir, 'config.ts'), '')

    const paths = detectVitePress(cwd)
    expect(paths.configPath).toBe(join(vitepressDir, 'config.ts'))
  })

  it('finds config.mts when config.ts is absent', () => {
    const cwd = makeTmpDir()
    const vitepressDir = join(cwd, '.vitepress')
    mkdirSync(vitepressDir, { recursive: true })
    writeFileSync(join(vitepressDir, 'config.mts'), '')

    const paths = detectVitePress(cwd)
    expect(paths.configPath).toBe(join(vitepressDir, 'config.mts'))
  })

  it('always points themePath at theme/index.ts regardless of existence', () => {
    const cwd = makeTmpDir()
    const paths = detectVitePress(cwd)
    expect(paths.themePath).toBe(join(cwd, 'docs', '.vitepress', 'theme', 'index.ts'))
  })
})
