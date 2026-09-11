package com.unibus.repository;

import com.unibus.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByLinha_IdAndAtivoTrue(Long linhaId);

    List<Horario> findByParada_IdAndAtivoTrue(Long paradaId);
}
