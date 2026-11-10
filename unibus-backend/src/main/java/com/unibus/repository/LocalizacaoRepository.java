package com.unibus.repository;

import com.unibus.model.Localizacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalizacaoRepository extends JpaRepository<Localizacao, Long> {
    Optional<Localizacao> findFirstByOnibus_Linha_IdOrderByDataHoraDesc(Long linhaId);
}
