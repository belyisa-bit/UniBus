# UniBus

Sistema desenvolvido para facilitar o acesso e a consulta de informações relacionadas ao transporte universitário, auxiliando estudantes na busca por localidades, linhas e demais informações do serviço.

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução do projeto](#execução-do-projeto)
- [Documentação](#documentação)
- [Projeto online](#projeto-online)
- [Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)
- [Testes](#testes)
- [Boas práticas](#boas-práticas)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Equipe](#equipe)
- [Repositório](#repositório)

---

## Sobre o projeto

O **UniBus** é uma aplicação desenvolvida com o objetivo de centralizar e facilitar o acesso às informações relacionadas ao transporte universitário.

A proposta é permitir que estudantes encontrem informações sobre localidades e linhas de transporte universitário, tornando a consulta mais organizada e acessível.

O projeto é dividido em:

- **Frontend:** responsável pela interface da aplicação.
- **Backend:** responsável pela lógica da aplicação e pelo gerenciamento dos dados.
- **Docs:** responsável pela documentação relacionada ao projeto.

---

## Objetivos

- Facilitar o acesso às informações sobre transporte universitário.
- Centralizar informações relacionadas às localidades e linhas.
- Melhorar a organização das informações de transporte.
- Proporcionar uma interface simples e acessível aos estudantes.
- Aplicar conhecimentos de desenvolvimento de software.
- Utilizar boas práticas de organização e versionamento de código.

---

## Funcionalidades

Entre as funcionalidades desenvolvidas no projeto estão:

- Consulta de informações sobre linhas de transporte universitário.
- Consulta de localidades atendidas.
- Exibição organizada das informações.
- Interface web para acesso às informações.
- Navegação entre diferentes páginas da aplicação.
- Integração entre frontend e backend.
- Organização do sistema em módulos.
- Documentação do projeto.

> As funcionalidades podem ser ampliadas conforme o desenvolvimento do projeto.

---

## Tecnologias

### Frontend

O frontend está localizado no diretório:

```text
unibus-frontend/
```

Tecnologias utilizadas:

- React
- React DOM
- Vite
- JavaScript
- HTML
- CSS
- React Leaflet
- React Router DOM
- ESLint

### Backend

O backend está localizado no diretório:

```text
unibus-backend/
```

Tecnologias utilizadas:

- Java 17
- Spring Boot 3.3.3
- Maven
- Spring Data JPA
- Spring Boot Validation
- H2 Database

O backend é responsável pelo processamento das informações da aplicação, gerenciamento dos dados e comunicação com o frontend.

### Ferramentas

- Git
- GitHub
- Visual Studio Code

---

## Estrutura do projeto

```text
UniBus/
│
├── unibus-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── unibus-backend/
│   ├── src/
│   ├── target/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── docs/
│   └── Documentação do projeto
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Pré-requisitos

Antes de executar o projeto, recomenda-se possuir instalado:

- Node.js
- npm
- Java 17
- Git
- Visual Studio Code ou outro editor de código

Para verificar as instalações:

```bash
node --version
npm --version
java --version
git --version
```

O backend possui Maven Wrapper, permitindo executar o projeto utilizando os arquivos `mvnw` e `mvnw.cmd`.

---

## Instalação

### Clonar o repositório

```bash
git clone https://github.com/belyisa-bit/UniBus.git
```

### Acessar a pasta do projeto

```bash
cd UniBus
```

### Instalar as dependências do frontend

```bash
cd unibus-frontend
npm install
```

---

## Execução do projeto

O projeto possui frontend e backend separados.

### Frontend

Acesse a pasta do frontend:

```bash
cd unibus-frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O Vite informará no terminal o endereço local para acessar a aplicação.

Outros comandos disponíveis:

```bash
npm run build
npm run lint
npm run preview
```

### Backend

Abra outro terminal e acesse a pasta do backend:

```bash
cd unibus-backend
```

No Windows, execute:

```cmd
mvnw.cmd spring-boot:run
```

O backend será iniciado pelo Spring Boot.

---

## Documentação

Os documentos relacionados ao projeto estão disponíveis na pasta:

```text
docs/
```

Essa pasta pode conter informações relacionadas a:

- Requisitos;
- Modelagem;
- Arquitetura;
- Relacionamento entre entidades;
- Decisões de desenvolvimento;
- Documentação técnica;
- Outras informações do projeto.

---

## Projeto online

A aplicação frontend possui publicação em ambiente online.

> URL da aplicação: atualizar com o endereço oficial atual do projeto.

---

## Fluxo de desenvolvimento

O projeto utiliza **Git e GitHub** para controle de versão.

Fluxo básico:

```text
1. Atualizar a branch principal
        ↓
2. Criar uma branch para a tarefa
        ↓
3. Desenvolver a alteração
        ↓
4. Testar
        ↓
5. Fazer o commit
        ↓
6. Enviar a branch para o GitHub
        ↓
7. Criar um Pull Request
        ↓
8. Revisar as alterações
        ↓
9. Realizar o merge
```

### Criar uma branch

```bash
git checkout main
git pull origin main
git checkout -b feat/nova-funcionalidade
```

### Verificar alterações

```bash
git status
```

### Adicionar alterações

```bash
git add .
```

### Criar um commit

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

### Enviar a branch para o GitHub

```bash
git push -u origin feat/nova-funcionalidade
```

---

## Testes

Antes de enviar uma alteração para o repositório:

- Verifique se a aplicação inicia corretamente.
- Teste as funcionalidades alteradas.
- Verifique se não existem erros no console.
- Confira a responsividade da interface.
- Confirme se frontend e backend estão funcionando corretamente.
- Execute o lint do frontend.

```bash
npm run lint
```

- Revise os arquivos modificados antes do commit.

---

## Boas práticas

Não envie para o GitHub:

- Senhas;
- Tokens;
- Chaves de API;
- Dados pessoais;
- Arquivos `.env` contendo informações sensíveis.

Também é recomendado:

- Criar uma branch específica para cada tarefa.
- Utilizar mensagens de commit claras.
- Revisar as alterações antes do Pull Request.
- Manter a documentação atualizada.
- Evitar alterações não relacionadas à tarefa.
- Testar as alterações antes de enviá-las ao repositório.

---

## Contribuição

Para contribuir com o projeto:

1. Atualize a branch principal.
2. Crie uma branch específica para sua alteração.
3. Desenvolva a funcionalidade.
4. Teste as alterações.
5. Faça um commit seguindo um padrão de mensagens.
6. Envie a branch para o GitHub.
7. Abra um Pull Request.
8. Aguarde a revisão das alterações.

---

## Licença

Este projeto está disponibilizado sob a **licença MIT**.

Consulte o arquivo [`LICENSE`](LICENSE) para obter mais informações.

---

## Equipe

Projeto desenvolvido por estudantes de **Ciência da Computação**.

O desenvolvimento utiliza práticas de:

- Versionamento de código;
- Documentação;
- Organização de branches;
- Commits;
- Pull Requests;
- Revisão de código através do GitHub.

---

## Repositório

Repositório oficial:

**UniBus**

https://github.com/belyisa-bit/UniBus

---

## UniBus

**Facilitando o acesso às informações do transporte universitário.**