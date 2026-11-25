import { useEffect, useState } from 'react'
import { unibusService } from '../services/unibusService'
import { resumirHorarios } from '../services/catalogoService'

// Consulta somente as linhas visíveis, cancelando pedidos ao trocar de página.
export default function useHorarios(ids, fonte) {
  const idsChave = JSON.stringify(fonte === 'api' ? ids : [])
  const [tentativa, setTentativa] = useState(0)
  const chave = `${idsChave}:${tentativa}`
  const [resultado, setResultado] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all(JSON.parse(idsChave).map(async id => {
      try {
        const { data } = await unibusService.getHorariosPorLinha(id, { signal: controller.signal })
        if (!Array.isArray(data)) throw new Error('Resposta inválida de horários.')
        return [id, resumirHorarios(data)]
      } catch (error) {
        return [id, { erro: error.message }]
      }
    })).then(entries => {
      if (!controller.signal.aborted) setResultado({ chave, dados: Object.fromEntries(entries) })
    })
    return () => controller.abort()
  }, [idsChave, chave])
  const dados = resultado?.chave === chave ? resultado.dados : {}
  return {
    dados,
    temErro: Object.values(dados).some(item => item.erro),
    erro: Object.values(dados).find(item => item.erro)?.erro,
    tentarNovamente: () => setTentativa(valor => valor + 1),
    texto: (linha, campo) => fonte !== 'api' ? linha[campo] : !dados[linha.id]
      ? 'Carregando…' : dados[linha.id].erro ? 'Indisponível' : dados[linha.id][campo] || 'Não cadastrado hoje',
  }
}
