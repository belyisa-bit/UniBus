import assert from 'node:assert/strict'
import { test } from 'node:test'
import api from './api.js'

test('cliente HTTP trata autenticação, permissão e credenciais inválidas separadamente', async t => {
  const valores = new Map([['unibus-token', 'token-teste'], ['unibus-user', '{"id":1}']])
  const eventos = []
  t.mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 401 }))
  const storageOriginal = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const windowOriginal = Object.getOwnPropertyDescriptor(globalThis, 'window')
  t.after(() => {
    if (storageOriginal) Object.defineProperty(globalThis, 'localStorage', storageOriginal)
    else delete globalThis.localStorage
    if (windowOriginal) Object.defineProperty(globalThis, 'window', windowOriginal)
    else delete globalThis.window
  })
  Object.defineProperty(globalThis, 'localStorage', { value: {
    getItem: key => valores.get(key) ?? null,
    removeItem: key => valores.delete(key),
  }, configurable: true })
  Object.defineProperty(globalThis, 'window', { value: { dispatchEvent: event => eventos.push(event.type) }, configurable: true })

  await assert.rejects(api.post('/auth/login', { email: 'teste@example.com', senha: 'invalida' }), { status: 401 })
  assert.equal(valores.get('unibus-token'), 'token-teste')
  assert.deepEqual(eventos, [])

  globalThis.fetch.mock.mockImplementation(async () => new Response('{}', { status: 403 }))
  await assert.rejects(api.get('/favoritos'), error => error.status === 403 && error.message.includes('permissão'))
  assert.equal(valores.get('unibus-token'), 'token-teste')

  globalThis.fetch.mock.mockImplementation(async () => new Response('{}', { status: 401 }))
  await assert.rejects(api.get('/favoritos'), { status: 401 })
  assert.equal(valores.size, 0)
  assert.deepEqual(eventos, ['unibus-auth-change'])
})
