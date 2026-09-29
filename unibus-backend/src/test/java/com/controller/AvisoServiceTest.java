package com.unibus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unibus.model.Aviso;
import com.unibus.service.AvisoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AvisoController.class)
class AvisoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AvisoService avisoService;

    @Test
    @DisplayName("Deve retornar lista de avisos ativos com status 200 OK")
    void deveListarTodosAvisos() throws Exception {
        Aviso aviso = new Aviso(1L, 10L, "ATRASO", "Ônibus atrasado", LocalDateTime.now(), true);
        when(avisoService.listarTodosAtivos()).thenReturn(List.of(aviso));

        mockMvc.perform(get("/api/avisos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tipo").value("ATRASO"))
                .andExpect(jsonPath("$[0].linhaId").value(10));
    }

    @Test
    @DisplayName("Deve criar um aviso valido com status 201 Created")
    void deveCriarAvisoComSucesso() throws Exception {
        Aviso aviso = new Aviso(null, 10L, "ATRASO", "Trânsito intenso", null, true);
        Aviso avisoSalvo = new Aviso(1L, 10L, "ATRASO", "Trânsito intenso", LocalDateTime.now(), true);

        when(avisoService.criar(any(Aviso.class))).thenReturn(avisoSalvo);

        mockMvc.perform(post("/api/avisos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(aviso)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.tipo").value("ATRASO"));
    }
}