import type { MermaidFenceMeta } from '../shared/types'

export interface ParsedFenceInfo {
  lang: string
  meta: MermaidFenceMeta
}

const META_RE = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g

export function parseFenceInfo(info = ''): ParsedFenceInfo {
  const trimmed = info.trim()
  const match = trimmed.match(/^(\S+)(.*)$/)

  if (!match) {
    return { lang: '', meta: {} }
  }

  const lang = match[1].toLowerCase()
  const rest = match[2] ?? ''
  const meta: MermaidFenceMeta = {}

  for (const item of rest.matchAll(META_RE)) {
    const key = item[1]
    const value = item[2] ?? item[3] ?? item[4]

    if (key === 'title' && typeof value === 'string') {
      meta.title = value
    }

    if (key === 'showSource') {
      meta.showSource = value == null ? true : value !== 'false'
    }

    if (key === 'interactive') {
      meta.interactive = value == null ? true : value !== 'false'
    }
  }

  return { lang, meta }
}
