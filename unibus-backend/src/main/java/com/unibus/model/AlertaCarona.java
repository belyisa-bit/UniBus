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
@Table(name = "alertas_carona")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertaCarona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título do alerta de carona é obrigatório")
    private String titulo;

    @NotBlank(message = "A origem é obrigatória")
    private String origem;

    @NotBlank(message = "O destino é obrigatório")
    private String destino;

    private String descricao;

    @NotNull(message = "O número de vagas disponíveis/solicitadas é obrigatório")
    private Integer vagas;

    private LocalDateTime dataHoraSaida;

    private LocalDateTime dataHoraCriacao = LocalDateTime.now();

    private Boolean ativo = true;
}