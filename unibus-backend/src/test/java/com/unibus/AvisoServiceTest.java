package com.unibus.service;

import com.unibus.model.Aviso;
import com.unibus.repository.AvisoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AvisoServiceTest {

    @Mock
    private AvisoRepository avisoRepository;

    @InjectMocks
    private AvisoService avisoService;

    @Test
    void deveCriarAvisoComSucesso() {
        Aviso avisoInput = new Aviso();
        avisoInput.setLinhaId(1L);
        avisoInput.setTipo("ATRASO");
        avisoInput.setDescricao("Atraso teste");

        when(avisoRepository.save(any(Aviso.class))).thenReturn(avisoInput);

        Aviso avisoSalvo = avisoService.criar(avisoInput);

        assertNotNull(avisoSalvo);
        assertTrue(avisoSalvo.getAtivo());
        assertNotNull(avisoSalvo.getDataHora());
    }
}