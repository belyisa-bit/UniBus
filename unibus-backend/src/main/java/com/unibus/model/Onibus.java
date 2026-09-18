package ...model;

import jakarta.persistence.*;

@Entity
@Table(name = "onibus")
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