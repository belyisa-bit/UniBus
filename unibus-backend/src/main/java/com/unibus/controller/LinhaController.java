package com.unibus.controller;

import com.unibus.model.Linha;
import com.unibus.model.Localizacao;
import com.unibus.service.LocalizacaoService;
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
    private final LocalizacaoService localizacaoService;

    public LinhaController(LinhaService linhaService, LocalizacaoService localizacaoService) {
        this.linhaService = linhaService;
        this.localizacaoService = localizacaoService;
    }

    @GetMapping
    public ResponseEntity<List<Linha>> listarTodas(
            @RequestParam(required = false) String zona,
            @RequestParam(required = false) String campus,
            @RequestParam(required = false) String ordem,
            @RequestParam(required = false) String nome) {

        if (zona != null && !zona.isBlank()
                && campus != null && !campus.isBlank()) {
            return ResponseEntity.ok(
                    linhaService.filtrarPorZonaECampus(zona, campus)
            );
        }

        if (zona != null && !zona.isBlank()) {
            return ResponseEntity.ok(
                    linhaService.filtrarPorZona(zona)
            );
        }

        if (campus != null && !campus.isBlank()) {
            return ResponseEntity.ok(
                    linhaService.filtrarPorCampus(campus)
            );
        }

        if (ordem != null && !ordem.isBlank()) {
            return ResponseEntity.ok(
                    linhaService.ordenarPorNome(ordem)
            );
        }

        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(
                    linhaService.buscarPorNome(nome)
            );
        }

        return ResponseEntity.ok(linhaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Linha> buscarPorId(@PathVariable Long id) {
        return linhaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/localizacao")
    public ResponseEntity<LocalizacaoLinhaResponse> buscarLocalizacao(@PathVariable Long id) {
        if (linhaService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var localizacao = localizacaoService.buscarUltimaPorLinha(id);
        if (localizacao.isEmpty()) return ResponseEntity.noContent().build();

        Localizacao ultima = localizacao.get();
        return ResponseEntity.ok(new LocalizacaoLinhaResponse(
                ultima.getLatitude(),
                ultima.getLongitude(),
                ultima.getDataHora(),
                ultima.getOnibus().getIdentificacao()));
    }

    public record LocalizacaoLinhaResponse(
            java.math.BigDecimal latitude,
            java.math.BigDecimal longitude,
            java.time.LocalDateTime dataHora,
            String onibus) {}

    @PostMapping
    public ResponseEntity<Linha> criar(@Valid @RequestBody Linha linha) {
        Linha novaLinha = linhaService.salvar(linha);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaLinha);
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
