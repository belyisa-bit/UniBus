const origens = {
  Goiana: [-7.56, -35.002],
  Condado: [-7.585, -35.105],
  Carpina: [-7.845, -35.254],
  "Aliança": [-7.604, -35.222],
  Paudalho: [-7.897, -35.18],
  Limoeiro: [-7.875, -35.45],
  "Vitória de Santo Antão": [-8.118, -35.292],
  Moreno: [-8.118, -35.092],
  "Sirinhaém": [-8.59, -35.116],
  Itaquitinga: [-7.668, -35.1],
}

const faculdades = {
  UFPE: [-8.051, -34.947],
  UNINASSAU: [-8.037, -34.899],
  UNICAP: [-8.05, -34.889],
  UNIBRA: [-8.055, -34.894],
  UFRPE: [-8.016, -34.95],
  IFPE: [-8.059, -34.951],
  "ESTÁCIO": [-8.063, -34.926],
}

function interpolarPercurso(inicio, fim) {
  return Array.from({ length: 81 }, (_, passo) => {
    const fracao = passo / 80
    return inicio.map((valor, eixo) => valor + (fim[eixo] - valor) * fracao)
  })
}

export function criarRotaGpsDemo(linha) {
  const [origemNome, faculdadeNome] = linha.nome.split(" → ").map((parte) => parte.trim())
  const origem = origens[origemNome]
  const faculdade = faculdades[faculdadeNome]

  if (!origem || !faculdade) return null

  return {
    pontos: [
      { nome: origemNome, tipo: "origem", coordenadas: origem },
      { nome: faculdadeNome, tipo: "faculdade", coordenadas: faculdade },
    ],
    percurso: interpolarPercurso(origem, faculdade),
  }
}
