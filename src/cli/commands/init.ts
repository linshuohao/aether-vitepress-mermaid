import { existsSync, copyFileSync } from 'node:fs'
import { detectVitePress } from '../detectVitePress'
import { patchConfigFile, writePatchedFile } from '../patchConfig'
import { patchThemeFile, writePatchedTheme } from '../patchTheme'

export interface InitOptions {
  cwd: string
  dryRun?: boolean
  force?: boolean
}

export interface InitResult {
  messages: string[]
}

export async function init(options: InitOptions): Promise<InitResult> {
  const paths = detectVitePress(options.cwd)
  const configPath = paths.configPath ?? `${paths.vitepressDir}/config.ts`
  const themePath = paths.themePath

  const configPatch = patchConfigFile(configPath)
  const themePatch = patchThemeFile(themePath)

  const messages = [
    `VitePress directory: ${paths.vitepressDir}`,
    `Config: ${configPatch.reason}`,
    `Theme: ${themePatch.reason}`
  ]

  if (options.dryRun) {
    messages.push('Dry run enabled. No files were written.')
    return { messages }
  }

  for (const result of [configPatch, themePatch]) {
    if (result.changed && existsSync(result.path) && !options.force) {
      copyFileSync(result.path, `${result.path}.bak`)
      messages.push(`Backup created: ${result.path}.bak`)
    }
  }

  writePatchedFile(configPatch)
  writePatchedTheme(themePatch)

  messages.push('Mermaid support initialized.')

  return { messages }
}
