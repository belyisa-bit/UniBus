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

  return (
    <main className="avisos-page">
      <h1 className="avisos-titulo">Avisos</h1>

      <p className="avisos-subtitulo">
        Envie um aviso sobre uma linha de transporte.
      </p>

      <form className="aviso-form" onSubmit={enviarAviso}>
        <div className="aviso-campo">
          <label htmlFor="linha">Linha</label>

          <select
            id="linha"
            value={linha}
            onChange={(event) => setLinha(event.target.value)}
            required
          >
            <option value="">Selecione a linha</option>

            {linhas.map((item) => (
              <option key={item.id} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="aviso-campo">
          <label htmlFor="tipo">Tipo do aviso</label>

          <select
            id="tipo"
            value={tipo}
            onChange={(event) => setTipo(event.target.value)}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="ATRASO">Atraso</option>
            <option value="LOTADO">Lotado</option>
            <option value="PASSOU_AGORA">Passou agora</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

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