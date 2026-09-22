package com.unibus.service;

import com.unibus.model.Localizacao;
import com.unibus.repository.LocalizacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalizacaoService {

    private final LocalizacaoRepository localizacaoRepository;

    public LocalizacaoService(LocalizacaoRepository localizacaoRepository) {
        this.localizacaoRepository = localizacaoRepository;
    }

    public List<Localizacao> listarTodos() {
        return localizacaoRepository.findAll();
    }

    public Localizacao buscarPorId(Long id) {
        return localizacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Localização não encontrada"));
    }

    public Localizacao criar(Localizacao localizacao) {
        return localizacaoRepository.save(localizacao);
    }

    public void deletar(Long id) {
        if (!localizacaoRepository.existsById(id)) {
            throw new RuntimeException("Localização não encontrada");
        }

        localizacaoRepository.deleteById(id);
    }
}