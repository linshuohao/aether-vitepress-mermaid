# @aether-labs/vitepress-mermaid

Zero-config Mermaid support for VitePress.

## Features

- Standard ````mermaid` fenced code blocks
- Client-first and SSR-safe rendering
- Lazy import of `mermaid`
- Dark mode re-rendering through VitePress `isDark`
- Error fallback with source display
- Does not override normal Shiki-powered code blocks
- CLI init for the closest possible “zero-config” setup

## Quick Start

```bash
pnpm add -D @aether-labs/vitepress-mermaid mermaid
pnpm exec aether-vitepress-mermaid init
```

Then write Mermaid in Markdown:

````md
```mermaid
flowchart TD
  A[Markdown] --> B[VitePress]
  B --> C[Mermaid SVG]
```
````

## Manual Setup

`.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { withMermaid } from '@aether-labs/vitepress-mermaid'

export default withMermaid(
  defineConfig({
    title: 'My Docs'
  })
)
```

`.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import { withMermaidTheme } from '@aether-labs/vitepress-mermaid/runtime'

export default withMermaidTheme(DefaultTheme)
```

## Options

```ts
withMermaid(defineConfig({}), {
  markdown: {
    languages: ['mermaid'],
    defaultMeta: {
      showSource: false,
      interactive: false
    }
  }
})
```

Runtime options are passed through the theme layer:

```ts
export default withMermaidTheme(DefaultTheme, {
  securityLevel: 'strict',
  theme: {
    light: 'default',
    dark: 'dark'
  }
})
```

## Fence Meta

````md
```mermaid title="架构图" showSource
flowchart TD
  A --> B
```
````

Supported in v0.1 skeleton:

- `title="..."`
- `showSource`
- `interactive`

## FAQ

### Why not work after install only?

VitePress does not auto-discover npm plugins. Mermaid support must be wired into both the Markdown compilation chain and the theme/runtime app enhancement chain.

### Why client-first?

Mermaid rendering depends on browser DOM behavior. The package outputs `<ClientOnly>` by default and renders SVG after mount.

### Why is Mermaid a peer dependency?

The host project already controls its VitePress/Vue stack, and Mermaid versions change quickly. Keeping Mermaid as a peer dependency avoids duplicate installs and version conflicts.
