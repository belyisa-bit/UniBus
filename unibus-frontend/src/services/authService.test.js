import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Buffer } from 'node:buffer'
import { authService } from './authService.js'

test('restaura sessão, rejeita token expirado/corrompido e remove dados no logout', t => {
  const valores = new Map()
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => valores.get(key) ?? null,
    removeItem: key => valores.delete(key),
  } })
  t.after(() => {
    if (original) Object.defineProperty(globalThis, 'localStorage', original)
    else delete globalThis.localStorage
  })
  const gravar = exp => {
    valores.set('unibus-user', JSON.stringify({ id: 1, nome: 'Teste', email: 'teste@example.com' }))
    valores.set('unibus-token', `teste.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.teste`)
  }
  assert.equal(authService.getUsuario(), null)
  gravar(Math.floor(Date.now() / 1000) + 60)
  assert.equal(authService.getUsuario().id, 1)
  assert.equal(authService.getUsuario().id, 1)
  authService.logout()
  assert.equal(valores.size, 0)
  gravar(1)
  assert.equal(authService.getUsuario(), null)
  assert.equal(valores.size, 0)
  gravar(1)
  valores.set('unibus-token', 'corrompido')
  assert.equal(authService.getUsuario(), null)
})
