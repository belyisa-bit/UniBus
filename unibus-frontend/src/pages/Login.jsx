import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoUniBus from "../assets/logo-unibus.png"
import "../styles/Login.css"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function entrar(event) {
    event.preventDefault()

    setErro("")
    setCarregando(true)

    try {
      const resposta = await fetch(
        "https://unibus-backend-55sx.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        }
      )

      if (!resposta.ok) {
        setErro("E-mail ou senha inválidos.")
        return
      }

      setSucesso(true)

    } catch {
      setErro("Não foi possível conectar ao servidor.")
    } finally {
      setCarregando(false)
    }
  }

  if (sucesso) {
    return (
      <main className="login-page">
        <section className="login-card login-sucesso-card">

          <img
            src={logoUniBus}
            alt="UniBus - Transporte Universitário"
            className="login-logo"
          />

          <div className="login-sucesso-icon">
            ✓
          </div>

          <h1>Login realizado!</h1>

          <p className="login-sucesso-texto">
            Você entrou na sua conta com sucesso.
          </p>

          <p className="login-sucesso-redirecionamento">
            Você já está conectado à sua conta.
          </p>

          <button
            type="button"
            className="login-button"
            onClick={() => navigate("/home")}
          >
            Ir para o UniBus
          </button>

        </section>
      </main>
    )
  }

  return (
    <main className="login-page">
      <section className="login-card">

        <img
          src={logoUniBus}
          alt="UniBus - Transporte Universitário"
          className="login-logo"
        />

        <h1>Entrar</h1>

        <p className="login-subtitle">
          Acesse sua conta no UniBus
        </p>

        <form onSubmit={entrar}>
          <div className="login-field">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="login-erro">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
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