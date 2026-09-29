package com.unibus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unibus.model.AlertaCarona;
import com.unibus.service.AlertaCaronaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AlertaCaronaController.class)
class AlertaCaronaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AlertaCaronaService alertaCaronaService;

    @Test
    @DisplayName("Deve listar todos os alertas de carona ativos com status 200 OK")
    void deveListarAlertasCarona() throws Exception {
        AlertaCarona alerta = new AlertaCarona(1L, "Carona Campus", "Centro", "Campus", "3 vagas", 3, LocalDateTime.now(), LocalDateTime.now(), true);
        when(alertaCaronaService.listarTodosAtivos()).thenReturn(List.of(alerta));

        mockMvc.perform(get("/api/alertas-carona"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Carona Campus"))
                .andExpect(jsonPath("$[0].vagas").value(3));
    }

    @Test
    @DisplayName("Deve buscar alerta por ID existente com status 200 OK")
    void deveBuscarPorIdExistente() throws Exception {
        AlertaCarona alerta = new AlertaCarona(1L, "Carona Volta", "Campus", "Centro", "1 vaga", 1, LocalDateTime.now(), LocalDateTime.now(), true);
        when(alertaCaronaService.buscarPorId(1L)).thenReturn(Optional.of(alerta));

        mockMvc.perform(get("/api/alertas-carona/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.origem").value("Campus"));
    }

    @Test
    @DisplayName("Deve retornar status 404 Not Found quando buscar ID inexistente")
    void deveRetornar404QuandoIdNaoExiste() throws Exception {
        when(alertaCaronaService.buscarPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/alertas-carona/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve criar alerta de carona valido com status 201 Created")
    void deveCriarAlertaCaronaValido() throws Exception {
        AlertaCarona input = new AlertaCarona(null, "Carona Manhã", "Boa Vista", "Campus", "Direto", 2, null, null, true);
        AlertaCarona criado = new AlertaCarona(1L, "Carona Manhã", "Boa Vista", "Campus", "Direto", 2, LocalDateTime.now(), LocalDateTime.now(), true);

        when(alertaCaronaService.criar(any(AlertaCarona.class))).thenReturn(criado);

        mockMvc.perform(post("/api/alertas-carona")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("Deve desativar alerta de carona e retornar status 204 No Content")
    void deveDesativarAlertaExistente() throws Exception {
        AlertaCarona alerta = new AlertaCarona(1L, "Carona", "A", "B", "Obs", 1, LocalDateTime.now(), LocalDateTime.now(), true);
        when(alertaCaronaService.buscarPorId(1L)).thenReturn(Optional.of(alerta));

        mockMvc.perform(patch("/api/alertas-carona/1/desativar"))
                .andExpect(status().isNoContent());
    }
}