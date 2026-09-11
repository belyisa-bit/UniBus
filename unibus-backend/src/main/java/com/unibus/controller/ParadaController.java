package com.unibus.controller;

import com.unibus.model.Parada;
import com.unibus.service.ParadaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return ResponseEntity.ok(paradaService.listarTodasAtivas());
    }

    @GetMapping("/linha/{linhaId}")
    public ResponseEntity<List<Parada>> listarPorLinha(@PathVariable Long linhaId) {
        return ResponseEntity.ok(paradaService.listarPorLinha(linhaId));
    }

    @PostMapping
    public ResponseEntity<Parada> criar(@Valid @RequestBody Parada parada) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paradaService.criar(parada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        paradaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
