import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { unibusService } from "../services/unibusService"
import MapaLinhaDemo from "../components/MapaLinhaDemo/MapaLinhaDemo"
import "./Linhas.css"

function DetalhesLinha() {
  const { id } = useParams()
  const [linha, setLinha] = useState(null)
  const [localizacao, setLocalizacao] = useState(null)
  const [gpsStatus, setGpsStatus] = useState("aguardando")
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
      setGpsStatus("atualizando")
      unibusService.getLocalizacaoPorLinha(id)
        .then(({ data }) => {
          if (!ativo) return
          setLocalizacao(data ?? null)
          setGpsStatus(data ? "conectado" : "aguardando")
        })
        .catch(() => {
          if (!ativo) return
          setGpsStatus("offline")
        })
    }
    atualizarLocalizacao()
    const intervalo = window.setInterval(atualizarLocalizacao, 5000)
    return () => {
      ativo = false
      window.clearInterval(intervalo)
    }
  }, [id])

  const leituraAtualizada = localizacao?.dataHora
    ? new Date(localizacao.dataHora)
    : null
  const leituraExpirada = leituraAtualizada
    ? Date.now() - leituraAtualizada.getTime() > 30000
    : false

  function textoStatusGps() {
    if (leituraExpirada) return "Última posição desatualizada"
    if (gpsStatus === "conectado") return "GPS ao vivo conectado"
    if (gpsStatus === "atualizando") return "Atualizando posição..."
    if (gpsStatus === "offline") return "Sem conexão com o GPS"
    return "Aguardando sinal GPS..."
  }

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
            <div className="linha-gps-heading">
              <div>
                <p className="linha-gps-eyebrow">RASTREAMENTO EM TEMPO REAL</p>
                <h2>Localização do ônibus</h2>
              </div>
              <span className={`gps-indicator gps-${leituraExpirada ? "stale" : gpsStatus}`}>
                <span aria-hidden="true" />
                {textoStatusGps()}
              </span>
            </div>
            {localizacao ? (
              <>
                <div className="gps-reading">
                  <p><strong>{localizacao.onibus || "Ônibus em circulação"}</strong></p>
                  <p>Latitude {localizacao.latitude} · Longitude {localizacao.longitude}</p>
                  <p>Última leitura: {leituraAtualizada?.toLocaleTimeString("pt-BR")}</p>
                </div>
              </>
            ) : <p>Aguardando localização GPS para esta linha. O mapa aparecerá assim que chegar a primeira leitura.</p>}
            <MapaLinhaDemo linha={linha} localizacao={localizacao} />
          </section>
        </article>
      )}
    </main>
  )
}

export default DetalhesLinha
