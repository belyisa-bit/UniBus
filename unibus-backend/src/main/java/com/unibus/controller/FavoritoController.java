package com.unibus.controller;

import com.unibus.model.Favorito;
import com.unibus.service.FavoritoService;
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
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping
    public ResponseEntity<List<Favorito>> listarTodos() {
        return ResponseEntity.ok(favoritoService.listarTodos());
    }

    @GetMapping("/linha/{linhaId}")
    public ResponseEntity<Favorito> buscarPorLinha(@PathVariable Long linhaId) {
        return ResponseEntity.ok(favoritoService.buscarPorLinha(linhaId));
    }

    @PostMapping
    public ResponseEntity<Favorito> criar(@Valid @RequestBody Favorito favorito) {
        return ResponseEntity.status(HttpStatus.CREATED).body(favoritoService.criar(favorito));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        favoritoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}