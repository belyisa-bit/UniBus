export function buscarLinhas(linhas, termo) {
  const busca = termo.trim().toLowerCase()

  if (!busca) {
    return linhas
  }

  return linhas.filter((linha) =>
    linha.nome.toLowerCase().includes(busca)
  )
}

export function filtrarLinhasPorStatus(linhas, status) {
  if (!status || status === "todos") {
    return linhas
  }

  return linhas.filter((linha) => linha.status === status)
}

export function ordenarLinhasPorNome(linhas, ordem = "asc") {
  const linhasOrdenadas = [...linhas].sort((a, b) =>
    a.nome.localeCompare(b.nome)
  )

  if (ordem === "desc") {
    return linhasOrdenadas.reverse()
  }

  return linhasOrdenadas
}