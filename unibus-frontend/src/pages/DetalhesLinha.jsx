import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import Badge from "../components/Badge/Badge"
import Card from "../components/Card/Card"
import MapaLinhaDemo from "../components/MapaLinhaDemo/MapaLinhaDemo"
import { linhas } from "../data/linhas"
import { obterFaculdades, obterPontosEmbarque, ordenarLinhasPorOrigem } from "../services/linhaService"
import "../styles/DetalhesLinha.css"

const linhasOrdenadas = ordenarLinhasPorOrigem(linhas)
const cidades = [...new Set(linhasOrdenadas.map((linha) => linha.origem))]

function DetalhesLinha() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const linha = linhas.find((item) => String(item.id) === id)
  const pontosEmbarque = linha ? obterPontosEmbarque(linha) : []
  const cidadeInformada = searchParams.get("cidade") ?? ""
  const cidade = linha?.origem ?? (cidades.includes(cidadeInformada) ? cidadeInformada : "")
  const rotasDaCidade = linhasOrdenadas.filter((item) => item.origem === cidade)

  function selecionarCidade(event) {
    const origem = event.target.value
    navigate(origem ? `/rotas?cidade=${encodeURIComponent(origem)}` : "/rotas")
  }

  function selecionarRota(event) {
    const rotaId = event.target.value
    navigate(rotaId ? `/linhas/${rotaId}` : `/rotas?cidade=${encodeURIComponent(cidade)}`)
  }

  if (id && !linha) {
    return (
      <main className="detalhes-linha-page">
        <Link className="detalhes-voltar" to="/linhas">← Ver linhas disponíveis</Link>
        <div className="detalhes-heading">
          <h1>Linha não encontrada</h1>
          <p>Escolha uma das linhas disponíveis para consultar os detalhes.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="detalhes-linha-page">
      <Link className="detalhes-voltar" to="/linhas">← Voltar para linhas</Link>

      <div className="detalhes-heading">
        <h1>Detalhes da linha</h1>
        <p>Selecione a cidade e a rota para conferir sua ida e volta.</p>
      </div>

      <section className="detalhes-selecao-painel" aria-labelledby="selecao-titulo">
        <div className="detalhes-selecao-heading">
          <h2 id="selecao-titulo">Escolha seu trajeto</h2>
          <p>Da sua cidade até a faculdade.</p>
        </div>
        <div className="detalhes-selecao">
          <div className="detalhes-campo">
            <label htmlFor="detalhes-cidade"><span className="detalhes-passo" aria-hidden="true">1</span> Cidade de origem</label>
            <select id="detalhes-cidade" value={cidade} onChange={selecionarCidade} aria-describedby="cidade-ajuda">
              <option value="">De onde você vai sair?</option>
              {cidades.map((origem) => <option key={origem} value={origem}>{origem}</option>)}
            </select>
            <p className="detalhes-campo-ajuda" id="cidade-ajuda">{cidades.length} cidades atendidas</p>
          </div>
          <div className="detalhes-campo">
            <label htmlFor="detalhes-rota"><span className="detalhes-passo" aria-hidden="true">2</span> Rota</label>
            <select
              id="detalhes-rota"
              value={linha ? String(linha.id) : ""}
              onChange={selecionarRota}
              disabled={!cidade}
              aria-describedby="rota-ajuda"
            >
              <option value="">{cidade ? "Escolha a rota da sua faculdade" : "Selecione uma cidade primeiro"}</option>
              {rotasDaCidade.map((rota) => (
                <option key={rota.id} value={rota.id}>
                  {rota.nome.match(/^Rota \d+/)?.[0] ?? "Linha direta"} — {obterFaculdades(rota).join(" → ")}
                </option>
              ))}
            </select>
            <p className="detalhes-campo-ajuda" id="rota-ajuda">
              {linha
                ? obterFaculdades(linha).join(" → ")
                : cidade
                  ? `${rotasDaCidade.length} ${rotasDaCidade.length === 1 ? "rota disponível" : "rotas disponíveis"} em ${cidade}`
                  : "As rotas aparecem após escolher a cidade."}
            </p>
          </div>
        </div>
      </section>

      {linha ? (
        <>
          <div className="detalhes-status" role="status">
            <span>{linha.nome.startsWith("Rota ") ? linha.nome : `Linha ${String(linha.id).padStart(2, "0")}`}</span>
            <Badge>{linha.status}</Badge>
          </div>

          <div className="detalhes-grid">
            <section className="detalhes-trajeto" aria-labelledby="trajeto-titulo">
              <Card>
                <h2 id="trajeto-titulo">Seu percurso</h2>
                <div className="detalhes-origem">
                  <span>Cidade de origem</span>
                  <strong>{linha.origem}</strong>
                </div>

                <div className="detalhes-etapa-heading">
                  <h3 id="embarque-titulo">Pontos de embarque</h3>
                  {pontosEmbarque.length > 0 && (
                    <span className="detalhes-contagem">{pontosEmbarque.length} {pontosEmbarque.length === 1 ? "ponto" : "pontos"}</span>
                  )}
                </div>
                {pontosEmbarque.length > 0 ? (
                  <ol className="detalhes-percurso detalhes-embarque" aria-labelledby="embarque-titulo">
                    {pontosEmbarque.map((ponto) => (
                      <li key={ponto}><strong>{ponto}</strong></li>
                    ))}
                  </ol>
                ) : (
                  <p className="detalhes-sem-pontos">Pontos de embarque ainda não cadastrados.</p>
                )}

                <div className="detalhes-etapa-heading detalhes-destinos-heading">
                  <h3 id="destinos-titulo">Faculdades atendidas</h3>
                </div>
                <div className="detalhes-destino">
                  <span>Cidade de destino</span>
                  <strong>Recife – PE</strong>
                </div>
                <ol className="detalhes-percurso detalhes-destinos" aria-labelledby="destinos-titulo">
                  {obterFaculdades(linha).map((faculdade) => (
                    <li key={faculdade}>
                      <strong>{faculdade}</strong>
                    </li>
                  ))}
                </ol>
                <div className="detalhes-retorno">
                  <h3>Embarque para retorno</h3>
                  <p>Confirme o ponto de embarque para retorno com o motorista.</p>
                </div>
              </Card>
            </section>

            <div className="detalhes-lateral">
              <section className="detalhes-horarios" aria-labelledby="horarios-titulo">
                <Card>
                  <h2 id="horarios-titulo">Horários</h2>
                  <dl className="detalhes-horarios-lista">
                    <div>
                      <dt>Saída</dt>
                      <dd><time dateTime={linha.horarioSaida}>{linha.horarioSaida}</time></dd>
                    </div>
                    <div>
                      <dt>Retorno</dt>
                      <dd><time dateTime={linha.horarioRetorno}>{linha.horarioRetorno}</time></dd>
                    </div>
                  </dl>
                </Card>
              </section>
              <MapaLinhaDemo rotaId={linha.id} />
            </div>
          </div>
        </>
      ) : (
        <p className="detalhes-orientacao" role="status">
          {cidade ? "Escolha uma rota para ver os pontos de embarque, as faculdades e os horários." : "Escolha sua cidade para consultar as rotas disponíveis."}
        </p>
      )}
    </main>
  )
}

export default DetalhesLinha
