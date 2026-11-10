package com.unibus.service;

import com.unibus.model.Favorito;
import com.unibus.model.Usuario;
import com.unibus.repository.FavoritoRepository;
import com.unibus.repository.LinhaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final LinhaRepository linhaRepository;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            LinhaRepository linhaRepository) {
        this.favoritoRepository = favoritoRepository;
        this.linhaRepository = linhaRepository;
    }

    public List<Favorito> listarTodos(Long usuarioId) {
        return favoritoRepository.findAllByUsuario_Id(usuarioId);
    }

    public Favorito buscarPorLinha(Long linhaId, Long usuarioId) {
        return favoritoRepository
                .findByLinhaIdAndUsuario_Id(linhaId, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Favorito não encontrado"
                ));
    }

    public Favorito criar(Favorito favorito, Usuario usuario) {

        Long linhaId = favorito.getLinhaId();

        if (linhaId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O ID da linha é obrigatório"
            );
        }

        if (!linhaRepository.existsById(linhaId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Linha não encontrada"
            );
        }

        if (favoritoRepository
                .findByLinhaIdAndUsuario_Id(linhaId, usuario.getId())
                .isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esta linha já está favoritada por você"
            );
        }

        favorito.setId(null);
        favorito.setUsuario(usuario);
        favorito.setDataCriacao(java.time.LocalDateTime.now());

        return favoritoRepository.save(favorito);
    }

    public void deletar(Long id, Long usuarioId) {

        Favorito favorito = favoritoRepository
                .findByIdAndUsuario_Id(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Favorito não encontrado"
                ));

        favoritoRepository.delete(favorito);
    }
}