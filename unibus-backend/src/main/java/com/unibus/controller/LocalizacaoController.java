package com.unibus.controller;

import com.unibus.model.Localizacao;
import com.unibus.service.LocalizacaoService;
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
@RequestMapping("/api/localizacoes")
public class LocalizacaoController {

    private final LocalizacaoService localizacaoService;

    public LocalizacaoController(LocalizacaoService localizacaoService) {
        this.localizacaoService = localizacaoService;
    }

    @GetMapping
    public ResponseEntity<List<Localizacao>> listarTodos() {
        return ResponseEntity.ok(localizacaoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Localizacao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(localizacaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Localizacao> criar(@Valid @RequestBody Localizacao localizacao) {
        Localizacao novaLocalizacao = localizacaoService.criar(localizacao);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaLocalizacao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        localizacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}