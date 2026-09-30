import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoUniBus from "../assets/logo-unibus.png"
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
      const resposta = await fetch("http://localhost:8081/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      })

      if (!resposta.ok) {
        if (resposta.status === 400) {
          const dados = await resposta.json().catch(() => null)

          if (dados?.mensagem) {
            setErro(dados.mensagem)
          } else {
            setErro("Não foi possível criar o cadastro.")
          }
        } else {
          setErro("Não foi possível criar o cadastro.")
        }

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