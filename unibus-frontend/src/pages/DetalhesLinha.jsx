import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { unibusService } from "../services/unibusService"
import "./Linhas.css"

function DetalhesLinha() {
  const { id } = useParams()
  const [linha, setLinha] = useState(null)
  const [localizacao, setLocalizacao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    let ativo = true
    unibusService.getLinhaPorId(id)
      .then(({ data }) => { if (ativo) setLinha(data) })
      .catch((error) => {
        if (ativo) setErro(error.response?.status === 404
          ? "Essa linha não foi encontrada."
          : "Não foi possível carregar os dados da linha.")
      })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [id])

  useEffect(() => {
    let ativo = true
    const atualizarLocalizacao = () => {
      unibusService.getLocalizacaoPorLinha(id)
        .then(({ data }) => { if (ativo) setLocalizacao(data ?? null) })
        .catch(() => { if (ativo) setLocalizacao(null) })
    }
    atualizarLocalizacao()
    const intervalo = window.setInterval(atualizarLocalizacao, 10000)
    return () => {
      ativo = false
      window.clearInterval(intervalo)
    }
  }, [id])

  return (
    <main className="linhas-page">
      <p><Link to="/linhas">← Voltar para linhas</Link></p>
      {carregando && <p className="linhas-message">Carregando linha...</p>}
      {!carregando && erro && <p className="linhas-message linhas-error" role="alert">{erro}</p>}
      {!carregando && linha && (
        <article className="linha-card">
          <span className="linha-code">{linha.codigo || "Linha"}</span>
          <h1>{linha.nome}</h1>
          {linha.empresa && <p>Empresa: {linha.empresa}</p>}
          <span className={`linha-status ${linha.ativa === false ? "inativa" : "ativa"}`}>
            {linha.ativa === false ? "Inativa" : "Em operação"}
          </span>
          <section className="linha-gps" aria-live="polite">
            <h2>Localização do ônibus</h2>
            {localizacao ? (
              <>
                <p>Ônibus: {localizacao.onibus}</p>
                <p>Latitude: {localizacao.latitude} · Longitude: {localizacao.longitude}</p>
                <p><a href={`https://www.google.com/maps?q=${localizacao.latitude},${localizacao.longitude}`} target="_blank" rel="noreferrer">Abrir posição no mapa</a></p>
                <p>Atualizado em: {new Date(localizacao.dataHora).toLocaleString("pt-BR")}</p>
                <small>Posição gerada pelo simulador GPS.</small>
              </>
            ) : <p>Aguardando localização GPS para esta linha...</p>}
          </section>
        </article>
      )}
    </main>
  )
}

export default DetalhesLinha
