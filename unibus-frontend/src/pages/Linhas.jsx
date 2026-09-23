import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { unibusService } from "../services/unibusService"
import "./Linhas.css"

function Linhas() {
  const [linhas, setLinhas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const busca = searchParams.get("busca") ?? ""

  useEffect(() => {
    let ativo = true

    unibusService.getLinhas()
      .then(({ data }) => {
        if (ativo) setLinhas(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar as linhas. Verifique se o servidor está disponível e tente novamente.")
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [])

  const linhasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR")
    return linhas.filter((linha) =>
      [linha.codigo, linha.nome, linha.empresa]
        .filter(Boolean)
        .some((valor) => valor.toLocaleLowerCase("pt-BR").includes(termo)),
    )
  }, [linhas, busca])

  function atualizarBusca(event) {
    const valor = event.target.value
    setSearchParams(valor ? { busca: valor } : {}, { replace: true })
  }

  return (
    <main className="linhas-page">
      <section className="linhas-heading">
        <p className="linhas-eyebrow">TRANSPORTE UNIVERSITÁRIO</p>
        <h1>Linhas de ônibus</h1>
        <p>Consulte as linhas disponíveis e encontre a opção para o seu trajeto.</p>
        <label className="linhas-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={busca}
            onChange={atualizarBusca}
            placeholder="Busque por código, nome ou empresa"
            aria-label="Buscar linha por código, nome ou empresa"
          />
        </label>
      </section>

      <section className="linhas-results" aria-live="polite">
        {carregando && <p className="linhas-message">Carregando linhas...</p>}
        {!carregando && erro && <p className="linhas-message linhas-error" role="alert">{erro}</p>}
        {!carregando && !erro && linhasFiltradas.length === 0 && (
          <p className="linhas-message">
            {linhas.length ? "Nenhuma linha corresponde à busca." : "Nenhuma linha cadastrada no momento."}
          </p>
        )}
        {!carregando && !erro && linhasFiltradas.length > 0 && (
          <div className="linhas-grid">
            {linhasFiltradas.map((linha) => (
              <Link className="linha-card" to={`/linhas/${linha.id}`} key={linha.id}>
                <span className="linha-code">{linha.codigo || "Linha"}</span>
                <h2>{linha.nome}</h2>
                {linha.empresa && <p>{linha.empresa}</p>}
                <span className={`linha-status ${linha.ativa === false ? "inativa" : "ativa"}`}>
                  {linha.ativa === false ? "Inativa" : "Em operação"}
                </span>
                <span className="linha-card-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Linhas
