import { registerAuthIpc } from './auth.js'
import { registerMinecraftIpc } from './minecraft.js'
import { registerSystemIpc } from './system.js'

export function registerIpcHandlers() {
  registerAuthIpc()
  registerMinecraftIpc()
  registerSystemIpc()
}
