import assert from 'node:assert/strict'
import { test } from 'node:test'
import { carregarCatalogo, linkDetalhes, normalizarLinha, resumirHorarios } from './catalogoService.js'
import { buscarLinhas } from './linhaService.js'
import { criarRotaDemo } from '../data/rotasGpsDemo.js'

const sucesso = data => ({ getLinhas: async () => ({ data }) })
const falha = error => ({ getLinhas: async () => { throw error } })

test('catálogo aceita lista vazia sem trocar por dados locais', async () => {
  const catalogo = await carregarCatalogo({ permitirLocal: true }, sucesso([]))
  assert.equal(catalogo.estado, 'sucesso')
  assert.equal(catalogo.fonte, 'api')
  assert.deepEqual(catalogo.linhas, [])
})

test('mantém todos os IDs remotos, incluindo os ausentes nos dados locais', async () => {
  const items = Array.from({ length: 70 }, (_, i) => ({ id: i + 1, nome: 'Goiana → UFPE' }))
  const catalogo = await carregarCatalogo({}, sucesso(items))
  assert.equal(catalogo.linhas.length, 70)
  assert.equal(catalogo.linhas.find(l => l.id === 70).faculdades[0], 'UFPE')
  assert.equal(catalogo.linhas[0].horarioSaida, null)
})

test('falha recuperável permite contingência na listagem, nunca substitui detalhe remoto', async () => {
  const error = new TypeError('Failed to fetch')
  const client = falha(error)
  const catalogo = await carregarCatalogo({ permitirLocal: true }, client)
  assert.equal(catalogo.estado, 'contingencia')
  assert.equal(catalogo.fonte, 'local')
  assert.ok(catalogo.linhas.length > 0)
  await assert.rejects(carregarCatalogo({}, client), error)
})

test('401 e 403 não são ocultados por dados de contingência', async () => {
  for (const status of [401, 403]) {
    await assert.rejects(carregarCatalogo({ permitirLocal: true }, falha(Object.assign(new Error(), { status }))), { status })
  }
})

test('requisição cancelada não ativa contingência e pode ser tentada novamente', async () => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(carregarCatalogo({ permitirLocal: true, signal: controller.signal }, falha(new Error('cancelada'))))
  assert.equal((await carregarCatalogo({}, sucesso([]))).estado, 'sucesso')
})

test('rotas locais são explícitas e funcionam sem API', async () => {
  const catalogo = await carregarCatalogo({ fonte: 'local' }, falha(new Error('não deve consultar')))
  assert.equal(catalogo.estado, 'local')
  assert.equal(linkDetalhes(1, 'local'), '/linhas/1?fonte=local')
  assert.equal(linkDetalhes(1, 'api'), '/linhas/1')
})

test('normalização mantém cidade separada da zona e permite busca por empresa', () => {
  const linha = normalizarLinha({ id: 1, codigo: '001', nome: 'Goiana → UFPE', zona: 'Norte', empresa: 'Transporte Teste' })
  assert.equal(linha.origem, 'Goiana')
  assert.equal(linha.zona, 'Norte')
  assert.deepEqual(buscarLinhas([linha], 'transporte teste'), [linha])
  assert.deepEqual(buscarLinhas([linha], '001'), [linha])
})

test('horários usam o dia atual, sentido e situação; não inventam retorno', () => {
  const registros = [
    { diaSemana: 'MONDAY', sentido: 'IDA', hora: '16:00', ativo: true },
    { diaSemana: 'WEDNESDAY', sentido: 'IDA', hora: '18:00', ativo: true },
    { diaSemana: 'WEDNESDAY', sentido: 'IDA', hora: '17:00', ativo: true },
    { diaSemana: 'WEDNESDAY', sentido: 'IDA', hora: '15:00', ativo: false },
    { diaSemana: 'WEDNESDAY', sentido: 'VOLTA', hora: '22:00', ativo: true },
  ]
  assert.deepEqual(resumirHorarios(registros, 3), { horarioSaida: '17:00', horarioRetorno: '22:00' })
  assert.deepEqual(resumirHorarios(registros, 1), { horarioSaida: '16:00', horarioRetorno: null })
  assert.deepEqual(resumirHorarios([], 3), { horarioSaida: null, horarioRetorno: null })
})

test('mapa demonstrativo usa o trajeto recebido, não a rota local com mesmo ID', () => {
  const linha = normalizarLinha({ id: 1, nome: 'Condado → UFPE' })
  const mapa = criarRotaDemo(linha)
  assert.equal(mapa.pontos.at(-1).nome, 'UFPE')
  assert.equal(mapa.pontos.some(p => p.nome === 'IFPE'), false)
  assert.ok(mapa.percurso.length > 1)
})
