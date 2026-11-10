package com.unibus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "favoritos",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_favorito_usuario_linha",
        columnNames = {"usuario_id", "linha_id"}
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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"senha"})
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();
}