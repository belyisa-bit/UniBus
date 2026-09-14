package com.unibus.repository;

import com.unibus.model.AlertaCarona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertaCaronaRepository extends JpaRepository<AlertaCarona, Long> {
    List<AlertaCarona> findByAtivoTrueOrderByDataHoraCriacaoDesc();
    List<AlertaCarona> findByOrigemContainingIgnoreCaseAndDestinoContainingIgnoreCaseAndAtivoTrue(String origem, String destino);
}