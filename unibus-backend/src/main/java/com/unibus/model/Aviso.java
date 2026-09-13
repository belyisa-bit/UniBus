package com.unibus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "avisos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aviso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O ID da linha é obrigatório")
    private Long linhaId;

    @NotBlank(message = "O tipo do aviso é obrigatório (ex: ATRASO, LOTADO, PASSOU_AGORA, CANCELADO)")
    private String tipo;

    private String descricao;

    private LocalDateTime dataHora = LocalDateTime.now();

    private Boolean ativo = true;
}