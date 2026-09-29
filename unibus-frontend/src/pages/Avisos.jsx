import { useEffect, useState } from "react"
import {
  lerAvisosSalvos,
  adicionarAviso,
} from "../services/avisoService"
import { linhas } from "../data/linhas"
import "../styles/Avisos.css"

function Avisos() {
  const [avisos, setAvisos] = useState([])
  const [linha, setLinha] = useState("")
  const [tipo, setTipo] = useState("")
  const [descricao, setDescricao] = useState("")

  useEffect(() => {
    setAvisos(lerAvisosSalvos())
  }, [])

  function enviarAviso(event) {
    event.preventDefault()

    if (!linha || !tipo) {
      return
    }

    const novoAviso = adicionarAviso({
      linha,
      tipo,
      descricao,
    })

    setAvisos((avisosAtuais) => [novoAviso, ...avisosAtuais])

    setLinha("")
    setTipo("")
    setDescricao("")
  }

  function selecionarOpcao(event, setter) {
    setter(event.currentTarget.value)
    event.currentTarget.closest("details").open = false
  }

  function SeletorAviso({ id, label, value, placeholder, options, onChange }) {
    const textoSelecionado = options.find((option) => option.value === value)?.label

    return (
      <div className="aviso-campo">
        <label id={`${id}-label`}>{label}</label>

        <details className="aviso-seletor">
          <summary aria-labelledby={`${id}-label`}>
            <span className={value ? "" : "aviso-seletor-placeholder"}>
              {textoSelecionado || placeholder}
            </span>
          </summary>

          <div className="aviso-opcoes" role="listbox" aria-labelledby={`${id}-label`}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                value={option.value}
                className={option.value === value ? "selecionado" : ""}
                onClick={onChange}
              >
                {option.label}
              </button>
            ))}
          </div>
        </details>
      </div>
    )
  }

  return (
    <main className="avisos-page">
      <h1 className="avisos-titulo">Avisos</h1>

      <p className="avisos-subtitulo">
        Envie um aviso sobre uma linha de transporte.
      </p>

      <form className="aviso-form" onSubmit={enviarAviso}>
        <SeletorAviso
          id="linha"
          label="Linha"
          value={linha}
          placeholder="Selecione a linha"
          options={linhas.map((item) => ({ value: item.nome, label: item.nome }))}
          onChange={(event) => selecionarOpcao(event, setLinha)}
        />

        <SeletorAviso
          id="tipo"
          label="Tipo do aviso"
          value={tipo}
          placeholder="Selecione o tipo"
          options={[
            { value: "ATRASO", label: "Atraso" },
            { value: "LOTADO", label: "Lotado" },
            { value: "PASSOU_AGORA", label: "Passou agora" },
            { value: "CANCELADO", label: "Cancelado" },
          ]}
          onChange={(event) => selecionarOpcao(event, setTipo)}
        />

        <div className="aviso-campo">
          <label htmlFor="descricao">Descrição</label>

          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Digite os detalhes do aviso"
          />
        </div>

        <button className="aviso-botao" type="submit">
          Enviar aviso
        </button>
      </form>

      <section className="avisos-enviados">
        <h2>Avisos enviados</h2>

        {avisos.length === 0 ? (
          <p>Nenhum aviso enviado.</p>
        ) : (
          avisos.map((aviso) => (
            <article className="aviso-card" key={aviso.id}>
              <h3>{aviso.tipo}</h3>

              <p>{aviso.descricao || "Sem descrição."}</p>

              <small>
                Linha: {aviso.linha}
              </small>

              <br />

              <small>
                {new Date(aviso.dataHora).toLocaleString("pt-BR")}
              </small>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

export default Avisos