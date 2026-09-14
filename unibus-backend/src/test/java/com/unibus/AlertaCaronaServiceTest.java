package com.unibus.service;

import com.unibus.model.AlertaCarona;
import com.unibus.repository.AlertaCaronaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertaCaronaServiceTest {

    @Mock
    private AlertaCaronaRepository alertaCaronaRepository;

    @InjectMocks
    private AlertaCaronaService alertaCaronaService;

    @Test
    void deveCriarAlertaCaronaComSucesso() {
        AlertaCarona alerta = new AlertaCarona();
        alerta.setTitulo("Carona para o Campus Central");
        alerta.setOrigem("Centro");
        alerta.setDestino("Campus");
        alerta.setVagas(3);

        when(alertaCaronaRepository.save(any(AlertaCarona.class))).thenReturn(alerta);

        AlertaCarona criado = alertaCaronaService.criar(alerta);

        assertNotNull(criado);
        assertTrue(criado.getAtivo());
        assertNotNull(criado.getDataHoraCriacao());
    }
}
