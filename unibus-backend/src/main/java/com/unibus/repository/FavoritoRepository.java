package com.unibus.repository;

import com.unibus.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findAllByUsuario_Id(Long usuarioId);

    Optional<Favorito> findByLinhaIdAndUsuario_Id(
            Long linhaId,
            Long usuarioId
    );

    Optional<Favorito> findByIdAndUsuario_Id(
            Long id,
            Long usuarioId
    );
}