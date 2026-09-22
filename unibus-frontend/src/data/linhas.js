const faculdades = [
  "UFPE",
  "UNINASSAU",
  "UNICAP",
  "UNIBRA",
  "UFRPE",
  "IFPE",
  "ESTÁCIO",
]

const cidades = [
  { origem: "Goiana", horarioSaida: "17:00", horarioRetorno: "21:00" },
  { origem: "Condado", horarioSaida: "16:00", horarioRetorno: "21:30" },
  { origem: "Carpina", horarioSaida: "17:00", horarioRetorno: "21:50" },
  { origem: "Aliança", horarioSaida: "16:00", horarioRetorno: "21:30" },
  { origem: "Paudalho", horarioSaida: "17:00", horarioRetorno: "21:50" },
  { origem: "Limoeiro", horarioSaida: "16:00", horarioRetorno: "21:50" },
  { origem: "Vitória de Santo Antão", horarioSaida: "17:00", horarioRetorno: "21:50" },
  { origem: "Moreno", horarioSaida: "17:00", horarioRetorno: "21:50" },
  { origem: "Sirinhaém", horarioSaida: "16:00", horarioRetorno: "21:50" },
  { origem: "Itaquitinga", horarioSaida: "16:00", horarioRetorno: "21:30" },
]


export const linhas = cidades.flatMap((cidade, cidadeIndex) =>
  faculdades.map((faculdade, faculdadeIndex) => ({
    id: cidadeIndex * faculdades.length + faculdadeIndex + 1,
    ...cidade,
    faculdade,
    nome: `${cidade.origem} → ${faculdade}`,
    status: "Em operação",
  }))
)
