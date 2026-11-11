import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoUniBus from "../assets/logo-unibus.png"
import { authService } from "../services/authService"
import "../styles/Cadastro.css"

function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function cadastrar(event) {
    event.preventDefault()

    setErro("")

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.")
      return
    }

    setCarregando(true)

    try {
      await authService.cadastrar({ nome, email, senha })
      setSucesso(true)
    } catch (error) {
      const dados = error.response?.data
      const mensagem = dados?.mensagem
        || dados?.message
        || Object.values(dados || {}).find((valor) => typeof valor === "string")

      if (error.response?.status === 409) {
        setErro(mensagem || "Este e-mail já está cadastrado.")
      } else if (error.response?.status === 400) {
        setErro(mensagem || "Confira seus dados. A senha deve ter ao menos 8 caracteres.")
      } else if (error.response) {
        setErro(mensagem || "Não foi possível criar o cadastro. Tente novamente.")
      } else {
        setErro("Não foi possível conectar ao servidor. Tente novamente em instantes.")
      }
    } finally {
      setCarregando(false)
    }
  }

  if (sucesso) {
    return (
      <main className="cadastro-page">
        <section className="cadastro-card cadastro-sucesso-card">

          <img
            src={logoUniBus}
            alt="UniBus - Transporte Universitário"
            className="cadastro-logo"
          />

          <div className="cadastro-sucesso-icon">
            ✓
          </div>

          <h1>Cadastro realizado!</h1>

          <p className="cadastro-sucesso-texto">
            Sua conta foi criada com sucesso.
          </p>

          <p className="cadastro-sucesso-redirecionamento">
            Sua conta já está pronta para ser usada.
          </p>

          <button
            type="button"
            className="cadastro-button"
            onClick={() => navigate("/login")}
          >
            Ir para o login
          </button>

        </section>
      </main>
    )
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card">

        <img
          src={logoUniBus}
          alt="UniBus - Transporte Universitário"
          className="cadastro-logo"
        />

        <h1>Criar cadastro</h1>

        <p className="cadastro-subtitle">
          Crie sua conta no UniBus
        </p>

        <form onSubmit={cadastrar}>
          <div className="cadastro-field">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </div>

          <div className="cadastro-field">
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

          <div className="cadastro-field">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              minLength={8}
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
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
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="cadastro-erro">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="cadastro-button"
            disabled={carregando}
          >
            {carregando ? "Criando..." : "Criar conta"}
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
