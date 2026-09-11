package com.unibus.service;

import com.unibus.model.Favorito;
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

    public FavoritoService(FavoritoRepository favoritoRepository, LinhaRepository linhaRepository) {
        this.favoritoRepository = favoritoRepository;
        this.linhaRepository = linhaRepository;
    }

    public List<Favorito> listarTodos() {
        return favoritoRepository.findAll();
    }

    public Favorito buscarPorLinha(Long linhaId) {
        return favoritoRepository.findByLinhaId(linhaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorito não encontrado"));
    }

    public Favorito criar(Favorito favorito) {
        Long linhaId = favorito.getLinhaId();
        if (linhaId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ID da linha é obrigatório");
        }
        if (!linhaRepository.existsById(linhaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Linha não encontrada");
        }
        if (favoritoRepository.findByLinhaId(linhaId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A linha já está favoritada");
        }

        favorito.setId(null);
        favorito.setDataCriacao(java.time.LocalDateTime.now());
        return favoritoRepository.save(favorito);
    }

    public void deletar(Long id) {
        if (!favoritoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorito não encontrado");
        }
        favoritoRepository.deleteById(id);
    }
}