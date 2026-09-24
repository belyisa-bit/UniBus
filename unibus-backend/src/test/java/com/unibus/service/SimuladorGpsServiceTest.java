package com.unibus.service;

import com.unibus.model.Localizacao;
import com.unibus.model.Onibus;
import com.unibus.repository.LocalizacaoRepository;
import com.unibus.repository.OnibusRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SimuladorGpsServiceTest {

    @Mock
    private LocalizacaoRepository localizacaoRepository;

    @Mock
    private OnibusRepository onibusRepository;

    @InjectMocks
    private SimuladorGpsService simuladorGpsService;

    @Test
    void deveSalvarLocalizacaoComOnibusPadrao() {
        when(onibusRepository.findByIdentificacao("ONIBUS_SIMULADO")).thenReturn(Optional.empty());
        when(onibusRepository.save(any(Onibus.class))).thenAnswer(invocation -> {
            Onibus onibus = invocation.getArgument(0);
            onibus.setId(10L);
            return onibus;
        });

        simuladorGpsService.simularMovimentoGps();

        ArgumentCaptor<Localizacao> captor = ArgumentCaptor.forClass(Localizacao.class);
        verify(localizacaoRepository).save(captor.capture());

        Localizacao localizacaoSalva = captor.getValue();

        assertNotNull(localizacaoSalva.getLatitude());
        assertNotNull(localizacaoSalva.getLongitude());
        assertNotNull(localizacaoSalva.getDataHora());
        assertNotNull(localizacaoSalva.getOnibus());
        assertEquals(10L, localizacaoSalva.getOnibus().getId());
    }
}
