package com.unibus.controller;

import com.unibus.model.Parada;
import com.unibus.service.ParadaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paradas")
public class ParadaController {

    private final ParadaService paradaService;

    public ParadaController(ParadaService paradaService) {
        this.paradaService = paradaService;
    }

    @GetMapping
    public ResponseEntity<List<Parada>> listarTodas() {
        return ResponseEntity.ok(paradaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parada> buscarPorId(@PathVariable Long id) {
        return paradaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Parada> criar(@Valid @RequestBody Parada parada) {
        Parada novaParada = paradaService.salvar(parada);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaParada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (paradaService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        paradaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}