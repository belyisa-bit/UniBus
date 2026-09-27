package com.unibus.repository;

import com.unibus.model.Linha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinhaRepository extends JpaRepository<Linha, Long> {

    // Busca por nome
    List<Linha> findByNomeContainingIgnoreCase(String nome);

    // Filtro por zona
    List<Linha> findByZonaIgnoreCase(String zona);

    // Filtro por campus
    List<Linha> findByCampusContainingIgnoreCase(String campus);

    // Filtro por zona e campus
    List<Linha> findByZonaIgnoreCaseAndCampusContainingIgnoreCase(
            String zona,
            String campus
    );
}