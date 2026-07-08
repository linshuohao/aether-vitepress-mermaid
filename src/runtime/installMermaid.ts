import type { App } from 'vue'
import { createMermaidRuntime } from './createMermaidRuntime'
import { mermaidRuntimeKey } from './injectionKeys'
import type { MermaidInstallOptions } from '../shared/types'

export function installMermaid(
  app: App,
  options: MermaidInstallOptions = {}
): void {
  app.provide(mermaidRuntimeKey, createMermaidRuntime(options))
}
