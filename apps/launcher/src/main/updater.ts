import { BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

export function setupUpdater(win: BrowserWindow) {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('updater:available', info)
  })

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('updater:progress', progress)
  })

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('updater:ready')
  })

  ipcMain.handle('updater:check', () => {
    return autoUpdater.checkForUpdates().catch(() => null)
  })

  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates().catch(() => {})
  }
}
