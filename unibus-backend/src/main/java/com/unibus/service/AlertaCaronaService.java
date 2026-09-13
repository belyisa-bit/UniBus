package com.unibus.service;

import com.unibus.model.AlertaCarona;
import com.unibus.repository.AlertaCaronaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AlertaCaronaService {

    private final AlertaCaronaRepository alertaCaronaRepository;

    public AlertaCaronaService(AlertaCaronaRepository alertaCaronaRepository) {
        this.alertaCaronaRepository = alertaCaronaRepository;
    }

    public List<AlertaCarona> listarTodosAtivos() {
        return alertaCaronaRepository.findByAtivoTrueOrderByDataHoraCriacaoDesc();
    }

    public Optional<AlertaCarona> buscarPorId(Long id) {
        return alertaCaronaRepository.findById(id);
    }

    public List<AlertaCarona> buscarPorTrajeto(String origem, String destino) {
        return alertaCaronaRepository.findByOrigemContainingIgnoreCaseAndDestinoContainingIgnoreCaseAndAtivoTrue(origem, destino);
    }

    public AlertaCarona criar(AlertaCarona alerta) {
        alerta.setDataHoraCriacao(LocalDateTime.now());
        alerta.setAtivo(true);
        return alertaCaronaRepository.save(alerta);
    }

    public void desativar(Long id) {
        alertaCaronaRepository.findById(id).ifPresent(alerta -> {
            alerta.setAtivo(false);
            alertaCaronaRepository.save(alerta);
        });
    }
}