package com.unibus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "paradas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Parada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da parada é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "O endereço ou ponto de referência é obrigatório")
    @Column(nullable = false)
    private String endereco;

    @DecimalMin(value = "-90.0", message = "A latitude deve estar entre -90 e 90")
    @DecimalMax(value = "90.0", message = "A latitude deve estar entre -90 e 90")
    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @DecimalMin(value = "-180.0", message = "A longitude deve estar entre -180 e 180")
    @DecimalMax(value = "180.0", message = "A longitude deve estar entre -180 e 180")
    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    private Boolean ativa = true;

    @Size(min = 1, message = "A parada deve estar associada a pelo menos uma linha")
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "parada_linhas",
            joinColumns = @JoinColumn(name = "parada_id"),
            inverseJoinColumns = @JoinColumn(name = "linha_id")
    )
    private Set<Linha> linhas = new HashSet<>();
}
