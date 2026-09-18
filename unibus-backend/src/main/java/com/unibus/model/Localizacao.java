import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "localizacoes")
public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "onibus_id", nullable = false)
    private Onibus onibus;

    // getters e setters
}