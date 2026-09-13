package com.unibus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "favoritos",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_favorito_linha",
                columnNames = "linha_id"
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O ID da linha é obrigatório")
    @Column(name = "linha_id", nullable = false)
    private Long linhaId;

    @Column(nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();
}