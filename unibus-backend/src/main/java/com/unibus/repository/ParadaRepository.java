package com.unibus.repository;

import com.unibus.model.Parada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
public interface ParadaRepository extends JpaRepository<Parada, Long> {
}
=======
import java.util.List;

@Repository
public interface ParadaRepository extends JpaRepository<Parada, Long> {
    List<Parada> findByAtivaTrueOrderByNomeAsc();

    List<Parada> findDistinctByLinhas_IdAndAtivaTrueOrderByNomeAsc(Long linhaId);

    boolean existsByIdAndLinhas_Id(Long paradaId, Long linhaId);
}
>>>>>>> ef9a6d7107d779f329d1e3b1055340095fd66c1c
