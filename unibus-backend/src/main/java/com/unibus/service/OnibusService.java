
package com.unibus.service;

import com.unibus.model.Onibus;
import com.unibus.repository.OnibusRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class OnibusService {

    private final OnibusRepository onibusRepository;

    public OnibusService(OnibusRepository onibusRepository) {
        this.onibusRepository = onibusRepository;
    }

    public List<Onibus> listarTodos() {
        return onibusRepository.findAll();
    }

    public Onibus buscarPorId(Long id) {
        return onibusRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ônibus não encontrado"));
    }

    public Onibus criar(Onibus onibus) {
        return onibusRepository.save(onibus);
    }

    public void deletar(Long id) {
        if (!onibusRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Ônibus não encontrado");
        }

        onibusRepository.deleteById(id);
    }
}
