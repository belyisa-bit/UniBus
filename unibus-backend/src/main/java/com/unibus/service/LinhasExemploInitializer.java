package com.unibus.service;

import com.unibus.model.Linha;
import com.unibus.repository.LinhaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LinhasExemploInitializer implements CommandLineRunner {

    private final LinhaRepository linhaRepository;

    private static final List<String> FACULDADES = List.of(
            "UFPE", "UNINASSAU", "UNICAP", "UNIBRA", "UFRPE", "IFPE", "ESTÁCIO");
    private static final List<String> CIDADES = List.of(
            "Goiana", "Condado", "Carpina", "Aliança", "Paudalho",
            "Limoeiro", "Vitória de Santo Antão", "Moreno", "Sirinhaém", "Itaquitinga");

    public LinhasExemploInitializer(LinhaRepository linhaRepository) {
        this.linhaRepository = linhaRepository;
    }

    @Override
    public void run(String... args) {
        if (linhaRepository.count() > 0) return;

        int codigo = 1;
        for (String cidade : CIDADES) {
            for (String faculdade : FACULDADES) {
                Linha linha = new Linha();
                linha.setCodigo(String.format("%03d", codigo++));
                linha.setNome(cidade + " → " + faculdade);
                linha.setEmpresa("UniBus");
                linha.setAtiva(true);
                linhaRepository.save(linha);
            }
        }
    }
}
