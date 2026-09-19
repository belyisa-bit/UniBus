import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import heroImage from "../assets/hero-unibus.png"
import "../styles/Home.css"

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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c0-3.5 2.6-6 6-6s6 2.5 6 6" />
    </svg>
  )
}

function Home() {
  const [busca, setBusca] = useState("")
  const navigate = useNavigate()
  const sobreDialog = useRef(null)

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
      <header className="home-header">
        <Link to="/" className="brand">
          <strong>
            Uni<span>Bus</span>
          </strong>

          <small>TRANSPORTE UNIVERSITÁRIO</small>
        </Link>

        <nav className="home-nav" aria-label="Navegação principal">
          <Link to="/" className="active" aria-current="page">
            Início
          </Link>

          <Link to="/linhas">Linhas</Link>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="profile-button"
            aria-label="Perfil"
          >
            <UserIcon />
          </button>

          <Link to="/linhas" className="enter-button">
            Entrar
          </Link>
        </div>
      </header>

      <dialog
        ref={sobreDialog}
        id="sobre-unibus"
        className="about-dialog"
        aria-labelledby="sobre-titulo"
      >
        <div className="about-heading">
          <h2 id="sobre-titulo">Sobre o Uni<span>Bus</span></h2>
          <form method="dialog">
            <button type="submit" className="about-close" aria-label="Fechar sobre o UniBus">
              ×
            </button>
          </form>
        </div>
        <p>
          O UniBus é um sistema de transporte universitário pensado para
          facilitar o caminho entre você e a universidade.
        </p>
        <p>
          Consulte as linhas disponíveis, conheça as rotas e confira os
          horários para planejar seus deslocamentos com mais praticidade.
        </p>
        <p className="about-message">
          Universidade hoje. Grandes caminhos amanhã.
        </p>
      </dialog>

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

        <Link to="/linhas" className="feature-card blue-card">
          <div className="feature-icon blue-icon">
            <RouteIcon />
          </div>

          <h3>Confira rotas</h3>

          <p>Saiba por onde cada linha passa.</p>

          <span className="feature-arrow">›</span>
        </Link>

        <Link to="/linhas" className="feature-card green-card">
          <div className="feature-icon green-icon">
            <ClockIcon />
          </div>

          <h3>Acompanhe horários</h3>

          <p>Veja os próximos ônibus.</p>

          <span className="feature-arrow">›</span>
        </Link>
      </section>

      <section id="horarios" className="next-section">
        <div className="section-heading">
          <h2>Próximos ônibus</h2>

          <Link to="/linhas">
            Ver todos →
          </Link>
        </div>

        <div className="next-list">
          <Link to="/linhas/1" className="bus-row">
            <span className="line-number green-number">
              01
            </span>

            <div className="route-info">
              <strong>Carpina → UNINASSAU</strong>

              <span>
                Próximo em: <b>10 min</b>
              </span>
            </div>

            <BusIcon />

            <span className="row-arrow">›</span>
          </Link>

          <Link to="/linhas/2" className="bus-row">
            <span className="line-number blue-number">
              02
            </span>

            <div className="route-info">
              <strong>UNINASSAU → Carpina</strong>

              <span>
                Próximo em: <b>22 min</b>
              </span>
            </div>

            <BusIcon />

            <span className="row-arrow">›</span>
          </Link>
        </div>
      </section>

      <footer id="sobre" className="home-footer">
        <div className="footer-brand">
          <strong>Uni<span>Bus</span></strong>
          <small>TRANSPORTE UNIVERSITÁRIO</small>
        </div>

        <p className="footer-description">
          O UniBus foi criado para facilitar a rotina de estudantes que dependem
          do transporte universitário. Em um só lugar, é possível consultar linhas,
          horários, pontos, rotas e o status do transporte, evitando informações
          espalhadas em grupos e mensagens. Assim, os alunos conseguem se organizar
          melhor, enquanto motoristas e administradores têm mais clareza sobre a
          operação das linhas.
        </p>
      </footer>
    </main>
  )
}

export default Home
