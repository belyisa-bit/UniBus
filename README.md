<p align="center">
  <img src="https://img.shields.io/badge/DEMO-ONLINE-22c55e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/BACKEND-SPRING%20BOOT-6DB33F?style=for-the-badge" />
  <img src="https://img.shields.io/badge/DATABASE-H2%20(DEV)-4169E1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FRONTEND-REACT%20%2B%20VITE-61DAFB?style=for-the-badge" />
</p>

<h1 align="center">🚌 UniBus</h1>
<h3 align="center">Qual linha te leva pro campus hoje?</h3>

<p align="center">
  Plataforma de consulta de transporte universitário, com informações sobre linhas, horários, paradas e localização de ônibus.<br/>
  Projeto acadêmico evolutivo desenvolvido para as entregas AV1 e AV2.
</p>

<p align="center">
  🔗 <a href="https://unibus-frontend-five.vercel.app/"><strong>Acessar a aplicação →</strong></a>
</p>

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Arquitetura e fluxo](#arquitetura-e-fluxo)
- [Stack tecnológica](#stack-tecnológica)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Rotas do frontend](#rotas-do-frontend)
- [Endpoints do backend](#endpoints-do-backend)
- [Localização e simulador GPS](#localização-e-simulador-gps)
- [Dados e persistência](#dados-e-persistência)
- [Como executar localmente](#como-executar-localmente)
- [Como testar a API](#como-testar-a-api)
- [Deploy](#deploy)
- [Limitações e próximos passos](#limitações-e-próximos-passos)
- [Equipe](#equipe)
- [Uso de inteligência artificial](#uso-de-inteligência-artificial)

---

## Sobre o projeto

O **UniBus — Transporte Universitário Inteligente** é uma aplicação voltada a estudantes que utilizam transporte universitário. A proposta é reunir informações que ajudem o estudante a consultar linhas, horários e paradas, além de permitir a evolução do sistema para acompanhar a localização dos ônibus.

O projeto está sendo desenvolvido de forma incremental: a primeira etapa utiliza dados locais no frontend; a evolução inclui uma API própria em Spring Boot, persistência em banco de dados e recursos de localização simulada para demonstração acadêmica.

A aplicação pode ser acessada pela versão publicada do frontend. O backend é executado separadamente e, no estado atual do projeto, o frontend ainda utiliza dados locais para as funcionalidades de linhas.

## Objetivos

- Centralizar informações úteis sobre o transporte universitário.
- Permitir a consulta de linhas, horários e paradas.
- Oferecer recursos como busca, filtros e favoritos.
- Desenvolver uma API REST própria para gerenciar os dados do sistema.
- Representar ônibus e registrar suas localizações geográficas.
- Demonstrar o funcionamento de localização por meio de um simulador GPS, sem depender de uma integração municipal real.

---

## Funcionalidades

| Funcionalidade | Situação no projeto |
|---|---|
| Página inicial do UniBus | Implementada no frontend |
| Listagem e detalhes de linhas | Implementadas no frontend com dados locais |
| Busca, filtro e ordenação de linhas | Disponíveis nos serviços do frontend |
| Favoritos com persistência no navegador | Implementados com `localStorage` |
| API REST de linhas, paradas e horários | Implementada no backend |
| API de avisos e favoritos | Implementada no backend |
| API de ônibus | Implementada no backend |
| API de localizações | Implementada no backend |
| API de alertas de carona | Implementada no backend |
| Simulador de GPS | Implementado no backend; gera posições simuladas periodicamente |
| Integração do frontend com a API | Ainda não concluída |
| Localização real fornecida pelas prefeituras | Depende de disponibilização de dados/API oficial |

> A localização gerada pelo simulador é fictícia e serve para desenvolvimento e demonstração. Ela não representa a posição real de um ônibus em operação.

---

## Arquitetura e fluxo

O repositório está organizado em duas aplicações: frontend e backend.

### Frontend

O React apresenta as páginas e utiliza dados locais para exibir as linhas. Os serviços e hooks do frontend apoiam operações como busca, filtros, ordenação e favoritos.

```text
Dados locais do frontend
        ↓
Services e hooks
        ↓
Páginas e componentes React
        ↓
Interface do UniBus
        ↓
Favoritos armazenados no localStorage
```

### Backend

A API foi desenvolvida com Spring Boot e organizada em camadas:

```text
Requisição HTTP
      ↓
Controller
      ↓
Service
      ↓
Repository (Spring Data JPA)
      ↓
Banco H2
```

- **Model:** entidades persistidas no banco.
- **Controller:** endpoints REST que recebem as requisições.
- **Service:** operações e regras de negócio.
- **Repository:** acesso aos dados por meio do Spring Data JPA.

O frontend e o backend podem ser executados separadamente. A interface publicada ainda não consome a API do backend.

---

## Stack tecnológica

### Frontend

- React
- JavaScript
- Vite
- React Router
- CSS

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- Lombok
- Maven
- Banco H2 em memória

### Ferramentas de desenvolvimento e teste

- Git e GitHub para versionamento
- Postman para testar endpoints REST

---

## Estrutura do repositório

```text
UniBus/
├── docs/
│   └── relacionamento-entidades.md
├── unibus-frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
└── unibus-backend/
    ├── src/
    │   ├── main/
    │   │   ├── java/com/unibus/
    │   │   │   ├── config/
    │   │   │   ├── controller/
    │   │   │   ├── model/
    │   │   │   ├── repository/
    │   │   │   ├── service/
    │   │   │   └── UnibusBackendApplication.java
    │   │   └── resources/
    │   │       ├── application.properties
    │   │       ├── dados.json
    │   │       └── data.sql
    │   └── test/
    ├── mvnw
    ├── mvnw.cmd
    └── pom.xml
```

### Principais entidades do backend

- `Linha`: representa uma linha de transporte.
- `Parada`: representa um ponto fixo do trajeto, incluindo coordenadas.
- `Horario`: representa horários associados a linhas e paradas.
- `Onibus`: representa um veículo e pode estar associado a uma linha.
- `Localizacao`: registra latitude, longitude, data/hora e o ônibus relacionado.
- `Aviso`: representa avisos relacionados ao transporte.
- `Favorito`: representa uma linha favoritada.
- `AlertaCarona`: representa um alerta de carona.

---

## Rotas do frontend

| Rota | Página | Descrição |
|---|---|---|
| `/` | Home | Apresenta a proposta do UniBus |
| `/linhas` | Linhas | Exibe a listagem de linhas |
| `/linhas/:id` | Detalhes da Linha | Exibe os detalhes de uma linha |

A navegação utiliza `react-router-dom`.

---

## Endpoints do backend

A API local utiliza o endereço-base `http://localhost:8081`.

| Recurso | Método | Endpoint | Descrição |
|---|---|---|---|
| Linhas | GET | `/api/linhas` | Lista linhas |
| Linhas | GET | `/api/linhas/{id}` | Busca uma linha por ID |
| Linhas | POST | `/api/linhas` | Cadastra uma linha |
| Linhas | DELETE | `/api/linhas/{id}` | Remove uma linha |
| Paradas | GET | `/api/paradas` | Lista paradas ativas |
| Paradas | GET | `/api/paradas/linha/{linhaId}` | Lista paradas de uma linha |
| Paradas | POST | `/api/paradas` | Cadastra uma parada |
| Paradas | DELETE | `/api/paradas/{id}` | Remove uma parada |
| Horários | GET | `/api/horarios/linha/{linhaId}` | Lista horários de uma linha |
| Horários | GET | `/api/horarios/parada/{paradaId}` | Lista horários de uma parada |
| Horários | POST | `/api/horarios` | Cadastra um horário |
| Horários | DELETE | `/api/horarios/{id}` | Remove um horário |
| Avisos | GET | `/api/avisos` | Lista avisos ativos |
| Avisos | GET | `/api/avisos/linha/{linhaId}` | Lista avisos de uma linha |
| Avisos | POST | `/api/avisos` | Cadastra um aviso |
| Favoritos | GET | `/api/favoritos` | Lista favoritos |
| Favoritos | GET | `/api/favoritos/linha/{linhaId}` | Busca favorito por linha |
| Favoritos | POST | `/api/favoritos` | Cadastra um favorito |
| Favoritos | DELETE | `/api/favoritos/{id}` | Remove um favorito |
| Ônibus | GET | `/api/onibus` | Lista ônibus |
| Ônibus | GET | `/api/onibus/{id}` | Busca um ônibus por ID |
| Ônibus | POST | `/api/onibus` | Cadastra um ônibus |
| Ônibus | DELETE | `/api/onibus/{id}` | Remove um ônibus |
| Localizações | GET | `/api/localizacoes` | Lista localizações registradas |
| Localizações | GET | `/api/localizacoes/{id}` | Busca uma localização por ID |
| Localizações | POST | `/api/localizacoes` | Registra uma localização |
| Localizações | DELETE | `/api/localizacoes/{id}` | Remove uma localização |
| Alertas de carona | GET | `/api/alertas-carona` | Lista alertas ativos |
| Alertas de carona | GET | `/api/alertas-carona/{id}` | Busca um alerta por ID |
| Alertas de carona | GET | `/api/alertas-carona/buscar?origem={origem}&destino={destino}` | Pesquisa alertas por trajeto |
| Alertas de carona | POST | `/api/alertas-carona` | Cadastra um alerta |
| Alertas de carona | PATCH | `/api/alertas-carona/{id}/desativar` | Desativa um alerta |

Os endpoints de cadastro recebem JSON no corpo da requisição. Para operações que exigem uma entidade relacionada, informe um ID existente no banco.

---

## Localização e simulador GPS

A localização foi modelada separadamente da entidade `Onibus`. Dessa forma, um ônibus pode possuir vários registros de localização ao longo do tempo.

Cada registro de `Localizacao` contém:

- `latitude`: coordenada geográfica, validada entre `-90` e `90`;
- `longitude`: coordenada geográfica, validada entre `-180` e `180`;
- `dataHora`: data e hora do registro;
- `onibus`: ônibus associado à localização.

### Simulador

O backend possui um `SimuladorGpsService`, habilitado pelo agendamento do Spring. O serviço gera coordenadas fictícias periodicamente (a cada 10 segundos) e salva os registros no banco H2.

O simulador utiliza uma posição-base definida no código e aplica pequenas variações aleatórias às coordenadas. Caso ainda não exista, cria um ônibus identificado como `ONIBUS_SIMULADO`.

> **Importante:** esse mecanismo é uma simulação para fins acadêmicos. Não utiliza GPS de um veículo real nem dados de uma API municipal.

---

## Dados e persistência

- **Frontend:** as informações das linhas utilizadas pela interface estão em `unibus-frontend/src/data/linhas.js`.
- **Favoritos no frontend:** são armazenados no `localStorage` do navegador.
- **Backend:** utiliza H2 em memória, configurado em `unibus-backend/src/main/resources/application.properties`.
- **Porta do backend:** `8081`.
- **Console H2:** disponível localmente em `http://localhost:8081/h2-console`, enquanto o backend estiver em execução.
- **Persistência do H2:** por ser um banco em memória (`jdbc:h2:mem:unibusdb`), os dados são temporários e podem ser perdidos ao reiniciar a aplicação.

---

## Como executar localmente

### Pré-requisitos

- Java 17
- Node.js e npm
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/belyisa-bit/UniBus.git
cd UniBus
```

### 2. Executar o frontend

Em um terminal:

```bash
cd unibus-frontend
npm install
npm run dev
```

O Vite exibirá o endereço local, normalmente:

```text
http://localhost:5173
```

### 3. Executar o backend

Em outro terminal, na raiz do repositório:

```bash
cd unibus-backend
```

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

No Linux/macOS:

```bash
./mvnw spring-boot:run
```

A API estará disponível em:

```text
http://localhost:8081
```

O frontend pode ser executado sem iniciar o backend, pois ainda utiliza dados locais para as páginas de linhas.

---

## Como testar a API

Com o backend em execução, utilize o Postman ou outra ferramenta HTTP.

### Exemplo: listar ônibus

```http
GET http://localhost:8081/api/onibus
```

### Exemplo: registrar localização

```http
POST http://localhost:8081/api/localizacoes
Content-Type: application/json
```

```json
{
  "latitude": -8.0553,
  "longitude": -34.9514,
  "dataHora": "2026-09-30T10:00:00",
  "onibus": {
    "id": 1
  }
}
```

O `onibus.id` deve corresponder a um ônibus existente no banco. A latitude e a longitude precisam estar dentro dos intervalos válidos.

### Testes sugeridos

1. Consultar a lista de ônibus e localizações.
2. Cadastrar um ônibus e consultar o registro criado.
3. Registrar uma localização associada a um ônibus existente.
4. Buscar um registro por ID.
5. Enviar coordenadas fora dos limites para verificar a validação.
6. Consultar novamente as localizações após o simulador gerar novos registros.

---

## Deploy

| Camada | Endereço | Situação |
|---|---|---|
| Frontend | [unibus-frontend-five.vercel.app](https://unibus-frontend-five.vercel.app/) | Publicado na Vercel |
| Backend | https://unibus-backend-55sx.onrender.com/ |Publicado na Render |

A aplicação publicada corresponde ao frontend. Para testar os endpoints do backend, execute-o localmente ou utilize um endereço de deploy caso ele seja disponibilizado futuramente.

---

## Limitações e próximos passos

- A interface do frontend ainda não consome a API Spring Boot; as páginas de linhas usam dados locais.
- O simulador GPS gera coordenadas fictícias e não representa a localização real dos ônibus.
- A API municipal de localização depende da disponibilidade de dados oficiais dos municípios.
- O banco H2 está configurado em memória para desenvolvimento; os dados não são persistidos após reinicializações.
- A integração entre frontend, API e visualização de localização no mapa é uma evolução prevista.
- Autenticação e rotas protegidas não estão descritas como funcionalidades implementadas no estado atual do código analisado.

---

## Equipe

| Integrante | Contato | Principais contribuições |
|---|---|---|
| Isabelle Victória | isabellevic69@gmail.com | Estruturação do projeto e Modelagem e desenvolvimento do backend | 
| Gabrielly Carneiro | gabriellyrcarneiros@gmail.com |componentes de layout e configuração de rotas |
| Geovanna Almeida | geovannaalmeidaa408@gmail.com | Hooks e services de dados do frontend |
| Josinaldo Xavier | josinaldoxavier215@gmail.com | Apoio geral no desenvolvimento |
| Gabriela Sabino | gabrielaaraujo@gmail.com | Criação de paginas no frontend |



## Uso de inteligência artificial

Durante o desenvolvimento, ferramentas de inteligência artificial foram utilizadas como apoio ao planejamento, à modelagem, à revisão de código, à organização de tarefas e à elaboração de documentação.

- **ChatGPT** — apoio no planejamento, divisão de tarefas e revisão de lógica.
- **Google Gemini Pro** — apoio na modelagem de dados e revisão de trechos de código.
- **Claude (Anthropic)** — apoio na organização do backlog, criação de dados fictícios, exemplos de endpoints e documentação.


---

<p align="center">Projeto acadêmico — Ciência da Computação • UniBus</p>
