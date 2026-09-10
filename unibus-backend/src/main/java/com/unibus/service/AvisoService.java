package com.unibus.service;

import com.unibus.model.Aviso;
import com.unibus.model.Linha;
import com.unibus.repository.AvisoRepository;
import com.unibus.repository.LinhaRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvisoService {

    private final AvisoRepository avisoRepository;
    private final LinhaRepository linhaRepository;

    public AvisoService(AvisoRepository avisoRepository, LinhaRepository linhaRepository) {
        this.avisoRepository = avisoRepository;
        this.linhaRepository = linhaRepository;
    }

    public List<Aviso> listarTodosAtivos() {
        return avisoRepository.findByAtivoTrueOrderByDataHoraDesc();
    }

    public List<Aviso> listarPorLinha(Long linhaId) {
        return avisoRepository.findByLinhaIdAndAtivoTrueOrderByDataHoraDesc(linhaId);
    }

    public Aviso criar(Aviso aviso) {
        if (aviso.getLinha() == null || aviso.getLinha().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ID da linha é obrigatório");
        }

        Long linhaId = aviso.getLinha().getId();
        Linha linha = linhaRepository.findById(linhaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linha não encontrada"));

        aviso.setLinha(linha);
        aviso.setDataHora(LocalDateTime.now());
        aviso.setAtivo(true);
        return avisoRepository.save(aviso);
    }
}
