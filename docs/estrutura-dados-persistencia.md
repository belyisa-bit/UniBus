# Estrutura de Dados e Persistência — KAN-55

## 1. Visão geral

O UniBus organiza os dados da aplicação em módulos JavaScript dentro de
`src/data` e utiliza um Hook personalizado para gerenciar os favoritos.
A persistência dos favoritos é realizada no navegador por meio de
`localStorage`.

> **Observação:** o projeto não possui um arquivo `dados.json`. Os dados
> analisados estão organizados em arquivos `.js`.

## 2. Arquivos principais

- `src/data/linhas.js` — cidades, horários, rotas, faculdades e geração
  das linhas.
- `src/data/pontosEmbarque.js` — pontos de embarque organizados por
  cidade.
- `src/data/rotasGPSDemo.js` — coordenadas e percursos demonstrativos de
  GPS.
- `src/hooks/useFavoritos.js` — gerenciamento dos favoritos e
  persistência.
- `src/services/linhasService.js` — arquivo relacionado ao fluxo de
  dados das linhas, importado por `rotasGPSDemo.js`.

## 3. `src/data/linhas.js`

Organiza informações de transporte usando arrays e objetos JavaScript.

Entre os dados estão:

- cidade de origem;
- horário de saída;
- horário de retorno;
- rotas;
- identificadores e nomes das rotas;
- faculdades atendidas;
- status da linha.

`modeloRotas` relaciona localidades, números de rota e faculdades.
`cidades` reúne as origens, horários e rotas. O arquivo utiliza
`flatMap()` para transformar os dados das cidades e rotas em uma
estrutura de linhas.

## 4. `src/data/pontosEmbarque.js`

Exporta `pontosEmbarquePorCidade`, relacionando cada cidade a uma lista
de pontos de embarque.

Exemplo de estrutura:

``` javascript
{
  Condado: [
    "Banco do Brasil",
    "Garagem Municipal"
  ],
  Alianca: [
    "Trevo",
    "Rodoviaria de Alianca",
    "Praca do Clube"
  ]
}
```

## 5. `src/data/rotasGPSDemo.js`

Contém dados e lógica para demonstrar percursos de GPS. Trabalha com
coordenadas de origens, pontos de embarque e faculdades, além de
identificadores das linhas.

A função `interpolarPercurso(pontos)` calcula pontos intermediários para
formar um percurso demonstrativo.

A estrutura `rotasGpsDemo` reúne informações como `rotaId`,
`demonstrativa`, `pontos` e `percurso`.

## 6. `src/hooks/useFavoritos.js`

É um Hook personalizado do React responsável pelo gerenciamento das
linhas favoritas.

Utiliza:

``` javascript
import { useState } from "react";
```

e importa as linhas de `../data/linhas`.

As principais funções são:

- `adicionarFavorito()`;
- `removerFavorito()`;
- `verificarFavorito()`.

O estado é controlado com `useState`:

``` javascript
const [estado, setEstado] = useState(lerFavoritos);
```

## 7. Persistência com `localStorage`

A chave usada para os favoritos é:

``` javascript
const chaveFavoritos = "unibus-favoritos";
```

### Recuperação

O Hook usa:

``` javascript
localStorage.getItem(chaveFavoritos);
```

e depois:

``` javascript
JSON.parse(salvo);
```

Fluxo:

``` text
localStorage → getItem() → JSON.parse() → dados JavaScript
```

### Salvamento

Quando os favoritos são alterados, utiliza:

``` javascript
localStorage.setItem(...)
```

e `JSON.stringify()` para transformar os dados em uma string JSON.

Fluxo:

``` text
dados JavaScript → JSON.stringify() → setItem() → localStorage
```

## 8. Tratamento de erros

`useFavoritos.js` possui tratamento de erros para situações em que os
favoritos não possam ser recuperados ou salvos corretamente. Em caso de
falha na leitura, o Hook pode retornar uma lista vazia e uma mensagem de
aviso.

## 9. Fluxo completo

``` text
Dados das linhas
      ↓
useFavoritos
      ↓
Estado dos favoritos
      ↓
JSON.stringify()
      ↓
localStorage
```

Na recuperação:

``` text
localStorage
      ↓
getItem()
      ↓
JSON.parse()
      ↓
IDs dos favoritos
      ↓
Linhas correspondentes
      ↓
Estado do React
```

## 10. Resumo para a AV2

**Hook:** recurso do React usado para trabalhar com lógica e estado.

**useState:** Hook usado para controlar estado.

**localStorage:** API do navegador para armazenamento local.

**getItem():** recupera um valor do `localStorage`.

**setItem():** salva ou atualiza um valor no `localStorage`.

**JSON.parse():** transforma uma string JSON em um valor JavaScript.

**JSON.stringify():** transforma um valor JavaScript em uma string JSON.

**Chave dos favoritos:** `unibus-favoritos`.

**Hook de favoritos:** `src/hooks/useFavoritos.js`.

**Dados das linhas:** `src/data/linhas.js`.

**Pontos de embarque:** `src/data/pontosEmbarque.js`.

**Rotas GPS demonstrativas:** `src/data/rotasGPSDemo.js`.

## 11. Resumo da arquitetura

``` text
src/data
├── linhas.js
├── pontosEmbarque.js
└── rotasGPSDemo.js
        ↓
Dados da aplicação
        ↓
src/hooks/useFavoritos.js
        ↓
useState + funções de favoritos
        ↓
localStorage
├── getItem()
└── setItem()
```

## 12. Conclusão

O UniBus separa os dados, a lógica de estado e a persistência. Os
arquivos da pasta `data` organizam as informações utilizadas pela
aplicação; o Hook `useFavoritos` concentra a lógica dos favoritos; e o
`localStorage` mantém esses favoritos armazenados no navegador entre
carregamentos da aplicação.
