package com.unibus.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Map;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"spring.jpa.show-sql=false", "logging.level.org.hibernate.SQL=WARN"})
@AutoConfigureMockMvc
@ActiveProfiles("local")
class AutenticacaoIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void validaCadastroLoginEAcessoProtegido() throws Exception {
        var dados = Map.of("nome", "Teste AV2", "email", "teste-av2@example.com", "senha", "SenhaSomenteTeste123");
        mvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(dados)))
                .andExpect(status().isCreated());
        mvc.perform(post("/api/auth/cadastro").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(dados)))
                .andExpect(status().isConflict());
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("email", dados.get("email"), "senha", "incorreta"))))
                .andExpect(status().isUnauthorized());
        var resposta = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(dados)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.senha").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        var token = mapper.readTree(resposta).get("token").asText();
        mvc.perform(get("/api/favoritos")).andExpect(status().isForbidden());
        mvc.perform(get("/api/favoritos").header("Authorization", "Bearer invalido")).andExpect(status().isForbidden());
        mvc.perform(get("/api/favoritos").header("Authorization", "Bearer " + token)).andExpect(status().isOk());
    }
}
