package com.unibus.controller;

import com.unibus.model.Linha;
import com.unibus.service.LinhaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/linhas")
public class LinhaController {

    private final LinhaService linhaService;

    public LinhaController(LinhaService linhaService) {
        this.linhaService = linhaService;
    }

    @GetMapping
    public ResponseEntity<List<Linha>> listarTodas() {
        return ResponseEntity.ok(linhaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Linha> buscarPorId(@PathVariable Long id) {
        return linhaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Linha> criar(@Valid @RequestBody Linha linha) {
        Linha novaLinha = linhaService.salvar(linha);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaLinha);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (linhaService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        linhaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}