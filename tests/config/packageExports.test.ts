// @vitest-environment node
//
// This suite imports tsup.config.ts, which pulls in the `tsup` package and its
// esbuild dependency. esbuild's environment checks are incompatible with jsdom's
// patched globals (e.g. TextEncoder), so this file must run under the plain
// Node environment rather than the project-wide jsdom environment.
import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'
import tsupConfig from '../../tsup.config'

/**
 * Regression coverage for a real bug: package.json's "exports" map pointed the
 * "." entry's `import` condition at `dist/auto/index.js` while its `types`
 * condition pointed at `dist/index.d.ts`. TypeScript consumers saw `withMermaid`
 * in their editor, but the actual runtime module (built from `src/auto/index.ts`)
 * never exported it, so `import { withMermaid } from '@aether-labs/vitepress-mermaid'`
 * resolved to `undefined` at runtime.
 *
 * This test statically verifies that every dual `types`/`import` export condition
 * in package.json is built (via tsup's entry map) from the same source module that
 * produces the corresponding `.d.ts` file, so `types` and `import` can never diverge
 * again without failing CI.
 */

type ExportCondition = { types?: string; import?: string } | string

function srcModuleFromTypesPath(typesPath: string): string {
  const relative = typesPath.replace(/^\.\/dist\//, '').replace(/\.d\.ts$/, '')
  return `src/${relative}.ts`
}

function entryKeyFromImportPath(importPath: string): string {
  return importPath.replace(/^\.\/dist\//, '').replace(/\.js$/, '')
}

describe('package.json exports <-> tsup entry consistency', () => {
  const entries = (tsupConfig as { entry: Record<string, string> }).entry
  const exportsMap = pkg.exports as Record<string, ExportCondition>

  const dualConditionExports = Object.entries(exportsMap).filter(
    (entry): entry is [string, { types: string; import: string }] => {
      const condition = entry[1]
      return typeof condition === 'object' && !!condition.types && !!condition.import
    }
  )

  it('has at least one dual types/import export to validate', () => {
    expect(dualConditionExports.length).toBeGreaterThan(0)
  })

  it.each(dualConditionExports)(
    'exports["%s"] resolves types and import to the same source module',
    (_exportPath, condition) => {
      const expectedSrc = srcModuleFromTypesPath(condition.types)
      const entryKey = entryKeyFromImportPath(condition.import)
      const actualSrc = entries[entryKey]

      expect(
        actualSrc,
        `tsup.config.ts entry "${entryKey}" (used by import path "${condition.import}") ` +
          `should build from "${expectedSrc}" to match the types at "${condition.types}", ` +
          `but builds from "${actualSrc}" instead.`
      ).toBe(expectedSrc)
    }
  )

  it('main "." export exposes withMermaid to match its declared types', () => {
    const rootExport = exportsMap['.']
    expect(typeof rootExport).toBe('object')
    expect((rootExport as { types: string }).types).toBe('./dist/index.d.ts')
    expect((rootExport as { import: string }).import).toBe('./dist/index.js')
  })
})
