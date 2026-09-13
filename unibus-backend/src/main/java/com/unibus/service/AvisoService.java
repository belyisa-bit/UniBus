package com.unibus.service;

import com.unibus.model.Aviso;
import com.unibus.repository.AvisoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvisoService {

    private final AvisoRepository avisoRepository;

    public AvisoService(AvisoRepository avisoRepository) {
        this.avisoRepository = avisoRepository;
    }

    public List<Aviso> listarTodosAtivos() {
        return avisoRepository.findByAtivoTrueOrderByDataHoraDesc();
    }

    public List<Aviso> listarPorLinha(Long linhaId) {
        return avisoRepository.findByLinhaIdAndAtivoTrueOrderByDataHoraDesc(linhaId);
    }

    public Aviso criar(Aviso aviso) {
        aviso.setDataHora(LocalDateTime.now());
        aviso.setAtivo(true);
        return avisoRepository.save(aviso);
    }
}