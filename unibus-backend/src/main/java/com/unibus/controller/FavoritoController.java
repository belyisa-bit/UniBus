package com.unibus.controller;

import com.unibus.model.Favorito;
import com.unibus.model.Usuario;
import com.unibus.service.FavoritoService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

 @GetMapping
public ResponseEntity<List<Favorito>> listarTodos(
        @AuthenticationPrincipal Usuario usuario) {

    System.out.println("ENTROU NO GET /api/favoritos");
    System.out.println("USUARIO: " + usuario);

    return ResponseEntity.ok(favoritoService.listarTodos(usuario.getId()));
}

    @GetMapping("/linha/{linhaId}")
    public ResponseEntity<Favorito> buscarPorLinha(
            @PathVariable Long linhaId,
            @AuthenticationPrincipal Usuario usuario) {

        return ResponseEntity.ok(
                favoritoService.buscarPorLinha(linhaId, usuario.getId())
        );
    }

    @PostMapping
    public ResponseEntity<Favorito> criar(
            @Valid @RequestBody Favorito favorito,
            @AuthenticationPrincipal Usuario usuario) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(favoritoService.criar(favorito, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {

        favoritoService.deletar(id, usuario.getId());

        return ResponseEntity.noContent().build();
    }
}