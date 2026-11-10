const chaveAvisos = "unibus-avisos"

export function lerAvisosSalvos() {
  try {
    const salvo = localStorage.getItem(chaveAvisos)

    if (!salvo) {
      return []
    }

    const avisos = JSON.parse(salvo)

    return Array.isArray(avisos) ? avisos : []
  } catch {
    return []
  }
}

export function salvarAvisos(avisos) {
  localStorage.setItem(chaveAvisos, JSON.stringify(avisos))
}

export function adicionarAviso(aviso) {
  const avisos = lerAvisosSalvos()

  const novoAviso = {
    ...aviso,
    id: aviso.id ?? Date.now(),
    dataHora: aviso.dataHora ?? new Date().toISOString(),
  }

  salvarAvisos([novoAviso, ...avisos])

  return novoAviso
}

export function removerAviso(id) {
  const avisos = lerAvisosSalvos()
  const atualizados = avisos.filter((aviso) => aviso.id !== id)

  salvarAvisos(atualizados)

  return atualizados
}