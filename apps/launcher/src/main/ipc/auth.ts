import { ipcMain, app } from 'electron'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'

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

  ipcMain.handle('auth:getMsAuthUrl', () => {
    const params = new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID ?? '',
      response_type: 'code',
      redirect_uri: process.env.MS_REDIRECT_URI ?? 'http://localhost:3001/api/auth/callback',
      scope: 'XboxLive.signin offline_access',
    })
    return `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${params}`
  })
}
