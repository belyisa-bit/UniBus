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
- **Alertas de carona na API**: cadastro, busca e desativação; não há tela de caronas integrada nesta versão.
- **Faculdades**: página com as instituições atendidas.
- **Carga inicial demonstrativa local** de linhas, horários e referências de embarque (`DadosLocaisInitializer`).
- **Tratamento global de erros** na API (`GlobalExceptionHandler`).

---

## Arquitetura

```
┌────────────────────┐   HTTPS + JWT    ┌──────────────────────────┐
│ Frontend (React)   │ ───────────────▶ │ Backend (Spring Boot)    │
│ Vercel             │ ◀─────────────── │ Render                   │
│ fetch + Leaflet    │      JSON        │ Controller → Service →   │
└────────────────────┘                  │ Repository → JPA         │
                                        └────────────┬─────────────┘
                                                     │
                                        H2 (local) / PostgreSQL (Render)
```

**Frontend:** `pages` e `components` compõem a interface; `hooks` gerenciam estado e cancelamento; `services/api.js` concentra `fetch`, URL-base e o header `Authorization: Bearer`. Não há chamadas HTTP espalhadas nas páginas.

**Opção aprovada pela equipe para a AV2:** integração com backend próprio, desenvolvido pela equipe em Spring Boot. A entrega final parte da `main`. O tema e o repositório da AV1 foram preservados.

**Backend:** `controller` (REST) → `service` (regras de negócio) → `repository` (Spring Data JPA) → `model` (entidades). Segurança em `config` e `security`.

---

## Stack tecnológica

### Frontend
| Tecnologia | Uso |
|---|---|
| React 19 | Interface |
| Vite | Build e dev server |
| React Router 7 | Rotas e rotas protegidas |
| Fetch API | Cliente HTTP centralizado em `services/api.js` |
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

### Contrato consumido pelo frontend

JSON em UTF-8, com `Content-Type: application/json` nas requisições com corpo. IDs de banco são identificadores próprios; não correspondem aos IDs do catálogo demonstrativo do navegador.

| Operação | Entrada / resposta usada |
|---|---|
| `POST /api/auth/cadastro` | `{nome, email, senha}`; nome obrigatório, e-mail válido, senha com pelo menos 8 caracteres; sucesso 201, validação 400, duplicado 409 |
| `POST /api/auth/login` | `{email, senha}` → `{token, id, nome, email}`; sucesso 200, credenciais inválidas 401 |
| `GET /api/linhas` | Array de `{id, codigo, nome, empresa, ativa, zona, campus}`; `[]` é sucesso sem registros |
| `GET /api/horarios/linha/{id}` | Array de horários com `hora` (`HH:mm`), `diaSemana` (`MONDAY` etc.), `sentido` (`IDA`, `VOLTA`/`RETORNO`) e `ativo` |
| `GET /api/paradas/linha/{id}` | Array com `id`, `nome`, `endereco`, `ativa` e associação às linhas |

O cliente retorna `{data, status}` ao consumidor. Erros de negócio da API usam `{mensagem}`; validações usam um mapa campo → mensagem. Respostas de segurança podem não conter JSON. O frontend encerra a sessão em 401 fora do login e apresenta falta de permissão em 403. Atualmente o backend responde 403 ao acesso anônimo/inválido a endpoints protegidos, e 401 para credenciais incorretas no login.

### Evolução AV1 → AV2

| Área | AV1 / base local | AV2 atual |
|---|---|---|
| Catálogo | Dados em `src/data` | Listagem e detalhes consultam API própria; fallback explícito |
| Horários e paradas | Campos locais | Endpoints dedicados, carregamento, erro, ausência de cadastro e nova tentativa |
| Autenticação | Navegação inicial | Cadastro/login JWT, restauração de sessão, logout e rotas protegidas |
| HTTP | Dados locais | `fetch` centralizado, URL-base configurável e tratamento 401/403 |
| Apresentação | Rotas demonstrativas | H2 local com 30 rotas e 300 horários; referência clara de demonstração |
| Home, Faculdades, favoritos e avisos | Dados/armazenamento local | Mantidos; sincronização completa com backend é uma limitação declarada |
| Mapa | Simulação | Simulação preservada, sem alegação de GPS real |
| Qualidade | Testes de regras locais | Regressões de integração, autenticação, segurança e carga local |

---

## Localização e simulador GPS

O `SimuladorGpsService` mantém uma simulação independente no backend; `GET /api/linhas/{id}/localizacao` disponibiliza posições simuladas. O mapa atual **não consome esse endpoint**: usa `data/rotasGpsDemo.js` e `MapaLinhaDemo` para interpolar coordenadas aproximadas do trajeto selecionado. Não representa GPS real, velocidade real ou percurso pelas ruas. O intervalo da animação é cancelado ao desmontar o componente ou pausar a simulação.

---

## Dados e persistência

- **Local:** H2 em memória, com console em `/h2-console`. `DadosLocaisInitializer` carrega 30 rotas e 300 horários demonstrativos (ida e volta de segunda a sexta). A carga só ocorre se não houver linhas. Reiniciar o servidor apaga contas e dados desse banco em memória.
- **Produção (Render):** PostgreSQL, configurado pelo perfil `render`.
- **Favoritos e avisos:** as telas atuais persistem em `localStorage`; não estão sincronizadas com os endpoints correspondentes. São dados por navegador, não por conta.
- **Home e Faculdades:** continuam utilizando o catálogo local. Links com `?fonte=local` preservam essa identidade; um ID local nunca é usado como se fosse o mesmo ID da API.
- **Linhas e Detalhes:** usam o catálogo da API, com consultas específicas de horários e paradas. Uma lista vazia válida é exibida como vazia; não ativa contingência.

### Contingência para apresentação

Se o catálogo remoto falhar por rede ou erro recuperável, a listagem informa o problema e oferece o catálogo local e o botão **Tentar novamente**. Ao recuperar a conexão, o botão consulta novamente a API. Os detalhes remotos não são substituídos por outra rota local com ID coincidente: exibem erro e nova tentativa. Respostas 401/403 não ativam contingência.

Horários são consultados apenas para as linhas visíveis e apresentados para o dia atual. A ausência de cadastro não é preenchida com horários inventados. O mapa pode depender da internet para os blocos do OpenStreetMap, mesmo em modo local.

O snapshot do backend em `src/main/resources/demo/linhas.json` vem dos dados do frontend. Para atualizá-lo, execute na pasta `unibus-frontend`: `node scripts/exportar-dados-demo.mjs`. Cidades sem pontos cadastrados mostram uma referência explícita de embarque a confirmar. Essa carga é exclusiva do perfil `local`, não preenche o banco publicado.

Veja [`docs/estrutura-dados-persistencia.md`](docs/estrutura-dados-persistencia.md).

---

## Como executar localmente

### Pré-requisitos
- Node.js 22.12+ (ou 24 LTS) e npm
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
| `UNIBUS_JWT_SECRET` | Chave Base64 de pelo menos 32 bytes (**obrigatória em produção**, também aceita `JWT_SECRET` no Render) | chave aleatória temporária apenas no perfil local |
| `JWT_EXPIRATION_MS` | Validade do token | `86400000` |
| `UNIBUS_CORS_ALLOWED_ORIGINS` | Origens permitidas no CORS | localhost e Vercel |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexão PostgreSQL (perfil `render`) | — |

### Frontend
| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base do backend, sem `/api` (ex.: `http://localhost:8081`) |

Exemplos disponíveis em `unibus-frontend/.env.example` e `unibus-backend/.env.example`. Vite carrega o `.env` do frontend; Spring Boot exige variáveis exportadas no processo, na IDE ou no painel da hospedagem. Variáveis `VITE_*` são públicas: nunca coloque senhas ou chaves nelas. `.env` e arquivos de credenciais são ignorados pelo Git.

---

## Testes

```bash
# Backend
cd unibus-backend && ./mvnw test

# Frontend (em outro terminal, partindo da raiz)
cd unibus-frontend
npm ci
npm test
npm run lint
npm run build
```

Os testes do frontend cobrem busca, horários, origem dos dados, contingência, respostas 401/403 e sessão. O backend inclui testes de controllers, simulador e carga local, com consulta dos endpoints e verificação de que a carga não duplica registros. O roteiro de apresentação e as pendências externas estão em [docs/entrega-av2.md](docs/entrega-av2.md).

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
