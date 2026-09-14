package com.unibus.repository;

import com.unibus.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
<<<<<<< HEAD
=======

>>>>>>> ef9a6d7107d779f329d1e3b1055340095fd66c1c
import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {
<<<<<<< HEAD
    List<Horario> findByLinhaId(Long linhaId);
}
=======
    List<Horario> findByLinha_IdAndAtivoTrue(Long linhaId);

    List<Horario> findByParada_IdAndAtivoTrue(Long paradaId);
}
>>>>>>> ef9a6d7107d779f329d1e3b1055340095fd66c1c
