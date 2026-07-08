export interface CreateDiagramIdInput {
  code: string
  idx: number
  env?: unknown
}

function stableHash(input: string): string {
  let hash = 5381

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }

  return (hash >>> 0).toString(36)
}

function getEnvPath(env: unknown): string {
  if (!env || typeof env !== 'object') return ''
  const maybePath = (env as { path?: unknown }).path
  return typeof maybePath === 'string' ? maybePath : ''
}

export function createDiagramId(input: CreateDiagramIdInput): string {
  const seed = [getEnvPath(input.env), input.idx, input.code].join('|')
  return `mermaid-${stableHash(seed)}`
}
