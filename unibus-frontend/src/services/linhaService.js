import { normalizarTexto } from "../utils/texto.js"
import { pontosEmbarquePorCidade } from "../data/pontosEmbarque.js"

const ordemAlfabetica = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true })

function prioridadeRota(linha) {
  return /^Rota \d+ .+$/i.test(linha.nome) ? 0 : 1
}

export function obterFaculdades(linha) {
  return linha.faculdades ?? [linha.faculdade]
}

export function obterPontosEmbarque(linha) {
  return pontosEmbarquePorCidade[linha.origem] ?? []
}

export function formatarTrajeto(linha) {
  return [linha.origem, ...obterFaculdades(linha)].join(" → ")
}

export function abreviarOrigem(origem) {
  return origem === "Vitória de Santo Antão" ? "Vitória de S. Antão" : origem
}

export function buscarLinhas(linhas, termo) {
  const termos = normalizarTexto(termo.trim()).split(/\s+/).filter(Boolean)

  if (termos.length === 0) {
    return linhas
  }

  const nomeBuscado = termos.join(" ")
  const correspondenciasExatas = linhas.filter((linha) =>
    normalizarTexto(linha.nome) === nomeBuscado
  )

  if (correspondenciasExatas.length > 0) {
    return correspondenciasExatas
  }

  return linhas.filter((linha) => {
    const texto = normalizarTexto(
      `${String(linha.id).padStart(2, "0")} ${linha.nome} ${abreviarOrigem(linha.origem)} ${formatarTrajeto(linha)}`
    )
    return termos.every((palavra) => texto.includes(palavra))
  })
}

export function filtrarLinhasPorStatus(linhas, status) {
  if (!status || status === "todos") {
    return linhas
  }

  return linhas.filter((linha) => linha.status === status)
}

export function ordenarLinhasPorOrigem(linhas, ordem = "asc") {
  const linhasOrdenadas = [...linhas].sort((a, b) =>
    ordemAlfabetica.compare(a.origem, b.origem)
    || prioridadeRota(a) - prioridadeRota(b)
    || ordemAlfabetica.compare(a.nome, b.nome)
    || a.id - b.id
  )

  if (ordem === "desc") {
    return linhasOrdenadas.reverse()
  }

  return linhasOrdenadas
}
