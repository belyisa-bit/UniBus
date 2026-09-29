import { linhas } from "./linhas.js"
import { obterFaculdades, obterPontosEmbarque } from "../services/linhaService.js"

// Coordenadas aproximadas e fictícias para apresentação, não para navegação.
// As posições de embarque seguem a ordem do cadastro de pontos da cidade.
const origensDemo = {
  Goiana: { centro: [-7.56, -35.002], embarques: [[-7.566, -35.007], [-7.56, -35.002], [-7.552, -35.001]] },
  Condado: { centro: [-7.585, -35.105], embarques: [[-7.585, -35.105], [-7.59, -35.101]] },
  Carpina: { centro: [-7.845, -35.254], embarques: [[-7.845, -35.254], [-7.85, -35.25], [-7.854, -35.24]] },
  Aliança: { centro: [-7.604, -35.222], embarques: [[-7.612, -35.217], [-7.607, -35.222], [-7.604, -35.225]] },
  Paudalho: { centro: [-7.897, -35.18] },
  Limoeiro: { centro: [-7.875, -35.45] },
  "Vitória de Santo Antão": { centro: [-8.118, -35.292] },
  Moreno: { centro: [-8.118, -35.092] },
  Sirinhaém: { centro: [-8.59, -35.116] },
  Itaquitinga: { centro: [-7.668, -35.1] },
}

const faculdadesDemo = {
  "UNINASSAU (Graças)": [-8.037, -34.899],
  "ESTÁCIO (Abdias de Carvalho)": [-8.063, -34.926],
  UNIBRA: [-8.055, -34.894],
  UNICAP: [-8.05, -34.889],
  IFPE: [-8.059, -34.951],
  UFPE: [-8.051, -34.947],
  UFRPE: [-8.016, -34.95],
}

function interpolarPercurso(pontos) {
  const percurso = []
  for (let i = 0; i < pontos.length - 1; i += 1) {
    const inicio = pontos[i].coordenadas
    const fim = pontos[i + 1].coordenadas
    for (let passo = 0; passo < 20; passo += 1) {
      const fracao = passo / 20
      percurso.push(inicio.map((valor, eixo) => valor + (fim[eixo] - valor) * fracao))
    }
  }
  percurso.push(pontos.at(-1).coordenadas)
  return percurso
}

export const rotasGpsDemo = linhas.map((linha) => {
  const origem = origensDemo[linha.origem]
  const embarques = obterPontosEmbarque(linha)
  const pontos = [
    ...(embarques.length
      ? embarques.map((nome, index) => ({ nome, tipo: "embarque", coordenadas: origem?.embarques?.[index] }))
      : [{ nome: linha.origem, tipo: "origem", coordenadas: origem?.centro }]),
    ...obterFaculdades(linha).map((nome) => ({ nome, tipo: "faculdade", coordenadas: faculdadesDemo[nome] })),
  ]

  // Uma rota sem todas as coordenadas não deve exibir um percurso incompleto.
  const completo = pontos.length > 1 && pontos.every((ponto) => ponto.coordenadas)
  return {
    rotaId: linha.id,
    demonstrativa: true,
    pontos: completo ? pontos : [],
    percurso: completo ? interpolarPercurso(pontos) : [],
  }
})
