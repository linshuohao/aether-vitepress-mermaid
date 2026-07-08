import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import MagicString from 'magic-string'
import { getThemeTemplate } from './templates'
import type { PatchFileResult } from './patchConfig'

export function patchThemeFile(themePath: string): PatchFileResult {
  if (!existsSync(themePath)) {
    return {
      changed: true,
      path: themePath,
      code: getThemeTemplate(),
      reason: 'created theme file'
    }
  }

  const source = readFileSync(themePath, 'utf8')

  if (source.includes('withMermaidTheme(')) {
    return {
      changed: false,
      path: themePath,
      code: source,
      reason: 'theme already uses withMermaidTheme'
    }
  }

  const exportDefault = /export\s+default\s+/m.exec(source)

  if (!exportDefault) {
    return {
      changed: false,
      path: themePath,
      code: source,
      reason: 'no export default found; manual patch required'
    }
  }

  const s = new MagicString(source)

  if (!source.includes("@aether-labs/vitepress-mermaid/runtime")) {
    const lastImport = findLastImportEnd(source)
    const importLine = "import { withMermaidTheme } from '@aether-labs/vitepress-mermaid/runtime'\n"

    if (lastImport >= 0) {
      s.appendLeft(lastImport, importLine)
    } else {
      s.prepend(importLine)
    }
  }

  const expressionStart = exportDefault.index + exportDefault[0].length
  const expressionEnd = findExportExpressionEnd(source, expressionStart)

  if (expressionEnd === -1) {
    return {
      changed: false,
      path: themePath,
      code: source,
      reason: 'unable to locate export default expression end'
    }
  }

  s.appendLeft(expressionStart, 'withMermaidTheme(')
  s.appendRight(expressionEnd, ')')

  return {
    changed: true,
    path: themePath,
    code: s.toString(),
    reason: 'wrapped theme export with withMermaidTheme'
  }
}

export function writePatchedTheme(result: PatchFileResult): void {
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

function findExportExpressionEnd(source: string, start: number): number {
  const trimmed = source.slice(start)

  if (trimmed.trimStart().startsWith('{')) {
    const offset = trimmed.indexOf('{')
    return findMatching(source, start + offset, '{', '}') + 1
  }

  if (trimmed.trimStart().startsWith('defineConfig(')) {
    const offset = trimmed.indexOf('(')
    return findMatching(source, start + offset, '(', ')') + 1
  }

  const newline = source.indexOf('\n', start)
  return newline === -1 ? source.length : newline
}

function findMatching(source: string, openIndex: number, open: string, close: string): number {
  let depth = 0
  let quote: '"' | "'" | '`' | null = null
  let escaped = false

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i]

    if (quote) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === quote) quote = null
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      continue
    }

    if (ch === open) depth += 1
    if (ch === close) depth -= 1
    if (depth === 0) return i
  }

  return -1
}
