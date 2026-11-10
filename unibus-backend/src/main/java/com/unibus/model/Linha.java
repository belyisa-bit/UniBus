package com.unibus.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    private String zona;

    @ElementCollection
    @CollectionTable(
            name = "linha_campus",
            joinColumns = @JoinColumn(name = "linha_id")
    )
    private List<String> campus = new ArrayList<>();
}