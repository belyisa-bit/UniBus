CREATE TABLE IF NOT EXISTS teste_conexao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mensagem VARCHAR(255) NOT NULL
);

INSERT INTO teste_conexao (mensagem) VALUES ('Banco de dados H2 configurado com sucesso no UniBus!');