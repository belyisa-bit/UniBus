package com.unibus.repository;

import com.unibus.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findByLinhaIdAndAtivoTrueOrderByDataHoraDesc(Long linhaId);
    List<Aviso> findByAtivoTrueOrderByDataHoraDesc();
}