package com.unibus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "onibus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Onibus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String identificacao;

    private String placa;

    private boolean ativo;

    @ManyToOne
    @JoinColumn(name = "linha_id")
    private Linha linha;
}