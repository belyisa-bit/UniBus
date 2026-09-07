package com.unibus.service;

import com.unibus.model.Parada;
import com.unibus.repository.ParadaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParadaService {

    private final ParadaRepository paradaRepository;

    public ParadaService(ParadaRepository paradaRepository) {
        this.paradaRepository = paradaRepository;
    }

    public List<Parada> listarTodas() {
        return paradaRepository.findAll();
    }

    public Optional<Parada> buscarPorId(Long id) {
        return paradaRepository.findById(id);
    }

    public Parada salvar(Parada parada) {
        return paradaRepository.save(parada);
    }

    public void deletar(Long id) {
        paradaRepository.deleteById(id);
    }
}