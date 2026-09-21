import { Link, NavLink } from "react-router-dom"
import "./Header.css"

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c0-3.5 2.6-6 6-6s6 2.5 6 6" />
    </svg>
  )
}

function Header() {
  return (
    <header className="unibus-header">
      <Link to="/" className="unibus-brand">
        <strong>
          Uni<span>Bus</span>
        </strong>

        <small>TRANSPORTE UNIVERSITÁRIO</small>
      </Link>

      <nav className="unibus-nav" aria-label="Navegação principal">
        <NavLink to="/" end>
          Início
        </NavLink>

        <NavLink to="/linhas">Linhas</NavLink>
      </nav>

      <div className="unibus-header-actions">
        <button
          type="button"
          className="unibus-profile-button"
          aria-label="Perfil"
        >
          <UserIcon />
        </button>

        <Link to="/linhas" className="unibus-enter-button">
          Entrar
        </Link>
      </div>
    </header>
  )
}

export default Header
