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
}