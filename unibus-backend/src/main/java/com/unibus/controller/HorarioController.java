package com.unibus.controller;

import com.unibus.model.Horario;
import com.unibus.service.HorarioService;
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
@RequestMapping("/api/horarios")
public class HorarioController {

    private final HorarioService horarioService;

    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping("/linha/{linhaId}")
    public ResponseEntity<List<Horario>> listarPorLinha(@PathVariable Long linhaId) {
        return ResponseEntity.ok(horarioService.listarPorLinha(linhaId));
    }

    @GetMapping("/parada/{paradaId}")
    public ResponseEntity<List<Horario>> listarPorParada(@PathVariable Long paradaId) {
        return ResponseEntity.ok(horarioService.listarPorParada(paradaId));
    }

    @PostMapping
    public ResponseEntity<Horario> criar(@Valid @RequestBody Horario horario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(horarioService.criar(horario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        horarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
