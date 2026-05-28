import { ipcMain } from 'electron'
import type { ChildProcess } from 'node:child_process'

let minecraftProcess: ChildProcess | null = null

export function registerMinecraftIpc() {
  ipcMain.handle('minecraft:launch', (_e, _profileId: string) => {
    if (minecraftProcess) return { ok: false, error: 'Already running' }
    // Full launch logic requires profile resolution + Minecraft auth token injection
    // Placeholder until Phase 4 mod integration
    return { ok: false, error: 'Launch requires Phase 4 mod integration' }
  })

  ipcMain.handle('minecraft:getVersions', () => [])

  ipcMain.handle('minecraft:isRunning', () => minecraftProcess !== null)

  ipcMain.handle('minecraft:kill', () => {
    if (minecraftProcess) {
      minecraftProcess.kill()
      minecraftProcess = null
    }
  })
}
