package com.unibus.service;

import com.unibus.model.Linha;
import com.unibus.repository.LinhaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LinhaService {

    private final LinhaRepository linhaRepository;

    public LinhaService(LinhaRepository linhaRepository) {
        this.linhaRepository = linhaRepository;
    }

    public List<Linha> listarTodas() {
        return linhaRepository.findAll();
    }

    public Optional<Linha> buscarPorId(Long id) {
        return linhaRepository.findById(id);
    }

    public Linha salvar(Linha linha) {
        return linhaRepository.save(linha);
    }

    public void deletar(Long id) {
        linhaRepository.deleteById(id);
    }

    // Busca por nome
    public List<Linha> buscarPorNome(String nome) {
        return linhaRepository.findByNomeContainingIgnoreCase(nome);
    }

    // Ordenação
    public List<Linha> ordenarPorNome(String ordem) {
        if ("desc".equalsIgnoreCase(ordem)) {
            return linhaRepository.findAllByOrderByNomeDesc();
        }

        return linhaRepository.findAllByOrderByNomeAsc();
    }

    // Filtro por zona
    public List<Linha> filtrarPorZona(String zona) {
        return linhaRepository.findByZonaIgnoreCase(zona);
    }

    // Filtro por campus
    public List<Linha> filtrarPorCampus(String campus) {
        return linhaRepository.findByCampusContainingIgnoreCase(campus);
    }

    // Filtro por zona e campus
    public List<Linha> filtrarPorZonaECampus(String zona, String campus) {
        return linhaRepository.findByZonaIgnoreCaseAndCampusContainingIgnoreCase(
                zona,
                campus
        );
    }
}