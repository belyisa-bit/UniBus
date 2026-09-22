import assert from "node:assert/strict"
import { test } from "node:test"
import { linhas } from "../data/linhas.js"
import {
  buscarLinhas,
  formatarTrajeto,
  obterFaculdades,
  ordenarLinhasPorOrigem,
} from "./linhaService.js"
import { calcularMinutosAteSaida } from "../utils/horarios.js"

test("busca combina cidade e faculdade sem distinguir acentos ou maiúsculas", () => {
  const resultados = buscarLinhas(linhas, "  alianca   ESTACIO  ")

  assert.equal(resultados.length, 1)
  assert.equal(resultados[0].origem, "Aliança")
  assert.ok(obterFaculdades(resultados[0]).includes("ESTÁCIO (Abdias de Carvalho)"))
})

test("busca aceita a origem completa, abreviada e o identificador", () => {
  assert.deepEqual(
    buscarLinhas(linhas, "Vitória de S. Antão"),
    buscarLinhas(linhas, "Vitória de Santo Antão")
  )
  assert.ok(buscarLinhas(linhas, "01").some((linha) => linha.id === 1))
})

test("busca vazia retorna todas as linhas e termo inexistente retorna lista vazia", () => {
  assert.equal(buscarLinhas(linhas, "  ").length, 30)
  assert.deepEqual(buscarLinhas(linhas, "sem-correspondencia"), [])
})

test("cada faculdade filtra somente as rotas que a atendem", () => {
  for (const faculdade of new Set(linhas.flatMap(obterFaculdades))) {
    const resultados = buscarLinhas(linhas, faculdade)
    const atendidaPorCondado = ["ESTÁCIO (Abdias de Carvalho)", "UNINASSAU (Graças)", "UFRPE", "UFPE", "IFPE", "UNIBRA"].includes(faculdade)

    assert.equal(resultados.length, atendidaPorCondado ? 10 : 9)
    assert.ok(resultados.every((linha) => obterFaculdades(linha).includes(faculdade)))
    assert.equal(resultados.some((linha) => linha.origem === "Condado"), atendidaPorCondado)
  }
})

test("ordenação mantém os dados originais e organiza cidades e números das rotas", () => {
  const original = structuredClone(linhas)
  const ordenadas = ordenarLinhasPorOrigem(linhas)
  const cidades = [...new Set(ordenadas.map((linha) => linha.origem))]

  assert.deepEqual(linhas, original)
  assert.deepEqual(cidades, [
    "Aliança", "Carpina", "Condado", "Goiana", "Itaquitinga",
    "Limoeiro", "Moreno", "Paudalho", "Sirinhaém", "Vitória de Santo Antão",
  ])
  assert.deepEqual(ordenadas.filter((linha) => linha.origem === "Aliança").map(obterFaculdades), [
    ["UNIBRA", "ESTÁCIO (Abdias de Carvalho)", "UNINASSAU (Graças)", "UNICAP"], ["IFPE", "UFPE", "UFRPE"],
  ])
  assert.deepEqual(ordenarLinhasPorOrigem(linhas, "desc"), [...ordenadas].reverse())
  assert.equal(new Set(ordenadas.map((linha) => linha.id)).size, 30)
})

test("todas as cidades exibem rotas numeradas antes das linhas separadas", () => {
  const ordenadas = ordenarLinhasPorOrigem([...linhas].reverse())
  const cidades = [...new Set(ordenadas.map((linha) => linha.origem))]

  for (const cidade of cidades) {
    const nomes = ordenadas.filter((linha) => linha.origem === cidade).map((linha) => linha.nome)
    const esperados = [`Rota 1 ${cidade}`, `Rota 2 ${cidade}`]

    if (["Condado", "Carpina"].includes(cidade)) {
      esperados.push(`Rota 3 ${cidade}`)
    }
    if (!["Condado", "Aliança"].includes(cidade)) {
      esperados.push(`${cidade} → UFRPE`)
    }

    assert.deepEqual(nomes, esperados)
    assert.deepEqual(buscarLinhas(ordenadas, cidade).map((linha) => linha.nome), esperados)
  }
})

test("Condado mantém a primeira rota e possui três rotas distintas", () => {
  const rotas = linhas.filter((linha) => linha.origem === "Condado")

  assert.equal(rotas.length, 3)
  assert.deepEqual(buscarLinhas(linhas, "Condado"), rotas)
  assert.equal(rotas[0].nome, "Rota 1 Condado")
  assert.deepEqual(rotas[0].faculdades, ["ESTÁCIO (Abdias de Carvalho)", "UNINASSAU (Graças)"])
  assert.equal(rotas[0].faculdade, undefined)
  assert.equal(rotas[0].horarioSaida, "16:00")
  assert.equal(rotas[0].horarioRetorno, "21:30")
  assert.equal(rotas[0].status, "Em operação")
  assert.equal(formatarTrajeto(rotas[0]), "Condado → ESTÁCIO (Abdias de Carvalho) → UNINASSAU (Graças)")

  for (const termo of ["Rota 1 Condado", "Condado Estacio", "Condado Uninassau"]) {
    assert.deepEqual(buscarLinhas(linhas, termo), [rotas[0]])
  }
})

test("segunda rota de Condado atende UFRPE, UFPE e IFPE na ordem definida", () => {
  const rota = linhas.find((linha) => linha.nome === "Rota 2 Condado")

  assert.ok(rota)
  assert.equal(rota.origem, "Condado")
  assert.deepEqual(rota.faculdades, ["UFRPE", "UFPE", "IFPE"])
  assert.equal(formatarTrajeto(rota), "Condado → UFRPE → UFPE → IFPE")
  assert.equal(rota.horarioSaida, "16:00")
  assert.equal(rota.horarioRetorno, "21:30")
  assert.equal(rota.status, "Em operação")
  for (const termo of ["Rota 2 Condado", "Condado UFRPE", "Condado UFPE", "Condado IFPE"]) {
    assert.deepEqual(buscarLinhas(linhas, termo), [rota])
  }
})

test("Condado atende UNIBRA em uma rota separada sem duplicação", () => {
  const resultados = buscarLinhas(linhas, "Condado UNIBRA")

  assert.equal(resultados.length, 1)
  const [rota] = resultados
  assert.equal(rota.id, 11)
  assert.equal(rota.nome, "Rota 3 Condado")
  assert.deepEqual(rota.faculdades, ["UNIBRA"])
  assert.equal(formatarTrajeto(rota), "Condado → UNIBRA")
  assert.equal(rota.horarioSaida, "16:00")
  assert.equal(rota.horarioRetorno, "21:30")
  assert.equal(rota.status, "Em operação")
})

test("contagem de Condado continua usando a saída das 16:00", () => {
  const rota = linhas.find((linha) => linha.origem === "Condado")

  assert.equal(calcularMinutosAteSaida(rota.horarioSaida, new Date(2026, 8, 22, 15, 45)), 15)
  assert.equal(calcularMinutosAteSaida(rota.horarioSaida, new Date(2026, 8, 22, 16, 0)), 0)
})

test("leitura de faculdades mantém compatibilidade com linhas individuais", () => {
  const rota = { origem: "Paudalho", faculdade: "UFPE" }

  assert.deepEqual(obterFaculdades(rota), ["UFPE"])
  assert.equal(formatarTrajeto(rota), "Paudalho → UFPE")
})

test("Aliança agrupa UNIBRA, ESTÁCIO (Abdias de Carvalho), UNINASSAU (Graças) e UNICAP na rota 1 sem duplicar atendimento", () => {
  const rotas = buscarLinhas(linhas, "Aliança")
  const rota = rotas.find((linha) => linha.nome === "Rota 1 Aliança")

  assert.equal(rotas.length, 2)
  assert.ok(rota)
  assert.deepEqual(rota.faculdades, ["UNIBRA", "ESTÁCIO (Abdias de Carvalho)", "UNINASSAU (Graças)", "UNICAP"])
  assert.equal(formatarTrajeto(rota), "Aliança → UNIBRA → ESTÁCIO (Abdias de Carvalho) → UNINASSAU (Graças) → UNICAP")
  for (const faculdade of rota.faculdades) {
    assert.deepEqual(buscarLinhas(linhas, `alianca ${faculdade}`), [rota])
  }
  assert.deepEqual(buscarLinhas(linhas, "Rota 1 Aliança"), [rota])
  for (const linha of rotas) {
    assert.equal(linha.horarioSaida, "16:00")
    assert.equal(linha.horarioRetorno, "21:30")
    assert.equal(linha.status, "Em operação")
  }
})

test("Aliança agrupa IFPE, UFPE e UFRPE na segunda rota sem duplicação", () => {
  const rota = linhas.find((linha) => linha.nome === "Rota 2 Aliança")

  assert.ok(rota)
  assert.equal(rota.origem, "Aliança")
  assert.deepEqual(rota.faculdades, ["IFPE", "UFPE", "UFRPE"])
  assert.equal(formatarTrajeto(rota), "Aliança → IFPE → UFPE → UFRPE")
  assert.equal(rota.horarioSaida, "16:00")
  assert.equal(rota.horarioRetorno, "21:30")
  for (const faculdade of rota.faculdades) {
    assert.deepEqual(buscarLinhas(linhas, `Aliança ${faculdade}`), [rota])
  }
  assert.deepEqual(buscarLinhas(linhas, "Rota 2 Aliança"), [rota])
})

test("UNICAP é atendida apenas pela rota 1 de Aliança", () => {
  const resultados = buscarLinhas(linhas, "Aliança UNICAP")

  assert.equal(resultados.length, 1)
  assert.equal(resultados[0].id, 25)
  assert.equal(resultados[0].nome, "Rota 1 Aliança")
  assert.ok(!linhas.some((linha) => linha.id === 24))
})

test("Carpina agrupa UNIBRA e UNICAP em uma única rota, nessa ordem", () => {
  const rotas = buscarLinhas(linhas, "Carpina")
  const rota = rotas.find((linha) => linha.nome === "Rota 1 Carpina")

  assert.equal(rotas.length, 4)
  assert.ok(rota)
  assert.deepEqual(rota.faculdades, ["UNIBRA", "UNICAP"])
  assert.equal(formatarTrajeto(rota), "Carpina → UNIBRA → UNICAP")
  for (const termo of ["Carpina UNIBRA", "Carpina UNICAP", "Rota 1 Carpina"]) {
    assert.deepEqual(buscarLinhas(linhas, termo), [rota])
  }
  for (const linha of rotas) {
    assert.equal(linha.horarioSaida, "17:00")
    assert.equal(linha.horarioRetorno, "21:50")
    assert.equal(linha.status, "Em operação")
  }
})

test("Carpina preserva a linha separada da UFRPE e seu identificador", () => {
  const resultados = buscarLinhas(linhas, "Carpina UFRPE")

  assert.equal(resultados.length, 1)
  assert.equal(resultados[0].id, 19)
  assert.deepEqual(obterFaculdades(resultados[0]), ["UFRPE"])
})

test("Carpina agrupa UNINASSAU (Graças) e ESTÁCIO (Abdias de Carvalho) na rota 02 sem duplicação", () => {
  const rota = linhas.find((linha) => linha.nome === "Rota 2 Carpina")

  assert.ok(rota)
  assert.equal(rota.origem, "Carpina")
  assert.deepEqual(rota.faculdades, ["UNINASSAU (Graças)", "ESTÁCIO (Abdias de Carvalho)"])
  assert.equal(formatarTrajeto(rota), "Carpina → UNINASSAU (Graças) → ESTÁCIO (Abdias de Carvalho)")
  assert.equal(rota.horarioSaida, "17:00")
  assert.equal(rota.horarioRetorno, "21:50")
  for (const termo of ["Carpina UNINASSAU", "Carpina Estacio", "Rota 2 Carpina"]) {
    assert.deepEqual(buscarLinhas(linhas, termo), [rota])
  }
})

test("Carpina agrupa UFPE e IFPE na rota 03 sem duplicação", () => {
  const rota = linhas.find((linha) => linha.nome === "Rota 3 Carpina")

  assert.ok(rota)
  assert.equal(rota.origem, "Carpina")
  assert.deepEqual(rota.faculdades, ["UFPE", "IFPE"])
  assert.equal(formatarTrajeto(rota), "Carpina → UFPE → IFPE")
  assert.equal(rota.horarioSaida, "17:00")
  assert.equal(rota.horarioRetorno, "21:50")
  for (const termo of ["Carpina UFPE", "Carpina IFPE", "Rota 3 Carpina"]) {
    assert.deepEqual(buscarLinhas(linhas, termo), [rota])
  }
})

test("Goiana agrupa UNINASSAU (Graças), UNIBRA, UNICAP e ESTÁCIO (Abdias de Carvalho) na rota 01 sem duplicação", () => {
  const rotas = buscarLinhas(linhas, "Goiana")
  const rota = rotas.find((linha) => linha.nome === "Rota 1 Goiana")

  assert.equal(rotas.length, 3)
  assert.ok(rota)
  assert.deepEqual(rota.faculdades, ["UNINASSAU (Graças)", "UNIBRA", "UNICAP", "ESTÁCIO (Abdias de Carvalho)"])
  assert.equal(formatarTrajeto(rota), "Goiana → UNINASSAU (Graças) → UNIBRA → UNICAP → ESTÁCIO (Abdias de Carvalho)")
  for (const termo of ["Goiana UNINASSAU", "Goiana UNIBRA", "Goiana UNICAP", "Goiana Estacio", "Rota 1 Goiana"]) {
    assert.deepEqual(buscarLinhas(linhas, termo), [rota])
  }
  for (const linha of rotas) {
    assert.equal(linha.horarioSaida, "17:00")
    assert.equal(linha.horarioRetorno, "21:00")
    assert.equal(linha.status, "Em operação")
  }
})

test("Goiana preserva a linha separada da UFRPE e seu identificador", () => {
  const resultados = buscarLinhas(linhas, "Goiana UFRPE")

  assert.equal(resultados.length, 1)
  assert.equal(resultados[0].id, 5)
  assert.deepEqual(obterFaculdades(resultados[0]), ["UFRPE"])
})

test("Goiana agrupa IFPE e UFPE na rota 02 sem duplicação", () => {
  const rota = linhas.find((linha) => linha.nome === "Rota 2 Goiana")

  assert.ok(rota)
  assert.equal(rota.origem, "Goiana")
  assert.deepEqual(rota.faculdades, ["IFPE", "UFPE"])
  assert.equal(formatarTrajeto(rota), "Goiana → IFPE → UFPE")
  assert.equal(rota.horarioSaida, "17:00")
  assert.equal(rota.horarioRetorno, "21:00")
  for (const termo of ["Goiana IFPE", "Goiana UFPE", "Rota 2 Goiana"]) {
    assert.deepEqual(buscarLinhas(linhas, termo), [rota])
  }
})

test("nome completo da rota tem prioridade sobre números de outros identificadores", () => {
  const resultados = buscarLinhas(linhas, "  ROTA   2  GOIANA  ")

  assert.equal(resultados.length, 1)
  assert.equal(resultados[0].nome, "Rota 2 Goiana")
  assert.ok(buscarLinhas(linhas, "02").some((linha) => linha.id === 2))
})

const cidadesComModeloGoiana = [
  { origem: "Paudalho", saida: "17:00", retorno: "21:50", ids: [30, 29, 33] },
  { origem: "Limoeiro", saida: "16:00", retorno: "21:50", ids: [37, 36, 40] },
  { origem: "Vitória de Santo Antão", saida: "17:00", retorno: "21:50", ids: [44, 43, 47] },
  { origem: "Moreno", saida: "17:00", retorno: "21:50", ids: [51, 50, 54] },
  { origem: "Sirinhaém", saida: "16:00", retorno: "21:50", ids: [58, 57, 61] },
  { origem: "Itaquitinga", saida: "16:00", retorno: "21:30", ids: [65, 64, 68] },
]

for (const { origem, saida, retorno, ids } of cidadesComModeloGoiana) {
  test(`${origem} segue o modelo de Goiana, sem perder faculdades ou horários`, () => {
    const rotas = buscarLinhas(linhas, origem)

    assert.equal(rotas.length, 3)
    assert.deepEqual(rotas.map((rota) => rota.id), ids)
    assert.deepEqual(rotas.map(obterFaculdades), [
      ["UNINASSAU (Graças)", "UNIBRA", "UNICAP", "ESTÁCIO (Abdias de Carvalho)"],
      ["IFPE", "UFPE"],
      ["UFRPE"],
    ])
    assert.equal(rotas[0].nome, `Rota 1 ${origem}`)
    assert.equal(rotas[1].nome, `Rota 2 ${origem}`)
    assert.equal(new Set(rotas.flatMap(obterFaculdades)).size, 7)

    for (const rota of rotas) {
      assert.equal(rota.horarioSaida, saida)
      assert.equal(rota.horarioRetorno, retorno)
      assert.equal(rota.status, "Em operação")
      assert.deepEqual(buscarLinhas(linhas, rota.nome), [rota])
      for (const faculdade of obterFaculdades(rota)) {
        assert.deepEqual(buscarLinhas(linhas, `${origem} ${faculdade}`), [rota])
      }
    }
  })
}
