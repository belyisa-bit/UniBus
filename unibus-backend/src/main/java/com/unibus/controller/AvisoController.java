package com.unibus.controller;

import com.unibus.model.Aviso;
import com.unibus.service.AvisoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avisos")
public class AvisoController {

    private final AvisoService avisoService;

    public AvisoController(AvisoService avisoService) {
        this.avisoService = avisoService;
    }

    @GetMapping
    public ResponseEntity<List<Aviso>> listarTodos() {
        return ResponseEntity.ok(avisoService.listarTodosAtivos());
    }

    @GetMapping("/linha/{linhaId}")
    public ResponseEntity<List<Aviso>> listarPorLinha(@PathVariable Long linhaId) {
        return ResponseEntity.ok(avisoService.listarPorLinha(linhaId));
    }

    @PostMapping
    public ResponseEntity<Aviso> criar(@Valid @RequestBody Aviso aviso) {
        Aviso novoAviso = avisoService.criar(aviso);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAviso);
    }
}