const modeloRotas = [
  { idLocal: 2, numero: 1, faculdades: ["UNINASSAU (Graças)", "UNIBRA", "UNICAP", "ESTÁCIO (Abdias de Carvalho)"] },
  { idLocal: 1, numero: 2, faculdades: ["IFPE", "UFPE"] },
  { idLocal: 5, faculdades: ["UFRPE"] },
]

const cidades = [
  {
    origem: "Goiana",
    horarioSaida: "17:00",
    horarioRetorno: "21:00",
    rotas: [
      {
        id: 2,
        nome: "Rota 1 Goiana",
        faculdades: ["UNINASSAU (Graças)", "UNIBRA", "UNICAP", "ESTÁCIO (Abdias de Carvalho)"],
      },
      {
        id: 1,
        nome: "Rota 2 Goiana",
        faculdades: ["IFPE", "UFPE"],
      },
      { id: 5, nome: "Goiana → UFRPE", faculdades: ["UFRPE"] },
    ],
  },
  {
    origem: "Condado",
    horarioSaida: "16:00",
    horarioRetorno: "21:30",
    rotas: [
      {
        id: 9,
        nome: "Rota 1 Condado",
        faculdades: ["ESTÁCIO (Abdias de Carvalho)", "UNINASSAU (Graças)"],
      },
      {
        id: 12,
        nome: "Rota 2 Condado",
        faculdades: ["UFRPE", "UFPE", "IFPE"],
      },
      {
        id: 11,
        nome: "Rota 3 Condado",
        faculdades: ["UNIBRA"],
      },
    ],
  },
  {
    origem: "Carpina",
    horarioSaida: "17:00",
    horarioRetorno: "21:50",
    rotas: [
      {
        id: 18,
        nome: "Rota 1 Carpina",
        faculdades: ["UNIBRA", "UNICAP"],
      },
      {
        id: 16,
        nome: "Rota 2 Carpina",
        faculdades: ["UNINASSAU (Graças)", "ESTÁCIO (Abdias de Carvalho)"],
      },
      {
        id: 15,
        nome: "Rota 3 Carpina",
        faculdades: ["UFPE", "IFPE"],
      },
      { id: 19, nome: "Carpina → UFRPE", faculdades: ["UFRPE"] },
    ],
  },
  {
    origem: "Aliança",
    horarioSaida: "16:00",
    horarioRetorno: "21:30",
    rotas: [
      {
        id: 25,
        nome: "Rota 1 Aliança",
        faculdades: ["UNIBRA", "ESTÁCIO (Abdias de Carvalho)", "UNINASSAU (Graças)", "UNICAP"],
      },
      {
        id: 27,
        nome: "Rota 2 Aliança",
        faculdades: ["IFPE", "UFPE", "UFRPE"],
      },
    ],
  },
  { origem: "Paudalho", horarioSaida: "17:00", horarioRetorno: "21:50" },
  { origem: "Limoeiro", horarioSaida: "16:00", horarioRetorno: "21:50" },
  { origem: "Vitória de Santo Antão", horarioSaida: "17:00", horarioRetorno: "21:50" },
  { origem: "Moreno", horarioSaida: "17:00", horarioRetorno: "21:50" },
  { origem: "Sirinhaém", horarioSaida: "16:00", horarioRetorno: "21:50" },
  { origem: "Itaquitinga", horarioSaida: "16:00", horarioRetorno: "21:30" },
]


export const linhas = cidades.flatMap(({ rotas, ...cidade }, cidadeIndex) => {
  const rotasDaCidade = rotas ?? modeloRotas.map(({ idLocal, numero, faculdades }) => ({
    // Preserva os identificadores do cadastro original, que reservava sete IDs por cidade.
    id: cidadeIndex * 7 + idLocal,
    nome: numero ? `Rota ${numero} ${cidade.origem}` : `${cidade.origem} → UFRPE`,
    faculdades: [...faculdades],
  }))

  return rotasDaCidade.map((rota) => ({
    ...cidade,
    ...rota,
    status: "Em operação",
  }))
})
