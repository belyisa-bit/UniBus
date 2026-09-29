package com.unibus.controller;

import com.unibus.model.AlertaCarona;
import com.unibus.service.AlertaCaronaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas-carona")
public class AlertaCaronaController {

    private final AlertaCaronaService alertaCaronaService;

    public AlertaCaronaController(AlertaCaronaService alertaCaronaService) {
        this.alertaCaronaService = alertaCaronaService;
    }

    @GetMapping
    public ResponseEntity<List<AlertaCarona>> listarTodos() {
        return ResponseEntity.ok(alertaCaronaService.listarTodosAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertaCarona> buscarPorId(@PathVariable Long id) {
        return alertaCaronaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<AlertaCarona>> buscarPorTrajeto(
            @RequestParam(defaultValue = "") String origem,
            @RequestParam(defaultValue = "") String destino) {
        return ResponseEntity.ok(alertaCaronaService.buscarPorTrajeto(origem, destino));
    }

    @PostMapping
    public ResponseEntity<AlertaCarona> criar(@Valid @RequestBody AlertaCarona alerta) {
        AlertaCarona novoAlerta = alertaCaronaService.criar(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAlerta);
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        if (alertaCaronaService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        alertaCaronaService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}