package com.unibus.dto;

public record UsuarioResponse(
    Long id,
    String nome,
    String email,
    String papel
) {}
