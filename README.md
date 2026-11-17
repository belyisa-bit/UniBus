<p align="center">
  <img src="https://img.shields.io/badge/DEMO-ONLINE-22c55e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/BACKEND-SPRING%20BOOT-6DB33F?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AUTH-JWT-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/DATABASE-H2%20(DEV)%20%7C%20POSTGRESQL-4169E1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FRONTEND-REACT%20%2B%20VITE-61DAFB?style=for-the-badge" />
</p>

<h1 align="center">🚌 UniBus</h1>
<h3 align="center">Qual linha te leva pro campus hoje?</h3>

<p align="center">
  Plataforma de consulta de transporte universitário: linhas, horários, paradas, avisos, caronas e localização de ônibus em mapa.<br/>
  Projeto acadêmico evolutivo desenvolvido para as entregas AV1 e AV2.
</p>

<p align="center">
  🔗 <a href="https://unibus-frontend-five.vercel.app/"><strong>Acessar a aplicação →</strong></a>
</p>

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Stack tecnológica](#stack-tecnológica)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Autenticação e segurança](#autenticação-e-segurança)
- [Rotas do frontend](#rotas-do-frontend)
- [Endpoints do backend](#endpoints-do-backend)
- [Localização e simulador GPS](#localização-e-simulador-gps)
- [Dados e persistência](#dados-e-persistência)
- [Como executar localmente](#como-executar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Testes](#testes)
- [Deploy](#deploy)
- [Limitações e próximos passos](#limitações-e-próximos-passos)
- [Equipe](#equipe)
- [Uso de inteligência artificial](#uso-de-inteligência-artificial)

---

## Sobre o projeto

O **UniBus** ajuda estudantes a descobrir qual linha de ônibus os leva ao campus, em quais horários, por quais paradas e onde o veículo está agora.

O sistema é dividido em duas aplicações independentes:

- **Frontend** em React + Vite, publicado na Vercel.
- **Backend** em Spring Boot com API REST e autenticação JWT, publicado na Render.

Na versão atual, o frontend já está **integrado ao backend**: o login gera um token JWT, as rotas internas são protegidas e a lista de linhas é consumida da API.

---

## Funcionalidades

- **Cadastro e login** de usuários com senha criptografada e sessão via token JWT.
- **Rotas protegidas** no frontend: apenas usuários autenticados acessam as telas internas.
- **Consulta de linhas** com detalhes por linha, paradas e horários.
- **Mapa interativo** (Leaflet) com a rota e a posição dos ônibus.
- **Simulador de GPS** que movimenta os ônibus automaticamente a cada 10 segundos.
- **Favoritos**: o usuário marca linhas de interesse (hook `useFavoritos`).
- **Avisos** sobre as linhas (atrasos, mudanças de itinerário etc.).
- **Alertas de carona**: cadastro, busca e desativação.
- **Faculdades**: página com as instituições atendidas.
- **Carga inicial de dados** de exemplo (`LinhasExemploInitializer`, `data.sql`, `dados.json`).
- **Tratamento global de erros** na API (`GlobalExceptionHandler`).

---

## Arquitetura

```
┌────────────────────┐   HTTPS + JWT    ┌──────────────────────────┐
│ Frontend (React)   │ ───────────────▶ │ Backend (Spring Boot)    │
│ Vercel             │ ◀─────────────── │ Render                   │
│ axios + Leaflet    │      JSON        │ Controller → Service →   │
└────────────────────┘                  │ Repository → JPA         │
                                        └────────────┬─────────────┘
                                                     │
                                        H2 (local) / PostgreSQL (Render)
```

**Frontend:** `pages` (telas) → `components` (UI reutilizável) → `services` (chamadas HTTP via axios, com interceptor que anexa o token em `Authorization`) → `hooks` (estado, como favoritos).

**Backend:** `controller` (REST) → `service` (regras de negócio) → `repository` (Spring Data JPA) → `model` (entidades). Segurança em `config` e `security`.

---

## Stack tecnológica

### Frontend
| Tecnologia | Uso |
|---|---|
| React 19 | Interface |
| Vite | Build e dev server |
| React Router 7 | Rotas e rotas protegidas |
| Axios | Cliente HTTP |
| Leaflet + React-Leaflet | Mapas |
| ESLint | Qualidade de código |

### Backend
| Tecnologia | Uso |
|---|---|
| Java 17 | Linguagem |
| Spring Boot (Web, Data JPA, Validation) | API REST |
| Spring Security + JJWT 0.12 | Autenticação JWT |
| H2 | Banco em memória (perfil `local`) |
| PostgreSQL | Banco em produção (perfil `render`) |
| Maven (wrapper) | Build |
| Docker | Empacotamento para deploy |

---

## Estrutura do repositório

```
UniBus/
├── docs/
│   ├── estrutura-dados-persistencia.md
│   └── relacionamento-entidades.md
├── unibus-backend/
│   ├── Dockerfile
│   └── src/main/java/com/unibus/
│       ├── config/        # Security, CORS (WebConfig), PasswordEncoder
│       ├── controller/    # Auth, Usuario, Linha, Parada, Horario, Onibus,
│       │                  # Localizacao, Aviso, Favorito, AlertaCarona
│       ├── dto/           # LoginRequest, CadastroRequest, AuthResponse, UsuarioResponse
│       ├── exception/     # GlobalExceptionHandler
│       ├── model/         # Entidades JPA
│       ├── repository/    # Repositórios Spring Data
│       ├── security/      # JwtService, JwtAuthenticationFilter
│       └── service/       # Regras de negócio, SimuladorGpsService, inicializador de dados
├── unibus-frontend/
│   └── src/
│       ├── components/    # Badge, Button, Card, Input, Header, Footer,
│       │                  # FavoritosLinhas, MapaLinhaDemo, ProtectedRoute
│       ├── data/          # Dados locais e rotas GPS de demonstração
│       ├── hooks/         # useFavoritos
│       ├── pages/         # Entrada, Login, Cadastro, Home, Linhas,
│       │                  # DetalhesLinha, Faculdades, Avisos
│       └── services/      # api, authService, linhaService, avisoService, unibusService
└── README.md
```

### Principais entidades

`Usuario`, `Linha`, `Parada`, `Horario`, `Onibus`, `Localizacao`, `Aviso`, `Favorito` e `AlertaCarona`. Detalhes em [`docs/relacionamento-entidades.md`](docs/relacionamento-entidades.md).

---

## Autenticação e segurança

1. O usuário se cadastra em `POST /api/auth/cadastro` e entra em `POST /api/auth/login`.
2. O backend devolve um **token JWT** (validade padrão de 24h).
3. O frontend guarda o token no `localStorage` (`unibus-token`) e o anexa automaticamente em toda requisição.
4. O `JwtAuthenticationFilter` valida o token em cada chamada.
5. No frontend, o componente `ProtectedRoute` redireciona usuários não autenticados.

**Regras de acesso na API:**

| Acesso | Endpoints |
|---|---|
| Público | `/api/auth/**` e todas as requisições `GET` de linhas, paradas, horários, localizações, ônibus, avisos e alertas de carona |
| Autenticado | Qualquer outra requisição (criar, remover, favoritos, usuários etc.) |

Senhas são armazenadas com hash (`PasswordEncoder`) e o CORS é configurável por variável de ambiente.

---

## Rotas do frontend

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Pública | Tela de entrada |
| `/login` | Pública | Login |
| `/cadastro` | Pública | Cadastro |
| `/home` | Protegida | Painel inicial |
| `/linhas` e `/rotas` | Protegida | Lista de linhas |
| `/linhas/:id` | Protegida | Detalhes, paradas, horários e mapa |
| `/faculdades` | Protegida | Faculdades atendidas |
| `/avisos` | Protegida | Avisos |

---

## Endpoints do backend

URL base local: `http://localhost:8081`

| Recurso | Método e rota |
|---|---|
| **Auth** | `POST /api/auth/cadastro` · `POST /api/auth/login` |
| **Usuários** | `POST /api/usuarios` |
| **Linhas** | `GET /api/linhas` · `GET /api/linhas/{id}` · `GET /api/linhas/{id}/localizacao` · `POST /api/linhas` · `DELETE /api/linhas/{id}` |
| **Paradas** | `GET /api/paradas` · `GET /api/paradas/linha/{linhaId}` · `POST` · `DELETE /{id}` |
| **Horários** | `GET /api/horarios/linha/{linhaId}` · `GET /api/horarios/parada/{paradaId}` · `POST` · `DELETE /{id}` |
| **Ônibus** | `GET /api/onibus` · `GET /api/onibus/{id}` · `POST` · `DELETE /{id}` |
| **Localizações** | `GET /api/localizacoes` · `GET /api/localizacoes/{id}` · `POST` · `DELETE /{id}` |
| **Avisos** | `GET /api/avisos` · `GET /api/avisos/linha/{linhaId}` · `POST` |
| **Favoritos** | `GET /api/favoritos` · `GET /api/favoritos/linha/{linhaId}` · `POST` · `DELETE /{id}` |
| **Alertas de carona** | `GET /api/alertas-carona` · `GET /{id}` · `GET /buscar` · `POST` · `PATCH /{id}/desativar` |

> Rotas `GET` listadas em "Autenticação e segurança" são públicas; as demais exigem o header `Authorization: Bearer <token>`.

---

## Localização e simulador GPS

O `SimuladorGpsService` usa `@Scheduled(fixedRate = 10000)` para aplicar uma pequena variação de latitude/longitude nos ônibus a cada **10 segundos**, simulando movimento real. O frontend exibe essas posições no mapa (Leaflet), e `GET /api/linhas/{id}/localizacao` retorna a posição atual dos ônibus da linha.

Há também rotas de demonstração no frontend (`data/rotasGpsDemo.js`) usadas pelo componente `MapaLinhaDemo`.

---

## Dados e persistência

- **Local:** H2 em memória, com console em `/h2-console`. Os dados são recriados a cada execução e populados por `data.sql` e `LinhasExemploInitializer`.
- **Produção (Render):** PostgreSQL, configurado pelo perfil `render`.
- **Favoritos e avisos** também usam `localStorage` no frontend como apoio.

Veja [`docs/estrutura-dados-persistencia.md`](docs/estrutura-dados-persistencia.md).

---

## Como executar localmente

### Pré-requisitos
- Node.js 18+ e npm
- Java 17+ (o Maven wrapper já está incluso)

### 1. Clonar
```bash
git clone https://github.com/belyisa-bit/UniBus.git
cd UniBus
```

### 2. Backend
```bash
cd unibus-backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```
Sobe em `http://localhost:8081` com o perfil `local` (H2).

### 3. Frontend
```bash
cd unibus-frontend
cp .env.example .env          # ajuste VITE_API_URL se necessário
npm install
npm run dev
```
Abre em `http://localhost:5173`.

---

## Variáveis de ambiente

### Backend
| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor | `8081` |
| `SPRING_PROFILES_ACTIVE` | `local` ou `render` | `local` |
| `UNIBUS_JWT_SECRET` | Segredo do JWT (**defina em produção**) | valor de desenvolvimento |
| `JWT_EXPIRATION_MS` | Validade do token | `86400000` |
| `UNIBUS_CORS_ALLOWED_ORIGINS` | Origens permitidas no CORS | localhost e Vercel |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexão PostgreSQL (perfil `render`) | — |

### Frontend
| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base do backend, sem `/api` (ex.: `http://localhost:8081`) |

---

## Testes

```bash
# Backend
cd unibus-backend && ./mvnw test

# Frontend (lint)
cd unibus-frontend && npm run lint
```

Testes existentes: `SimuladorGpsServiceTest`, `AlertaCaronaServiceTest`, `AvisoServiceTest`, `UnibusBackendApplicationTests` e `linhaService.test.js`.

### Exemplo rápido de API
```bash
# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","senha":"suaSenha"}'

# Rota protegida com token
curl http://localhost:8081/api/favoritos -H "Authorization: Bearer <token>"
```

---

## Deploy

| Camada | Endereço | Plataforma |
|---|---|---|
| Frontend | [unibus-frontend-five.vercel.app](https://unibus-frontend-five.vercel.app/) | Vercel |
| Backend | [unibus-backend-55sx.onrender.com](https://unibus-backend-55sx.onrender.com/) | Render (Docker + PostgreSQL) |

> No plano gratuito da Render, a primeira requisição após inatividade pode demorar alguns segundos.

---

## Limitações e próximos passos

- A localização dos ônibus é **simulada**; integrar GPS real ou API de transporte.
- Migrar o restante das telas (avisos, favoritos) para a API, reduzindo o uso de dados locais.
- Controle de permissões por perfil (ex.: administrador para criar linhas e avisos).
- Ampliar a cobertura de testes (frontend e integração).
- Substituir `ddl-auto=update` por migrations (Flyway/Liquibase).
- Notificações em tempo real (WebSocket) para avisos e chegada de ônibus.

---

## Equipe

| Integrante | Matrícula | Principais contribuições |
|---|---|---|
| Isabelle Victória | 01808806 | Estruturação do projeto, modelagem e desenvolvimento do backend |
| Gabrielly Carneiro | 01797929 | Componentes de layout e configuração de rotas |
| Geovanna Almeida | 01815451 | Criação de páginas no frontend |
| Josinaldo Xavier | 01823400 | Apoio geral no desenvolvimento |
| Gabriela Sabino | 01660021 | Hooks e services de dados do frontend e backend |

---

## Uso de inteligência artificial

Ferramentas de IA foram usadas como apoio ao planejamento, modelagem, revisão de código, organização de tarefas e documentação.

- **ChatGPT** — planejamento, divisão de tarefas e revisão de lógica.
- **Google Gemini Pro** — modelagem de dados e revisão de trechos de código.
- **Claude (Anthropic)** — organização do backlog, dados fictícios, exemplos de endpoints e documentação.

---

<p align="center">Projeto acadêmico — Ciência da Computação • UniBus</p>
