import type { InjectionKey } from 'vue'
import type { MermaidRuntime } from '../shared/types'

export const mermaidRuntimeKey: InjectionKey<MermaidRuntime> = Symbol('mermaidRuntime')
