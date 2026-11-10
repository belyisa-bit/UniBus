package com.unibus.service;

import com.unibus.model.Localizacao;
import com.unibus.model.Onibus;
import com.unibus.model.Linha;
import com.unibus.repository.LinhaRepository;
import com.unibus.repository.LocalizacaoRepository;
import com.unibus.repository.OnibusRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class SimuladorGpsService {

    private final LocalizacaoRepository localizacaoRepository;
    private final OnibusRepository onibusRepository;
    private final LinhaRepository linhaRepository;

    public SimuladorGpsService(LocalizacaoRepository localizacaoRepository,
                               OnibusRepository onibusRepository,
                               LinhaRepository linhaRepository) {
        this.localizacaoRepository = localizacaoRepository;
        this.onibusRepository = onibusRepository;
        this.linhaRepository = linhaRepository;
    }

    private final Random random = new Random();

    private static final String IDENTIFICACAO_ONIBUS_SIMULADO = "ONIBUS_SIMULADO";

    // Coordenadas base do Campus/Centro para simulação
    private double latitudeBase = -8.0553;
    private double longitudeBase = -34.9514;

    /**
     * Executa a cada 10 segundos (fixedRate = 10000 ms) para gerar
     * novas coordenadas simuladas e salvar no banco.
     */
    @Scheduled(fixedRate = 10000)
    public void simularMovimentoGps() {
        double variacaoLat = (random.nextDouble() - 0.5) * 0.002;
        double variacaoLng = (random.nextDouble() - 0.5) * 0.002;

        latitudeBase += variacaoLat;
        longitudeBase += variacaoLng;

        Onibus onibus = onibusRepository.findByIdentificacao(IDENTIFICACAO_ONIBUS_SIMULADO)
                .orElseGet(() -> {
                    Onibus novoOnibus = new Onibus();
                    novoOnibus.setIdentificacao(IDENTIFICACAO_ONIBUS_SIMULADO);
                    novoOnibus.setPlaca("SIM-0001");
                    novoOnibus.setAtivo(true);
                    return novoOnibus;
                });

        if (onibus.getLinha() == null) {
            Linha linha = linhaRepository.findAll().stream().findFirst().orElse(null);
            if (linha == null) return;
            onibus.setLinha(linha);
        }
        onibus = onibusRepository.save(onibus);

        Localizacao novaLocalizacao = new Localizacao();
        novaLocalizacao.setLatitude(BigDecimal.valueOf(latitudeBase));
        novaLocalizacao.setLongitude(BigDecimal.valueOf(longitudeBase));
        novaLocalizacao.setDataHora(LocalDateTime.now());
        novaLocalizacao.setOnibus(onibus);

        localizacaoRepository.save(novaLocalizacao);

        System.out.println("📍 [SIMULADOR GPS] Nova localização gerada: Lat "
                + latitudeBase + " | Lng " + longitudeBase + " | Ônibus: " + onibus.getIdentificacao());
    }
}
