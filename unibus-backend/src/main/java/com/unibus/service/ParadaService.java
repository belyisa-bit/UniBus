package com.unibus.service;

import com.unibus.model.Linha;
import com.unibus.model.Parada;
import com.unibus.repository.LinhaRepository;
import com.unibus.repository.ParadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ParadaService {

    private final ParadaRepository paradaRepository;
    private final LinhaRepository linhaRepository;

    public ParadaService(ParadaRepository paradaRepository, LinhaRepository linhaRepository) {
        this.paradaRepository = paradaRepository;
        this.linhaRepository = linhaRepository;
    }

    public List<Parada> listarTodasAtivas() {
        return paradaRepository.findByAtivaTrueOrderByNomeAsc();
    }

    public List<Parada> listarPorLinha(Long linhaId) {
        return paradaRepository.findDistinctByLinhas_IdAndAtivaTrueOrderByNomeAsc(linhaId);
    }

    public Parada criar(Parada parada) {
        if (parada.getLinhas() == null || parada.getLinhas().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe pelo menos uma linha");
        }

        Set<Long> linhaIds = parada.getLinhas().stream()
                .map(Linha::getId)
                .collect(Collectors.toSet());

        if (linhaIds.contains(null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ID de cada linha é obrigatório");
        }

        List<Linha> linhas = linhaRepository.findAllById(linhaIds);
        if (linhas.size() != linhaIds.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Uma ou mais linhas não foram encontradas");
        }

        parada.setLinhas(new HashSet<>(linhas));
        parada.setAtiva(true);
        return paradaRepository.save(parada);
    }

    public void deletar(Long id) {
        if (!paradaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parada não encontrada");
        }
        paradaRepository.deleteById(id);
    }
}
