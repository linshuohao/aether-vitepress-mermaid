type MermaidModule = {
  default?: unknown
}

let mermaidPromise: Promise<any> | null = null

export function loadMermaid(): Promise<any> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod: MermaidModule) => mod.default ?? mod)
  }

  return mermaidPromise
}

export function resetMermaidLoaderForTest(): void {
  mermaidPromise = null
}
