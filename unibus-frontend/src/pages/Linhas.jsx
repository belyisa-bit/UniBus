import { Link, useSearchParams } from "react-router-dom"
import Card from "../components/Card/Card"
import Button from "../components/Button/Button"
import Badge from "../components/Badge/Badge"
import FavoritosLinhas from "../components/FavoritosLinhas/FavoritosLinhas"
import { linhas } from "../data/linhas"
import {
  abreviarOrigem,
  buscarLinhas,
  formatarTrajeto,
  obterFaculdades,
  ordenarLinhasPorOrigem,
} from "../services/linhaService"
import "../styles/Linhas.css"

const LINHAS_POR_PAGINA = 10
const linhasOrdenadas = ordenarLinhasPorOrigem(linhas)

function Linhas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const busca = searchParams.get("busca") ?? ""
  const resultados = buscarLinhas(linhasOrdenadas, busca)
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / LINHAS_POR_PAGINA))
  const paginaSolicitada = Number(searchParams.get("pagina"))
  const pagina = Number.isInteger(paginaSolicitada)
    ? Math.min(totalPaginas, Math.max(1, paginaSolicitada))
    : 1
  const inicio = (pagina - 1) * LINHAS_POR_PAGINA
  const linhasVisiveis = resultados.slice(inicio, inicio + LINHAS_POR_PAGINA)

  function linkPagina(numero) {
    const params = new URLSearchParams(searchParams)
    params.set("pagina", String(numero))
    return `/linhas?${params.toString()}`
  }

  function atualizarBusca(valor) {
    setSearchParams((params) => {
      const proximosParams = new URLSearchParams(params)
      proximosParams.delete("pagina")
      if (valor) {
        proximosParams.set("busca", valor)
      } else {
        proximosParams.delete("busca")
      }
      return proximosParams
    }, { replace: true })
  }

  return (
    <main className="linhas-page">
      <div className="linhas-intro">
        <h1>Linhas disponíveis</h1>
        <p>Encontre o transporte para sua faculdade.</p>
      </div>

      <FavoritosLinhas />

      <div className="linhas-search" role="search" aria-label="Buscar linhas">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          type="search"
          aria-label="Buscar linha, cidade ou faculdade"
          placeholder="Buscar linha, cidade ou faculdade..."
          value={busca}
          onChange={(event) => atualizarBusca(event.target.value)}
        />
      </div>

      <p className="linhas-results" role="status">
        {resultados.length === 0
          ? "0 linhas encontradas"
          : `${inicio + 1}–${inicio + linhasVisiveis.length} de ${resultados.length} ${resultados.length === 1 ? "linha" : "linhas"}`}
      </p>

      {resultados.length === 0 ? (
        <div className="linhas-empty">
          <h2>Nenhuma linha encontrada</h2>
          <p>Tente outra cidade ou nome de faculdade.</p>
          <Button onClick={() => atualizarBusca("")}>Limpar busca</Button>
        </div>
      ) : (
        <div className="linhas-grid">
          {linhasVisiveis.map((linha) => (
            <article className="linha-item" key={linha.id} aria-labelledby={`linha-${linha.id}`}>
              <Card>
                <div className="linha-summary">
                  <div className="linha-heading">
                    <h2 id={`linha-${linha.id}`} aria-label={formatarTrajeto(linha)}>
                      {abreviarOrigem(linha.origem) !== linha.origem ? (
                        <abbr title={linha.origem}>{abreviarOrigem(linha.origem)}</abbr>
                      ) : linha.origem}
                    </h2>
                    {linha.nome.startsWith("Rota ") && (
                      <Badge>{linha.nome.match(/^Rota \d+/)?.[0]}</Badge>
                    )}
                    <span className="linha-status">{linha.status}</span>
                  </div>
                  <p className="linha-trajeto" aria-label={`Faculdades atendidas: ${obterFaculdades(linha).join(", ")}`}>
                    {obterFaculdades(linha).join(" → ")}
                  </p>
                </div>
                <dl className="linha-metrics">
                  <div>
                    <dt>Saída</dt>
                    <dd><time dateTime={linha.horarioSaida}>{linha.horarioSaida}</time></dd>
                  </div>
                  <div>
                    <dt>Retorno</dt>
                    <dd><time dateTime={linha.horarioRetorno}>{linha.horarioRetorno}</time></dd>
                  </div>
                </dl>
                <Link
                  className="linha-details"
                  to={`/linhas/${linha.id}`}
                  aria-label={`Ver detalhes da linha ${String(linha.id).padStart(2, "0")}: ${formatarTrajeto(linha)}`}
                >
                  Ver detalhes <span aria-hidden="true">→</span>
                </Link>
              </Card>
            </article>
          ))}
        </div>
      )}
      {totalPaginas > 1 && (
        <nav className="linhas-pagination" aria-label="Páginas de linhas">
          {pagina > 1 ? (
            <Link to={linkPagina(pagina - 1)}>← Anterior</Link>
          ) : <span aria-disabled="true">← Anterior</span>}
          <span aria-current="page">{pagina} / {totalPaginas}</span>
          {pagina < totalPaginas ? (
            <Link to={linkPagina(pagina + 1)}>Próxima →</Link>
          ) : <span aria-disabled="true">Próxima →</span>}
        </nav>
      )}
    </main>
  )
}

export default Linhas
