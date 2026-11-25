import { Link, useSearchParams } from "react-router-dom"
import Card from "../components/Card/Card"
import Button from "../components/Button/Button"
import Badge from "../components/Badge/Badge"
import FavoritosLinhas from "../components/FavoritosLinhas/FavoritosLinhas"
import useCatalogo from "../hooks/useCatalogo"
import useHorarios from "../hooks/useHorarios"
import { linkDetalhes } from "../services/catalogoService"
import {
  abreviarOrigem,
  buscarLinhas,
  formatarTrajeto,
  obterFaculdades,
  ordenarLinhasPorOrigem,
} from "../services/linhaService"
import "../styles/Linhas.css"

const LINHAS_POR_PAGINA = 10
function Linhas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { linhas: linhasAtuais, fonte, estado, erro, tentarNovamente } = useCatalogo(
    searchParams.get("fonte") === "local" ? "local" : "api", true
  )
  const linhasOrdenadas = ordenarLinhasPorOrigem(linhasAtuais)

  const busca = searchParams.get("busca") ?? ""
  const zonaSelecionada = searchParams.get("zona") ?? searchParams.get("cidade") ?? ""
  const campusSelecionado = searchParams.get("campus") ?? ""

  const zonas = [...new Set(linhasAtuais.map((linha) => linha.origem))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  )

  const campi = [
    ...new Set(linhasAtuais.flatMap((linha) => obterFaculdades(linha))),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"))

  let resultados = buscarLinhas(linhasOrdenadas, busca)

  if (zonaSelecionada) {
    resultados = resultados.filter(
      (linha) => linha.origem === zonaSelecionada
    )
  }

  if (campusSelecionado) {
    resultados = resultados.filter((linha) =>
      obterFaculdades(linha).includes(campusSelecionado)
    )
  }

  const totalPaginas = Math.max(
    1,
    Math.ceil(resultados.length / LINHAS_POR_PAGINA)
  )

  const paginaSolicitada = Number(searchParams.get("pagina"))

  const pagina = Number.isInteger(paginaSolicitada)
    ? Math.min(totalPaginas, Math.max(1, paginaSolicitada))
    : 1

  const inicio = (pagina - 1) * LINHAS_POR_PAGINA
  const linhasVisiveis = resultados.slice(
    inicio,
    inicio + LINHAS_POR_PAGINA
  )

  const horarios = useHorarios(linhasVisiveis.map(linha => linha.id), fonte)

  function linkPagina(numero) {
    const params = new URLSearchParams(searchParams)
    params.set("pagina", String(numero))
    return `/linhas?${params.toString()}`
  }

  function atualizarBusca(valor) {
    setSearchParams(
      (params) => {
        const proximosParams = new URLSearchParams(params)
        proximosParams.delete("pagina")

        if (valor) {
          proximosParams.set("busca", valor)
        } else {
          proximosParams.delete("busca")
        }

        return proximosParams
      },
      { replace: true }
    )
  }

  function atualizarFiltro(nome, valor) {
    setSearchParams(
      (params) => {
        const proximosParams = new URLSearchParams(params)
        proximosParams.delete("pagina")
        if (nome === "zona") proximosParams.delete("cidade")

        if (valor) {
          proximosParams.set(nome, valor)
        } else {
          proximosParams.delete(nome)
        }

        return proximosParams
      },
      { replace: true }
    )
  }

  return (
    <main className="linhas-page">
      {estado === "carregando" && <p className="linhas-feedback" role="status">Carregando linhas…</p>}
      {estado === "contingencia" && (
        <div className="linhas-feedback linhas-feedback-aviso" role="status">
          <span>Não foi possível carregar a API. Exibindo dados locais.</span>
          <Button onClick={tentarNovamente}>Tentar novamente</Button>
        </div>
      )}
      {estado === "sucesso" && <p className="linhas-feedback" role="status">Linhas atualizadas pela API.</p>}
      {linhasAtuais.some(linha => linha.demonstrativa) && <p className="linhas-feedback">Dados demonstrativos locais. Horários de segunda a sexta; confirme a operação com o motorista.</p>}
      {estado === "erro" && <div className="linhas-feedback" role="alert">{erro} <Button onClick={tentarNovamente}>Tentar novamente</Button></div>}
      {estado === "local" && <p className="linhas-feedback" role="status">Exibindo rotas demonstrativas locais.</p>}
      {horarios.temErro && <div className="linhas-feedback" role="alert">Não foi possível consultar os horários. {horarios.erro} <Button onClick={horarios.tentarNovamente}>Tentar novamente</Button></div>}
      <section className="linhas-heading">
        <p className="linhas-eyebrow">TRANSPORTE UNIVERSITÁRIO</p>
        <h1>Linhas de ônibus</h1>
        <p>Consulte as linhas disponíveis e encontre a opção para o seu trajeto.</p>
        <label className="linhas-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={busca}
            onChange={(event) => atualizarBusca(event.target.value)}
            placeholder="Busque por código, nome ou empresa"
            aria-label="Buscar linha por código, nome ou empresa"
          />
        </label>
      </section>

      <div className="linhas-intro">
        <h1>Linhas disponíveis</h1>
        <p>Encontre o transporte para sua faculdade.</p>
      </div>

      <FavoritosLinhas />

      <div
        className="linhas-search"
        role="search"
        aria-label="Buscar linhas"
      >
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

      <div
        className="linhas-filtros"
        aria-label="Filtros de linhas"
      >
        <select
          aria-label="Filtrar por zona"
          value={zonaSelecionada}
          onChange={(event) =>
            atualizarFiltro("zona", event.target.value)
          }
        >
          <option value="">Todas as zonas</option>
          {zonas.map((zona) => (
            <option key={zona} value={zona}>
              {zona}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por campus"
          value={campusSelecionado}
          onChange={(event) =>
            atualizarFiltro("campus", event.target.value)
          }
        >
          <option value="">Todos os campus</option>
          {campi.map((campus) => (
            <option key={campus} value={campus}>
              {campus}
            </option>
          ))}
        </select>
      </div>

      <p className="linhas-results" role="status">
        {resultados.length === 0
          ? "0 linhas encontradas"
          : `${inicio + 1}–${
              inicio + linhasVisiveis.length
            } de ${resultados.length} ${
              resultados.length === 1 ? "linha" : "linhas"
            }`}
      </p>

      {(estado === "carregando" || estado === "erro") ? null : resultados.length === 0 ? (
        <div className="linhas-empty">
          <h2>Nenhuma linha encontrada</h2>
          <p>Tente outra cidade ou nome de faculdade.</p>
          <Button
            onClick={() => {
              atualizarBusca("")
              atualizarFiltro("zona", "")
              atualizarFiltro("campus", "")
            }}
          >
            Limpar busca
          </Button>
        </div>
      ) : (
        <div className="linhas-grid">
          {linhasVisiveis.map((linha) => (
            <article
              className="linha-item"
              key={linha.id}
              aria-labelledby={`linha-${linha.id}`}
            >
              <Card>
                <div className="linha-summary">
                  <div className="linha-heading">
                    <h2
                      id={`linha-${linha.id}`}
                      aria-label={formatarTrajeto(linha)}
                    >
                      {abreviarOrigem(linha.origem) !== linha.origem ? (
                        <abbr title={linha.origem}>
                          {abreviarOrigem(linha.origem)}
                        </abbr>
                      ) : (
                        linha.origem
                      )}
                    </h2>

                    {linha.nome.startsWith("Rota ") && (
                      <Badge>
                        {linha.nome.match(/^Rota \d+/)?.[0]}
                      </Badge>
                    )}

                    <span className="linha-status">
                      {linha.status}
                    </span>
                  </div>

                  <p
                    className="linha-trajeto"
                    aria-label={`Faculdades atendidas: ${obterFaculdades(
                      linha
                    ).join(", ")}`}
                  >
                    {obterFaculdades(linha).join(" → ")}
                  </p>
                </div>

                <dl className="linha-metrics">
                  <div>
                    <dt>Saída{fonte === "api" ? " (hoje)" : ""}</dt>
                    <dd>
                      <span>{horarios.texto(linha, "horarioSaida")}</span>
                    </dd>
                  </div>

                  <div>
                    <dt>Retorno{fonte === "api" ? " (hoje)" : ""}</dt>
                    <dd>
                      <span>{horarios.texto(linha, "horarioRetorno")}</span>
                    </dd>
                  </div>
                </dl>

                <Link
                  className="linha-details"
                  to={linkDetalhes(linha.id, fonte)}
                  aria-label={`Ver detalhes da linha ${String(
                    linha.id
                  ).padStart(2, "0")}: ${formatarTrajeto(linha)}`}
                >
                  Ver detalhes <span aria-hidden="true">→</span>
                </Link>
              </Card>
            </article>
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <nav
          className="linhas-pagination"
          aria-label="Páginas de linhas"
        >
          {pagina > 1 ? (
            <Link to={linkPagina(pagina - 1)}>
              ← Anterior
            </Link>
          ) : (
            <span aria-disabled="true">← Anterior</span>
          )}

          <span aria-current="page">
            {pagina} / {totalPaginas}
          </span>

          {pagina < totalPaginas ? (
            <Link to={linkPagina(pagina + 1)}>
              Próxima →
            </Link>
          ) : (
            <span aria-disabled="true">Próxima →</span>
          )}
        </nav>
      )}
    </main>
  )
}

export default Linhas
