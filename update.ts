import { $ } from 'execa'
import { workspaces } from './package.json' with { type: 'json' }
import { resolve } from 'node:path'

workspaces.forEach(async (workspace) => {
  await $({
    cwd: resolve(workspace),
    stdio: 'inherit',
  })`bun update`
})





