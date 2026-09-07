package com.unibus.repository;

import com.unibus.model.Parada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParadaRepository extends JpaRepository<Parada, Long> {
    List<Parada> findByAtivaTrue();
    List<Parada> findByNomeContainingIgnoreCaseOrLocalizacaoContainingIgnoreCase(String nome, String localizacao);
}