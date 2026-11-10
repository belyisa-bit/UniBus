
package com.unibus.service;

import com.unibus.dto.CadastroRequest;
import com.unibus.dto.LoginRequest;
import com.unibus.dto.AuthResponse;
import com.unibus.dto.UsuarioResponse;
import com.unibus.model.Usuario;
import com.unibus.repository.UsuarioRepository;
import com.unibus.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UsuarioResponse cadastrar(CadastroRequest request) {

        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                "Este e-mail já está cadastrado."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuario.setPapel("USER");

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponse(
            usuarioSalvo.getId(),
            usuarioSalvo.getNome(),
            usuarioSalvo.getEmail(),
            usuarioSalvo.getPapel()
        );
    }

    public AuthResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException(
                    "E-mail ou senha inválidos."
                ));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new IllegalArgumentException(
                "E-mail ou senha inválidos."
            );
        }

        String token = jwtService.gerarToken(usuario);

        return new AuthResponse(
            token,
            "Bearer",
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail()
        );
    }
}
