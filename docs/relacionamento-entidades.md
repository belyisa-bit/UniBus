# Relacionamento entre Entidades

## Linha e Parada

A entidade `Linha` possui um relacionamento muitos-para-muitos (`ManyToMany`) com a entidade `Parada`.

Uma linha pode possuir várias paradas, e uma parada pode estar associada a várias linhas.

Esse relacionamento é realizado por meio da tabela intermediária `parada_linhas`.

- Entidade: `Linha`
- Entidade: `Parada`
- Tipo de relacionamento: `ManyToMany`
- Tabela intermediária: `parada_linhas`
- Coluna da parada: `parada_id`
- Coluna da linha: `linha_id`

## Linha e Favorito

A entidade `Favorito` está associada a uma `Linha` por meio do campo `linhaId`.

A restrição única `uk_favorito_linha` garante que uma mesma linha não seja cadastrada mais de uma vez como favorito.

- Entidade: `Linha`
- Entidade: `Favorito`
- Tipo de relacionamento: associação por identificador
- Chave utilizada: `linha_id`

## Linha e Aviso

A entidade `Aviso` está associada a uma `Linha` por meio do campo `linhaId`.

O aviso registra informações relacionadas à linha, como o tipo do aviso, sua descrição e a data e hora do aviso.

- Entidade: `Linha`
- Entidade: `Aviso`
- Tipo de relacionamento: associação por identificador
- Chave utilizada: `linhaId`

## Linha e Horário

A entidade `Horario` está associada a uma `Linha` e a uma `Parada`.

O horário possui informações como dia da semana, hora e sentido da viagem.

- Entidade: `Linha`
- Entidade: `Parada`
- Entidade: `Horario`
- Tipo de relacionamento: associação entre linha, parada e horário
