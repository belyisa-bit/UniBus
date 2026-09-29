import { Link } from "react-router-dom"
import "../styles/Cadastro.css"

function Cadastro() {
  return (
    <main className="cadastro-page">
      <section className="cadastro-card">
        <h1>Criar cadastro</h1>

        <p className="cadastro-subtitle">
          Crie sua conta no UniBus
        </p>

        <form>
          <div className="cadastro-field">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className="cadastro-field">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="cadastro-field">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div className="cadastro-field">
            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              type="password"
              placeholder="Confirme sua senha"
              required
            />
          </div>

          <button type="submit" className="cadastro-button">
            Criar conta
          </button>
        </form>

        <p className="cadastro-login">
          Já tem cadastro?{" "}
          <Link to="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Cadastro