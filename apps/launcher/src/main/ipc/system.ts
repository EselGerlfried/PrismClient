import { ipcMain, BrowserWindow, app, shell } from 'electron'

export function registerSystemIpc() {
  ipcMain.handle('system:getVersion', () => app.getVersion())

  ipcMain.handle('system:minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })

  ipcMain.handle('system:maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) win.unmaximize()
    else win?.maximize()
  })

  ipcMain.handle('system:close', () => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  ipcMain.handle('system:openExternal', (_e, url: string) => {
    if (/^https:\/\//i.test(url)) shell.openExternal(url)
  })
}
