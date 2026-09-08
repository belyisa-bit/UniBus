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
@Table(name = "linhas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Linha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O código da linha é obrigatório (ex: 030, 2040)")
    private String codigo;

    @NotBlank(message = "O nome da linha é obrigatório (ex: TI Barro / TI Macaxeira)")
    private String nome;

    private String empresa;

    private Boolean ativa = true;
}