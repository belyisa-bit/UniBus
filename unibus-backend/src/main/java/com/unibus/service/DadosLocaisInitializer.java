package com.unibus.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unibus.model.Horario;
import com.unibus.model.Linha;
import com.unibus.model.Parada;
import com.unibus.repository.HorarioRepository;
import com.unibus.repository.LinhaRepository;
import com.unibus.repository.ParadaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

/** Dados demonstrativos para H2 local. Nunca modifica um banco já preenchido. */
@Component
@Profile("local")
public class DadosLocaisInitializer implements CommandLineRunner {
    private final LinhaRepository linhas;
    private final ParadaRepository paradas;
    private final HorarioRepository horarios;
    private final ObjectMapper mapper;

    public DadosLocaisInitializer(LinhaRepository linhas, ParadaRepository paradas,
                                 HorarioRepository horarios, ObjectMapper mapper) {
        this.linhas = linhas;
        this.paradas = paradas;
        this.horarios = horarios;
        this.mapper = mapper;
    }

    public record RotaDemo(int id, String nome, String origem, List<String> faculdades,
                           String horarioSaida, String horarioRetorno, String status,
                           List<String> pontosEmbarque) {}

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (linhas.count() > 0) return;
        try (var entrada = new ClassPathResource("demo/linhas.json").getInputStream()) {
            for (var rota : mapper.readValue(entrada, RotaDemo[].class)) {
                var linha = new Linha();
                linha.setCodigo(String.format("%03d", rota.id()));
                linha.setNome(rota.nome());
                linha.setEmpresa("UniBus — demonstração local");
                linha.setZona(rota.origem());
                linha.setCampus(rota.faculdades());
                linhas.save(linha);

                // Sem endereço cadastrado, a referência é explicitamente provisória.
                var nomes = rota.pontosEmbarque().isEmpty()
                        ? List.of("Embarque a confirmar em " + rota.origem() + " (demonstração)")
                        : rota.pontosEmbarque();
                Parada primeira = null;
                for (var nome : nomes) {
                    var parada = criarParada(linha, nome, rota.origem() + " — referência demonstrativa");
                    if (primeira == null) primeira = parada;
                }
                // O modelo exige uma parada para o horário de retorno. Não inventa um endereço.
                var retorno = criarParada(linha, "Retorno: confirmar embarque com o motorista",
                        "Recife – PE — referência demonstrativa de retorno");
                for (var dia : DayOfWeek.values()) {
                    if (dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY) continue;
                    criarHorario(linha, primeira, dia, rota.horarioSaida(), "IDA");
                    criarHorario(linha, retorno, dia, rota.horarioRetorno(), "VOLTA");
                }
            }
        }
    }

    private Parada criarParada(Linha linha, String nome, String endereco) {
        var parada = new Parada();
        parada.setNome(nome);
        parada.setEndereco(endereco);
        parada.setLinhas(Set.of(linha));
        return paradas.save(parada);
    }

    private void criarHorario(Linha linha, Parada parada, DayOfWeek dia, String hora, String sentido) {
        var horario = new Horario();
        horario.setLinha(linha);
        horario.setParada(parada);
        horario.setDiaSemana(dia);
        horario.setHora(LocalTime.parse(hora));
        horario.setSentido(sentido);
        horarios.save(horario);
    }
}
