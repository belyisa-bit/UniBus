import { useEffect, useState } from 'react'
import { unibusService } from '../services/unibusService'

export default function useParadas(id, fonte) {
  const [tentativa, setTentativa] = useState(0)
  const chave = `${fonte}:${id}:${tentativa}`
  const [resultado, setResultado] = useState(null)
  useEffect(() => {
    if (!id || fonte !== 'api') return
    const controller = new AbortController()
    unibusService.getParadasPorLinha(id, { signal: controller.signal })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Resposta inválida de pontos de embarque.')
        if (!controller.signal.aborted) setResultado({ chave, pontos: data.filter(p => p.ativa !== false).map(p => p.nome) })
      })
      .catch(error => {
        if (!controller.signal.aborted) setResultado({ chave, pontos: [], erro: error.message })
      })
    return () => controller.abort()
  }, [id, fonte, chave])
  return {
    ...(resultado?.chave === chave ? resultado : { pontos: [], carregando: true }),
    tentarNovamente: () => setTentativa(valor => valor + 1),
  }
}
