import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('prism', {
  auth: {
    getTokens: () => ipcRenderer.invoke('auth:getTokens'),
    saveTokens: (tokens: unknown) => ipcRenderer.invoke('auth:saveTokens', tokens),
    clearTokens: () => ipcRenderer.invoke('auth:clearTokens'),
    getMsAuthUrl: () => ipcRenderer.invoke('auth:getMsAuthUrl'),
  },
  minecraft: {
    launch: (profileId: string) => ipcRenderer.invoke('minecraft:launch', profileId),
    getVersions: () => ipcRenderer.invoke('minecraft:getVersions'),
    isRunning: () => ipcRenderer.invoke('minecraft:isRunning'),
    kill: () => ipcRenderer.invoke('minecraft:kill'),
  },
  updater: {
    checkForUpdates: () => ipcRenderer.invoke('updater:check'),
    onUpdateAvailable: (cb: (info: unknown) => void) => {
      ipcRenderer.on('updater:available', (_e, info) => cb(info))
    },
    onUpdateProgress: (cb: (progress: { percent: number }) => void) => {
      ipcRenderer.on('updater:progress', (_e, progress) => cb(progress))
    },
  },
  system: {
    getVersion: () => ipcRenderer.invoke('system:getVersion'),
    minimize: () => ipcRenderer.invoke('system:minimize'),
    maximize: () => ipcRenderer.invoke('system:maximize'),
    close: () => ipcRenderer.invoke('system:close'),
    openExternal: (url: string) => ipcRenderer.invoke('system:openExternal', url),
  },
})
