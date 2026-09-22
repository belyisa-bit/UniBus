import { useState } from "react"
import { Link } from "react-router-dom"
import { linhas } from "../data/linhas"
import "../styles/Faculdades.css"

const faculdades = [...new Set(linhas.map((linha) => linha.faculdade))].map(
  (nome) => ({
    nome,
    cidades: [...new Set(linhas
      .filter((linha) => linha.faculdade === nome)
      .map((linha) => linha.origem))],
    // A página de linhas ainda não oferece filtro por instituição.
    destinoLinhas: "/linhas",
  })
)

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function Faculdades() {
  const [busca, setBusca] = useState("")
  const termo = normalizar(busca.trim())
  const resultados = faculdades.filter((faculdade) =>
    normalizar(faculdade.nome).includes(termo)
  )

  return (
    <main className="faculdades-page">
      <div className="faculdades-heading">
        <h1>Faculdades atendidas</h1>
        <p>Encontre sua instituição e veja quais cidades possuem transporte disponível.</p>
      </div>

      <div className="faculdades-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          id="busca-faculdade"
          type="search"
          aria-label="Buscar faculdade"
          placeholder="Buscar faculdade..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      <p className="faculdades-results" role="status">
        {resultados.length === 1 ? "1 instituição encontrada" : `${resultados.length} instituições encontradas`}
      </p>

      {resultados.length === 0 ? (
        <div className="faculdades-empty">
          <h2>Nenhuma instituição encontrada</h2>
          <p>Tente outro nome ou sigla de faculdade.</p>
          <button type="button" onClick={() => setBusca("")}>Limpar busca</button>
        </div>
      ) : (
        <div className="faculdades-grid">
          {resultados.map((faculdade) => (
            <article className="faculdade-card" key={faculdade.nome}>
              <div className="faculdade-title">
                <span className="faculdade-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m2 9 10-5 10 5-10 5-10-5Z" />
                    <path d="M6 11v6c3 3 9 3 12 0v-6M22 9v7" />
                  </svg>
                </span>
                <h2>{faculdade.nome}</h2>
              </div>
              <p className="faculdade-count">
                {faculdade.cidades.length === 1 ? "1 cidade atendida" : `${faculdade.cidades.length} cidades atendidas`}
              </p>
              <ul className="faculdade-cidades" aria-label={`Cidades atendidas por ${faculdade.nome}`}>
                {faculdade.cidades.slice(0, 3).map((cidade) => (
                  <li key={cidade}>{cidade}</li>
                ))}
              </ul>
              {faculdade.cidades.length > 3 && (
                <p className="faculdade-more">
                  + {faculdade.cidades.length - 3} {faculdade.cidades.length === 4 ? "cidade" : "cidades"}
                </p>
              )}
              <Link
                to={faculdade.destinoLinhas}
                className="faculdade-link"
                aria-label={`Ver linhas para ${faculdade.nome}`}
              >
                Ver linhas <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Faculdades
