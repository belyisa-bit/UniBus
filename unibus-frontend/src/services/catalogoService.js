import { linhas } from '../data/linhas.js'
import { unibusService } from './unibusService.js'

export function normalizarLinha(item) {
  const partes = (item.nome || '').split(/\s*→\s*/)
  const faculdades = item.campus?.length ? item.campus : partes.slice(1)
  return {
    id: item.id,
    nome: item.codigo ? `${item.codigo} · ${item.nome}` : item.nome || `Linha ${item.id}`,
    codigo: item.codigo,
    empresa: item.empresa || '',
    demonstrativa: item.empresa === 'UniBus — demonstração local',
    origem: (partes.length > 1 ? partes[0] : item.zona || partes[0]) || 'Origem não informada',
    zona: item.zona,
    faculdades,
    horarioSaida: null,
    horarioRetorno: null,
    status: item.ativa === false ? 'Fora de operação' : 'Em operação',
  }
}

export async function carregarCatalogo({ fonte = 'api', permitirLocal = false, signal } = {}, client = unibusService) {
  if (fonte === 'local') return { linhas, fonte: 'local', estado: 'local' }
  try {
    const { data } = await client.getLinhas({ signal })
    if (!Array.isArray(data)) throw new Error('Resposta inválida da API de linhas.')
    return { linhas: data.map(normalizarLinha), fonte: 'api', estado: 'sucesso' }
  } catch (error) {
    if (signal?.aborted || error.status === 401 || error.status === 403 || !permitirLocal) throw error
    return { linhas, fonte: 'local', estado: 'contingencia' }
  }
}

export function resumirHorarios(horarios, dia = new Date().getDay()) {
  const dias = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const hoje = horarios.filter(item => item.ativo !== false && item.diaSemana === dias[dia])
  const primeiro = sentidos => hoje
    .filter(item => sentidos.includes(item.sentido?.trim().toUpperCase()))
    .map(item => item.hora?.slice(0, 5)).filter(Boolean).sort()[0] || null
  return { horarioSaida: primeiro(['IDA']), horarioRetorno: primeiro(['VOLTA', 'RETORNO']) }
}

export function linkDetalhes(id, fonte = 'api') {
  return `/linhas/${encodeURIComponent(id)}${fonte === 'local' ? '?fonte=local' : ''}`
}

export function nomesPontosEmbarque(paradas) {
  // Referência exigida pelo horário demonstrativo, não um ponto físico de embarque.
  return paradas.filter(parada => parada.ativa !== false
    && parada.nome !== 'Retorno: confirmar embarque com o motorista')
    .map(parada => parada.nome)
}
