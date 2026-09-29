package com.unibus.controller;

import com.unibus.model.Onibus;
import com.unibus.service.OnibusService;
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
@RequestMapping("/api/onibus")
public class OnibusController {

    private final OnibusService onibusService;

    public OnibusController(OnibusService onibusService) {
        this.onibusService = onibusService;
    }

    @GetMapping
    public ResponseEntity<List<Onibus>> listarTodos() {
        return ResponseEntity.ok(onibusService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Onibus> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(onibusService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Onibus> criar(@RequestBody Onibus onibus) {
        Onibus novoOnibus = onibusService.criar(onibus);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoOnibus);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        onibusService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}