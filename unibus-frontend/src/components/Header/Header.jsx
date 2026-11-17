import { Link, NavLink, useNavigate } from "react-router-dom"
import logoUniBus from "../../assets/logo-unibus.png"
import { authService } from "../../services/authService"
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
  const navigate = useNavigate()
  const usuario = authService.getUsuario()

  function sair() {
    authService.logout()
    window.dispatchEvent(new Event("unibus-auth-change"))
    navigate("/login", { replace: true })
  }

  return (
    <header className="unibus-header">
      <Link to="/" className="unibus-brand">
        <img
          src={logoUniBus}
          alt="UniBus - Transporte Universitário"
          className="unibus-logo"
        />
      </Link>

      <nav className="unibus-nav" aria-label="Navegação principal">
        <NavLink to="/home" end>
          Início
        </NavLink>

        <NavLink to="/linhas">
          Linhas
        </NavLink>

        <NavLink to="/avisos">
          Avisos
        </NavLink>
      </nav>

      <div className="unibus-header-actions">
        <button
          type="button"
          className="unibus-profile-button"
          aria-label={usuario?.nome ? `Sair (${usuario.nome})` : "Sair"}
          onClick={sair}
        >
          <UserIcon />
        </button>
      </div>
    </header>
  )
}

export default Header
