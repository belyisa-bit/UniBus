package com.unibus.repository;

import com.unibus.model.Linha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LinhaRepository extends JpaRepository<Linha, Long> {
    // Método customizado para buscar por nome ou código
    List<Linha> findByNomeContainingIgnoreCase(String nome);
}