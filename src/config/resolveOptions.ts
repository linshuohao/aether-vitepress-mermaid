import {
  DEFAULT_CLASS_NAME,
  DEFAULT_COMPONENT_NAME,
  DEFAULT_DARK_THEME,
  DEFAULT_LANGUAGES,
  DEFAULT_LIGHT_THEME,
  DEFAULT_SECURITY_LEVEL
} from '../shared/constants'
import type {
  MermaidOptions,
  MermaidPluginOptions,
  MermaidRuntimeOptions,
  ResolvedMermaidPluginOptions,
  ResolvedMermaidRuntimeOptions
} from '../shared/types'

export function resolvePluginOptions(
  options: MermaidPluginOptions = {}
): ResolvedMermaidPluginOptions {
  return {
    componentName: options.componentName ?? DEFAULT_COMPONENT_NAME,
    className: options.className ?? DEFAULT_CLASS_NAME,
    languages: options.languages ?? DEFAULT_LANGUAGES,
    clientOnly: options.clientOnly ?? true,
    defaultMeta: {
      title: options.defaultMeta?.title,
      interactive: options.defaultMeta?.interactive ?? false,
      showSource: options.defaultMeta?.showSource ?? false
    }
  }
}

export function resolveRuntimeOptions(
  options: MermaidRuntimeOptions = {}
): ResolvedMermaidRuntimeOptions {
  return {
    securityLevel: options.securityLevel ?? DEFAULT_SECURITY_LEVEL,
    theme: {
      light: options.theme?.light ?? DEFAULT_LIGHT_THEME,
      dark: options.theme?.dark ?? DEFAULT_DARK_THEME
    },
    mermaidOptions: options.mermaidOptions ?? {}
  }
}

export function resolveMermaidOptions(options: MermaidOptions = {}): MermaidOptions {
  return {
    markdown: resolvePluginOptions(options.markdown),
    runtime: resolveRuntimeOptions(options.runtime)
  }
}
