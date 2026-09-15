import { useState } from "react"

function useFavoritos() {
  const [favoritos, setFavoritos] = useState([])

  function adicionarFavorito(linha) {
    setFavoritos((favoritosAtuais) => {
      const jaExiste = favoritosAtuais.some(
        (favorito) => favorito.id === linha.id
      )

      if (jaExiste) {
        return favoritosAtuais
      }

      return [...favoritosAtuais, linha]
    })
  }

  function removerFavorito(id) {
    setFavoritos((favoritosAtuais) =>
      favoritosAtuais.filter((favorito) => favorito.id !== id)
    )
  }

  function verificarFavorito(id) {
    return favoritos.some((favorito) => favorito.id === id)
  }

  return {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    verificarFavorito,
  }
}

export default useFavoritos