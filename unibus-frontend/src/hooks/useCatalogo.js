import { useEffect, useState } from 'react'
import { carregarCatalogo } from '../services/catalogoService'

export default function useCatalogo(fonte = 'api', permitirLocal = false) {
  const [tentativa, setTentativa] = useState(0)
  const chave = `${fonte}:${tentativa}`
  const [resultado, setResultado] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    carregarCatalogo({ fonte, permitirLocal, signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setResultado({ ...data, chave }) })
      .catch(error => {
        if (!controller.signal.aborted) setResultado({ chave, linhas: [], fonte, estado: 'erro', erro: error.message })
      })
    return () => controller.abort()
  }, [fonte, permitirLocal, chave])
  return {
    ...(resultado?.chave === chave ? resultado : { linhas: [], fonte, estado: 'carregando' }),
    tentarNovamente: () => setTentativa(valor => valor + 1),
  }
}
