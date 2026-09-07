package com.unibus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "paradas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Parada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome/descrição da parada é obrigatório (ex: Parada em frente à Biblioteca Central)")
    private String nome;

    @NotBlank(message = "A localização/referência é obrigatória (ex: Campus Universitário)")
    private String localizacao;

    private Double latitude;

    private Double longitude;

    private Boolean ativa = true;
}
