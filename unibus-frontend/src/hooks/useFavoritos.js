import { useState } from "react"
import { linhas } from "../data/linhas"

const chaveFavoritos = "unibus-favoritos"

function lerFavoritos() {
  try {
    const salvo = localStorage.getItem(chaveFavoritos)
    const ids = salvo === null ? [] : JSON.parse(salvo)
    if (!Array.isArray(ids)) throw new Error("Formato inválido")
    return {
      favoritos: linhas.filter((linha) => ids.includes(linha.id)),
      aviso: "",
    }
  } catch {
    return {
      favoritos: [],
      aviso: "Não foi possível recuperar os favoritos salvos neste navegador.",
    }
  }
}

function useFavoritos() {
  const [estado, setEstado] = useState(lerFavoritos)
  const { favoritos, aviso } = estado

  function salvarFavoritos(proximos) {
    let aviso = ""
    try {
      localStorage.setItem(chaveFavoritos, JSON.stringify(proximos.map((linha) => linha.id)))
    } catch {
      aviso = "Não foi possível salvar no navegador. A alteração vale apenas enquanto esta página estiver aberta."
    }
    setEstado({ favoritos: proximos, aviso })
    return { status: "sucesso", persistido: !aviso }
  }

  function adicionarFavorito(linha) {
    const cadastrada = linhas.find((item) => item.id === linha?.id)
    if (!cadastrada) return { status: "invalido" }
    if (verificarFavorito(cadastrada.id)) return { status: "duplicado" }
    return salvarFavoritos([...favoritos, cadastrada])
  }

  function removerFavorito(id) {
    return salvarFavoritos(favoritos.filter((favorito) => favorito.id !== id))
  }

  function verificarFavorito(id) {
    return favoritos.some((favorito) => favorito.id === id)
  }

  return {
    favoritos,
    aviso,
    adicionarFavorito,
    removerFavorito,
    verificarFavorito,
  }
}

export default useFavoritos
