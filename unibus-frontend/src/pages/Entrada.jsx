import { useNavigate } from "react-router-dom"
import heroImage from "../assets/hero-unibus.png"
import "../styles/Entrada.css"

function Entrada() {
  const navigate = useNavigate()

  return (
    <main className="entrada-page">
      <div className="entrada-background">
        <img
          src={heroImage}
          alt=""
          className="entrada-background-image"
        />
      </div>

      <div className="entrada-overlay" />

      <section className="entrada-content">
        <div className="entrada-brand">
          <span className="entrada-label">
            TRANSPORTE UNIVERSITÁRIO
          </span>

          <h1>
            Uni<span>Bus</span>
          </h1>

          <p>
            Seu transporte universitário,
            <br />
            simples e organizado.
          </p>
        </div>

        <div className="entrada-actions">
          <button
            type="button"
            className="entrada-button entrada-button-primary"
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>

          <button
            type="button"
            className="entrada-button entrada-button-secondary"
            onClick={() => navigate("/cadastro")}
          >
            Cadastrar
          </button>
        </div>
      </section>
    </main>
  )
}

export default Entrada