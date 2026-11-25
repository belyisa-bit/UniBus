package com.unibus.service;

import com.unibus.security.JwtService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtConfiguracaoTest {
    @Test
    void chaveTemporariaSoEPermitidaQuandoExplicitamenteHabilitada() {
        assertDoesNotThrow(() -> new JwtService("", 86400000, true));
        assertThrows(IllegalArgumentException.class, () -> new JwtService("", 86400000, false));
        assertThrows(RuntimeException.class, () -> new JwtService("invalida", 86400000, false));
    }
}
