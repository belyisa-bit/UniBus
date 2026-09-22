import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import heroImage from "../assets/hero-unibus.png"
import { linhas } from "../data/linhas"
import { obterFaculdades } from "../services/linhaService"
import { calcularMinutosAteSaida } from "../utils/horarios"
import "../styles/Home.css"

const chaveCidade = "unibus-cidade"
const cidadesDisponiveis = [...new Set(linhas.map((linha) => linha.origem))]
  .sort((a, b) => a.localeCompare(b, "pt-BR"))

function lerCidadeSalva() {
  try {
    const cidade = localStorage.getItem(chaveCidade)
    return cidadesDisponiveis.includes(cidade) ? cidade : ""
  } catch {
    return ""
  }
}

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3" width="14" height="16" rx="3" />
      <path d="M5 10h14" />
      <path d="M8 19v2M16 19v2" />
      <circle cx="8" cy="15" r="1" />
      <circle cx="16" cy="15" r="1" />
    </svg>
  )
}

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  )
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m2 9 10-5 10 5-10 5-10-5Z" />
      <path d="M6 11v6c3 3 9 3 12 0v-6M22 9v7" />
    </svg>
  )
}

function Home() {
  const [busca, setBusca] = useState("")
  const [agora, setAgora] = useState(() => new Date())
  const [cidade, setCidade] = useState(lerCidadeSalva)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => setAgora(new Date()), 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    try {
      if (cidade) {
        localStorage.setItem(chaveCidade, cidade)
      } else {
        localStorage.removeItem(chaveCidade)
      }
    } catch {
      // O filtro continua funcionando se o navegador bloquear o armazenamento.
    }
  }, [cidade])

  const proximosOnibus = linhas
    .filter((linha) => cidade && linha.origem === cidade)
    .map((linha) => ({
      ...linha,
      minutosRestantes: calcularMinutosAteSaida(linha.horarioSaida, agora),
    }))
    .sort((a, b) => a.minutosRestantes - b.minutosRestantes || a.id - b.id)
    .slice(0, 2)

  function pesquisarLinha(event) {
    event.preventDefault()

    const termo = busca.trim()

    if (termo) {
      navigate(`/linhas?busca=${encodeURIComponent(termo)}`)
    } else {
      navigate("/linhas")
    }
  }

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">
            TRANSPORTE UNIVERSITÁRIO
          </span>

          <h1>
            Uni<span>Bus</span>
          </h1>

          <h2>Encontre sua linha.</h2>

          <form className="search-box" onSubmit={pesquisarLinha}>
            <span className="search-icon" aria-hidden="true">⌕</span>

            <input
              type="text"
              aria-label="Para onde você vai?"
              placeholder="Para onde você vai?"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />

            <button type="submit" aria-label="Pesquisar">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 12h16M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>

        <div className="hero-image-area">
          <img
            src={heroImage}
            alt="Ônibus UniBus e rota universitária"
            className="hero-image"
          />
        </div>
      </section>

      <section className="features">
        <Link to="/linhas" className="feature-card green-card">
          <div className="feature-icon green-icon">
            <BusIcon />
          </div>

          <h3>Consulte linhas</h3>

          <p>Veja todas as linhas disponíveis.</p>

          <span className="feature-arrow">›</span>
        </Link>

        <Link to="/rotas" className="feature-card blue-card">
          <div className="feature-icon blue-icon">
            <RouteIcon />
          </div>

          <h3>Confira rotas</h3>

          <p>Saiba por onde cada linha passa.</p>

          <span className="feature-arrow">›</span>
        </Link>

        <Link to="/faculdades" className="feature-card green-card">
          <div className="feature-icon green-icon">
            <GraduationCapIcon />
          </div>

          <h3>Faculdades atendidas</h3>

          <p>Veja quais instituições possuem linhas disponíveis no UniBus.</p>

          <span className="feature-arrow" aria-hidden="true">›</span>
        </Link>
      </section>

      <section id="horarios" className="next-section">
        <div className="section-heading">
          <div className="home-next-heading">
            <h2>Próximos ônibus</h2>
            <p className="home-next-destination">Destino: Recife – PE</p>
          </div>

          <div className="home-city-filter">
            <label htmlFor="cidade-origem">Sua cidade</label>
            <select
              id="cidade-origem"
              value={cidade}
              onChange={(event) => {
                setCidade(event.target.value)
                setAgora(new Date())
              }}
            >
              <option value="">Selecione sua cidade</option>
              {cidadesDisponiveis.map((origem) => (
                <option key={origem} value={origem}>{origem}</option>
              ))}
            </select>
          </div>

          <Link to="/linhas">
            Ver todos →
          </Link>
        </div>

        <div className="next-list">
          {proximosOnibus.length === 0 && (
            <p className="home-city-message" role="status">
              {cidade
                ? "Nenhum ônibus disponível para esta cidade."
                : "Selecione sua cidade para ver os próximos ônibus."}
            </p>
          )}
          {proximosOnibus.map((linha, index) => (
            <Link key={linha.id} to={`/linhas/${linha.id}`} className="bus-row">
              <span className={`line-icon ${index === 0 ? "line-icon-green" : "line-icon-blue"}`}>
                <BusIcon />
              </span>

              <div className="route-info">
                <strong>{obterFaculdades(linha).join(" → ")}</strong>

                <span>
                  {linha.minutosRestantes > 0 && "Próximo em: "}
                  <b>{linha.minutosRestantes === 0 ? "Agora" : `${linha.minutosRestantes} min`}</b>
                </span>
              </div>

              <span className="row-arrow">›</span>
            </Link>
          ))}
        </div>
      </section>

      <footer id="sobre" className="home-footer">
        <div className="footer-brand">
          <strong>Uni<span>Bus</span></strong>
          <small>TRANSPORTE UNIVERSITÁRIO</small>
        </div>

        <p className="footer-description">
          O UniBus conecta estudantes ao transporte universitário de forma mais simples e organizada,
          reunindo informações sobre linhas, horários de saída e retorno, pontos, rotas e status do transporte
          para facilitar o planejamento da ida e volta à faculdade.
          
        </p>
        <p className="footer-copyright">
          © 2026 UniBus — Projeto acadêmico. Código sob licença MIT.
        </p>
      </footer>
    </main>
  )
}

export default Home
