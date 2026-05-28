import { ipcMain, app, BrowserWindow } from 'electron'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BACKEND = 'http://localhost:3001'

function tokensPath() {
  return join(app.getPath('userData'), 'tokens.json')
}

export function registerAuthIpc() {
  ipcMain.handle('auth:getTokens', () => {
    const p = tokensPath()
    if (!existsSync(p)) return null
    try {
      return JSON.parse(readFileSync(p, 'utf8'))
    } catch {
      return null
    }
  })

  ipcMain.handle('auth:saveTokens', (_e, tokens: unknown) => {
    writeFileSync(tokensPath(), JSON.stringify(tokens), 'utf8')
  })

  ipcMain.handle('auth:clearTokens', () => {
    const p = tokensPath()
    if (existsSync(p)) unlinkSync(p)
  })

  // Opens an Electron BrowserWindow for MS OAuth, intercepts the redirect,
  // exchanges the code via backend, returns { user, tokens }
  ipcMain.handle('auth:startLogin', async () => {
    // 1. Ask backend for the auth URL (it owns MS_CLIENT_ID)
    const urlRes = await fetch(`${BACKEND}/api/auth/url`).catch(() => null)
    if (!urlRes?.ok) throw new Error('Backend not running on port 3001')
    const { url, redirectUri } = (await urlRes.json()) as { url: string; redirectUri: string }

    // 2. Open auth window
    const authWin = new BrowserWindow({
      width: 520,
      height: 700,
      title: 'Sign in with Microsoft',
      webPreferences: { nodeIntegration: false, contextIsolation: true },
    })
    authWin.loadURL(url)

    // 3. Wait for redirect back to redirectUri (code extraction)
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!authWin.isDestroyed()) authWin.close()
        reject(new Error('Login timed out after 5 minutes'))
      }, 5 * 60 * 1000)

      function handleRedirect(_e: Electron.Event, navUrl: string) {
        if (!navUrl.startsWith(redirectUri)) return
        clearTimeout(timer)
        authWin.webContents.off('will-redirect', handleRedirect)
        if (!authWin.isDestroyed()) authWin.close()

        const code = new URL(navUrl).searchParams.get('code')
        if (!code) { reject(new Error('No code in redirect URL')); return }

        // 4. Exchange code via backend
        fetch(`${BACKEND}/api/auth/microsoft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
          .then((r) => r.json())
          .then((data) => resolve(data))
          .catch(reject)
      }

      authWin.webContents.on('will-redirect', handleRedirect)

      authWin.on('closed', () => {
        clearTimeout(timer)
        reject(new Error('Login cancelled'))
      })
    })
  })
}
