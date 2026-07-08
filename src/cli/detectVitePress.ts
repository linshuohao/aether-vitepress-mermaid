import { existsSync } from 'node:fs'
import { join } from 'node:path'

export interface VitePressPaths {
  root: string
  vitepressDir: string
  configPath: string | null
  themePath: string
}

const CONFIG_NAMES = ['config.ts', 'config.mts', 'config.js', 'config.mjs']

export function detectVitePress(cwd: string): VitePressPaths {
  const candidates = [join(cwd, 'docs', '.vitepress'), join(cwd, '.vitepress')]
  const vitepressDir = candidates.find((dir) => existsSync(dir)) ?? candidates[0]

  const configPath = CONFIG_NAMES
    .map((name) => join(vitepressDir, name))
    .find((file) => existsSync(file)) ?? null

  return {
    root: cwd,
    vitepressDir,
    configPath,
    themePath: join(vitepressDir, 'theme', 'index.ts')
  }
}
