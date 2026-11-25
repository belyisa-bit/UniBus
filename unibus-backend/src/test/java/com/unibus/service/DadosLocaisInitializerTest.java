package com.unibus.service;

import com.unibus.repository.HorarioRepository;
import com.unibus.repository.LinhaRepository;
import com.unibus.repository.ParadaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"spring.jpa.show-sql=false", "logging.level.org.hibernate.SQL=WARN"})
@AutoConfigureMockMvc
@ActiveProfiles("local")
class DadosLocaisInitializerTest {
    @Autowired DadosLocaisInitializer initializer;
    @Autowired LinhaRepository linhas;
    @Autowired ParadaRepository paradas;
    @Autowired HorarioRepository horarios;
    @Autowired MockMvc mvc;

    @Test
    void carregaRotasHorariosEPontosSemDuplicar() throws Exception {
        assertEquals(30, linhas.count());
        assertEquals(300, horarios.count());
        long totalParadas = paradas.count();
        initializer.run();
        assertEquals(30, linhas.count());
        assertEquals(300, horarios.count());
        assertEquals(totalParadas, paradas.count());

        var condado = linhas.findAll().stream()
                .filter(l -> l.getNome().equals("Rota 1 Condado")).findFirst().orElseThrow();
        mvc.perform(get("/api/horarios/linha/" + condado.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(10))
                .andExpect(jsonPath("$[0].hora").value("16:00"))
                .andExpect(jsonPath("$[1].hora").value("21:30"));
        mvc.perform(get("/api/paradas/linha/" + condado.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Banco do Brasil"));
    }
}
