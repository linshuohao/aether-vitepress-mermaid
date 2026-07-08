import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import MagicString from 'magic-string'
import { getConfigTemplate } from './templates'

export interface PatchFileResult {
  changed: boolean
  path: string
  code: string
  reason?: string
}

export function patchConfigFile(configPath: string): PatchFileResult {
  if (!existsSync(configPath)) {
    return {
      changed: true,
      path: configPath,
      code: getConfigTemplate(),
      reason: 'created config file'
    }
  }

  const source = readFileSync(configPath, 'utf8')

  if (source.includes('withMermaid(')) {
    return {
      changed: false,
      path: configPath,
      code: source,
      reason: 'config already uses withMermaid'
    }
  }

  const s = new MagicString(source)

  if (!source.includes("@aether-labs/vitepress-mermaid")) {
    const lastImport = findLastImportEnd(source)
    const importLine = "import { withMermaid } from '@aether-labs/vitepress-mermaid'\n"

    if (lastImport >= 0) {
      s.appendLeft(lastImport, importLine)
    } else {
      s.prepend(importLine)
    }
  }

  const defineConfigExport = /export\s+default\s+defineConfig\s*\(/m.exec(source)

  if (defineConfigExport) {
    const openParenIndex = defineConfigExport.index + defineConfigExport[0].length - 1
    const closeParenIndex = findMatchingParen(source, openParenIndex)

    if (closeParenIndex === -1) {
      return {
        changed: false,
        path: configPath,
        code: source,
        reason: 'unable to patch defineConfig call'
      }
    }

    s.appendLeft(defineConfigExport.index + 'export default '.length, 'withMermaid(')
    s.appendRight(closeParenIndex + 1, ')')

    return {
      changed: true,
      path: configPath,
      code: s.toString(),
      reason: 'wrapped defineConfig with withMermaid'
    }
  }

  return {
    changed: false,
    path: configPath,
    code: source,
    reason: 'no export default defineConfig(...) found; manual patch required'
  }
}

export function writePatchedFile(result: PatchFileResult): void {
  if (!result.changed) return
  mkdirSync(dirname(result.path), { recursive: true })
  writeFileSync(result.path, result.code)
}

function findLastImportEnd(source: string): number {
  const imports = [...source.matchAll(/^import\s.+$/gm)]
  if (!imports.length) return -1
  const last = imports[imports.length - 1]
  return last.index! + last[0].length + 1
}

function findMatchingParen(source: string, openIndex: number): number {
  let depth = 0
  let quote: '"' | "'" | '`' | null = null
  let escaped = false

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i]

    if (quote) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === quote) {
        quote = null
      }
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      continue
    }

    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (depth === 0) return i
  }

  return -1
}
