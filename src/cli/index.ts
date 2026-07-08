#!/usr/bin/env node
import { init } from './commands/init'

async function main() {
  const [, , command, ...args] = process.argv

  if (!command || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  if (command !== 'init') {
    console.error(`Unknown command: ${command}`)
    printHelp()
    process.exitCode = 1
    return
  }

  const cwd = process.cwd()
  const dryRun = args.includes('--dry-run')
  const force = args.includes('--force')

  const result = await init({ cwd, dryRun, force })

  for (const message of result.messages) {
    console.log(message)
  }
}

function printHelp() {
  console.log(`aether-vitepress-mermaid

Usage:
  aether-vitepress-mermaid init [--dry-run] [--force]
`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
