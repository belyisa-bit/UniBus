export function calcularMinutosAteSaida(horarioSaida, agora) {
  const [horas, minutos] = horarioSaida.split(":").map(Number)
  const minutoAtual = new Date(agora)
  minutoAtual.setSeconds(0, 0)

  const proximaSaida = new Date(minutoAtual)
  proximaSaida.setHours(horas, minutos, 0, 0)

  // A saída permanece como "Agora" durante o minuto programado.
  if (proximaSaida < minutoAtual) {
    proximaSaida.setDate(proximaSaida.getDate() + 1)
  }

  return Math.ceil((proximaSaida - minutoAtual) / 60000)
}
