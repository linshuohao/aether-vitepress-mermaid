import { defineConfig } from 'tsup'
import vue from 'unplugin-vue/esbuild'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'auto/index': 'src/auto/index.ts',
    'plugin/index': 'src/plugin/index.ts',
    'runtime/index': 'src/runtime/index.ts',
    'cli/index': 'src/cli/index.ts'
  },
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  esbuildPlugins: [vue()],
  external: ['vue', 'vitepress', 'mermaid', 'markdown-it']
})
