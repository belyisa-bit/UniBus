import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { linhas } from "../../data/linhas"
import { obterFaculdades, ordenarLinhasPorOrigem } from "../../services/linhaService"
import useFavoritos from "../../hooks/useFavoritos"
import "./FavoritosLinhas.css"

const linhasOrdenadas = ordenarLinhasPorOrigem(linhas)
const cidades = [...new Set(linhasOrdenadas.map((linha) => linha.origem))]

export default function FavoritosLinhas() {
  const { favoritos, aviso, adicionarFavorito, removerFavorito } = useFavoritos()
  const [cidade, setCidade] = useState("")
  const [rotaId, setRotaId] = useState("")
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState("")
  const cidadeRef = useRef(null)
  const rotaRef = useRef(null)
  const tituloRef = useRef(null)
  const rotas = linhasOrdenadas.filter((linha) => linha.origem === cidade)

  function adicionar(event) {
    event.preventDefault()
    const linha = rotas.find((item) => String(item.id) === rotaId)
    const errosAtuais = {}
    if (!cidades.includes(cidade)) errosAtuais.cidade = "Selecione sua cidade de origem."
    if (!linha) errosAtuais.rota = "Selecione uma rota da cidade escolhida."
    setErros(errosAtuais)
    setMensagem("")
    if (Object.keys(errosAtuais).length) {
      if (errosAtuais.cidade) cidadeRef.current.focus()
      else rotaRef.current.focus()
      return
    }
    const resultado = adicionarFavorito(linha)
    if (resultado.status === "duplicado") {
      setMensagem("Esta linha já está nos seus favoritos.")
    } else if (resultado.status === "sucesso") {
      setMensagem(`${linha.nome} adicionada aos favoritos.${resultado.persistido ? " Salva neste navegador." : ""}`)
    } else {
      setErros({ rota: "Esta rota não está disponível. Escolha outra." })
      rotaRef.current.focus()
    }
  }

  function remover(linha) {
    const resultado = removerFavorito(linha.id)
    setMensagem(`${linha.nome} removida dos favoritos.${resultado.persistido ? " Alteração salva neste navegador." : ""}`)
    tituloRef.current.focus()
  }

  return (
    <section className="linhas-favoritos" aria-labelledby="favoritos-titulo">
      <h2 id="favoritos-titulo" ref={tituloRef} tabIndex={-1}>Minhas linhas favoritas</h2>
      <p className="favoritos-descricao">Salve as linhas que você usa para encontrá-las mais rápido neste navegador.</p>
      <form className="favoritos-form" onSubmit={adicionar} noValidate>
        <div className="favoritos-campo">
          <label htmlFor="favoritos-cidade">Cidade de origem (obrigatório)</label>
          <select id="favoritos-cidade" ref={cidadeRef} value={cidade} required
            aria-invalid={Boolean(erros.cidade)} aria-describedby={erros.cidade ? "favoritos-cidade-erro" : undefined}
            onChange={(event) => {
              setCidade(event.target.value)
              setRotaId("")
              setErros({})
              setMensagem("")
            }}>
            <option value="">Selecione sua cidade</option>
            {cidades.map((origem) => <option key={origem} value={origem}>{origem}</option>)}
          </select>
          {erros.cidade && <p className="favoritos-erro" id="favoritos-cidade-erro" role="alert">{erros.cidade}</p>}
        </div>
        <div className="favoritos-campo">
          <label htmlFor="favoritos-rota">Rota (obrigatório)</label>
          <select id="favoritos-rota" ref={rotaRef} value={rotaId} required disabled={!cidade}
            aria-invalid={Boolean(erros.rota)} aria-describedby={erros.rota ? "favoritos-rota-erro" : undefined}
            onChange={(event) => {
              setRotaId(event.target.value)
              setErros({})
              setMensagem("")
            }}>
            <option value="">{cidade ? "Selecione sua rota" : "Escolha a cidade primeiro"}</option>
            {rotas.map((linha) => <option key={linha.id} value={linha.id}>{linha.nome} — {obterFaculdades(linha).join(" → ")}</option>)}
          </select>
          {erros.rota && <p className="favoritos-erro" id="favoritos-rota-erro" role="alert">{erros.rota}</p>}
        </div>
        <button className="favoritos-adicionar" type="submit">Adicionar aos favoritos</button>
      </form>
      <p className="favoritos-feedback" role="status" aria-atomic="true">{mensagem}</p>
      {aviso && <p className="favoritos-erro" role="alert">{aviso}</p>}
      {favoritos.length === 0 ? (
        <p className="favoritos-vazio">Você ainda não tem linhas favoritas. Escolha uma cidade e uma rota para começar.</p>
      ) : (
        <ul className="favoritos-lista">
          {favoritos.map((linha) => (
            <li key={linha.id}>
              <div className="favoritos-info">
                <Link to={`/linhas/${linha.id}`} aria-label={`Ver detalhes de ${linha.nome}`}>{linha.nome}</Link>
                <p>{obterFaculdades(linha).join(" → ")}</p>
              </div>
              <button type="button" className="favoritos-remover" aria-label={`Remover ${linha.nome} dos favoritos`} onClick={() => remover(linha)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
