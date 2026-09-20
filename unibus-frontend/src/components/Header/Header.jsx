import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        🚌 UNIBUS
      </div>

      <nav className="header-nav">
        <Link to="/">Início</Link>
        <Link to="/linhas">Linhas</Link>
      </nav>
    </header>
  );
}

export default Header;