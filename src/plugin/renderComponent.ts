import type { MermaidFenceMeta } from '../shared/types'

export interface RenderComponentInput {
  id: string
  code: string
  componentName: string
  className: string
  clientOnly: boolean
  meta: MermaidFenceMeta
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function renderComponent(input: RenderComponentInput): string {
  const titleAttr = input.meta.title
    ? ` title="${escapeHtml(input.meta.title)}"`
    : ''

  const component = [
    `<${input.componentName}`,
    ` id="${escapeHtml(input.id)}"`,
    ` class="${escapeHtml(input.className)}"`,
    ` code="${escapeHtml(input.code)}"`,
    titleAttr,
    ` :show-source="${Boolean(input.meta.showSource)}"`,
    ` :interactive="${Boolean(input.meta.interactive)}"`,
    ' />'
  ].join('')

  if (!input.clientOnly) return component

  return `<ClientOnly>\n${component}\n</ClientOnly>`
}
