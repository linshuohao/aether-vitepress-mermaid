import type { App } from 'vue'

export interface MermaidFenceMeta {
  title?: string
  interactive?: boolean
  showSource?: boolean
}

export interface MermaidPluginOptions {
  componentName?: string
  className?: string
  languages?: string[]
  clientOnly?: boolean
  defaultMeta?: MermaidFenceMeta
}

export interface ResolvedMermaidPluginOptions {
  componentName: string
  className: string
  languages: string[]
  clientOnly: boolean
  defaultMeta: Required<Pick<MermaidFenceMeta, 'interactive' | 'showSource'>> &
    Pick<MermaidFenceMeta, 'title'>
}

export interface MermaidRuntimeOptions {
  securityLevel?: 'strict' | 'loose' | 'antiscript' | 'sandbox'
  theme?: {
    light?: string
    dark?: string
  }
  mermaidOptions?: Record<string, unknown>
}

export interface ResolvedMermaidRuntimeOptions {
  securityLevel: 'strict' | 'loose' | 'antiscript' | 'sandbox'
  theme: {
    light: string
    dark: string
  }
  mermaidOptions: Record<string, unknown>
}

export interface MermaidRenderInput {
  id: string
  code: string
  isDark: boolean
  container: HTMLElement
  interactive?: boolean
}

export interface MermaidRuntime {
  render(input: MermaidRenderInput): Promise<void>
}

export interface MermaidOptions {
  markdown?: MermaidPluginOptions
  runtime?: MermaidRuntimeOptions
}

export interface MermaidInstallOptions extends MermaidRuntimeOptions {}

export interface MermaidThemeContext {
  app: App
}
