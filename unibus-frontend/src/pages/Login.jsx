import { Link } from "react-router-dom"
import "../styles/Login.css"

function Login() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Entrar</h1>

        <p className="login-subtitle">
          Acesse sua conta no UniBus
        </p>

        <form>
          <div className="login-field">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <p className="login-cadastro">
          Não tem cadastro?{" "}
          <Link to="/cadastro">
            Cadastre aqui
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login