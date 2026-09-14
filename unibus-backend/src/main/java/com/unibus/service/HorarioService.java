package com.unibus.service;

import com.unibus.model.Horario;
import com.unibus.model.Linha;
import com.unibus.model.Parada;
import com.unibus.repository.HorarioRepository;
import com.unibus.repository.LinhaRepository;
import com.unibus.repository.ParadaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class HorarioService {

    private static final Comparator<Horario> ORDEM_CRONOLOGICA = Comparator
            .comparingInt((Horario horario) -> horario.getDiaSemana().getValue())
            .thenComparing(Horario::getHora);

    private final HorarioRepository horarioRepository;
    private final LinhaRepository linhaRepository;
    private final ParadaRepository paradaRepository;

    public HorarioService(
            HorarioRepository horarioRepository,
            LinhaRepository linhaRepository,
            ParadaRepository paradaRepository
    ) {
        this.horarioRepository = horarioRepository;
        this.linhaRepository = linhaRepository;
        this.paradaRepository = paradaRepository;
    }

    public List<Horario> listarPorLinha(Long linhaId) {
        return horarioRepository.findByLinha_IdAndAtivoTrue(linhaId).stream()
                .sorted(ORDEM_CRONOLOGICA)
                .toList();
    }

    public List<Horario> listarPorParada(Long paradaId) {
        return horarioRepository.findByParada_IdAndAtivoTrue(paradaId).stream()
                .sorted(ORDEM_CRONOLOGICA)
                .toList();
    }

    public Horario criar(Horario horario) {
        if (horario.getLinha() == null || horario.getLinha().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ID da linha é obrigatório");
        }
        if (horario.getParada() == null || horario.getParada().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ID da parada é obrigatório");
        }

        Long linhaId = horario.getLinha().getId();
        Long paradaId = horario.getParada().getId();
        Linha linha = linhaRepository.findById(linhaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linha não encontrada"));
        Parada parada = paradaRepository.findById(paradaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parada não encontrada"));

        if (!paradaRepository.existsByIdAndLinhas_Id(paradaId, linhaId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A parada não pertence a esta linha");
        }

        horario.setLinha(linha);
        horario.setParada(parada);
        horario.setAtivo(true);
        return horarioRepository.save(horario);
    }

    public void deletar(Long id) {
        if (!horarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Horário não encontrado");
        }
        horarioRepository.deleteById(id);
    }
}
