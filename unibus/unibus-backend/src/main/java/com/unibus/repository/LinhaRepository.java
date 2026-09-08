package com.unibus.repository;

import com.unibus.model.Linha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinhaRepository extends JpaRepository<Linha, Long> {
    List<Linha> findByAtivaTrue();
    List<Linha> findByNomeContainingIgnoreCaseOrCodigoContainingIgnoreCase(String nome, String codigo);
}