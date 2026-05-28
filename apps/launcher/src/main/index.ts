import { app, BrowserWindow } from 'electron'
import { join } from 'node:path'
import { setupUpdater } from './updater.js'
import { registerIpcHandlers } from './ipc/index.js'

const isDev = process.env.NODE_ENV !== 'production'

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#07070f',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // sandbox:true breaks contextBridge in some electron versions
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  win.on('closed', () => {
    win = null
  })
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()
  if (win) setupUpdater(win)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
