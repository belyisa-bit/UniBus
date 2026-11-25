# Entrega AV2 — UniBus

## Escopo confirmado

- Opção: integração com backend próprio criado pela equipe, em Spring Boot (confirmado pela equipe em 25/11/2026).
- Repositório e tema da AV1 preservados. Base da entrega: `main`.
- A versão final deve ser identificada pela tag `entrega-av2`, após validação e integração das correções.

## Evidências e limites

| Requisito | Evidência |
|---|---|
| API e `fetch` centralizado | `src/services/api.js`, `unibusService.js`, `catalogoService.js` |
| URL-base configurável | `VITE_API_URL`, `unibus-frontend/.env.example` |
| Configuração do backend | `unibus-backend/.env.example`; variáveis do processo/painel |
| Carregamento, sucesso, vazio e erro | Linhas/Detalhes; sucesso representado pelo conteúdo, sem mensagem técnica repetitiva |
| Nova tentativa e contingência | Botões de consulta e catálogo demonstrativo; 401/403 não são ocultados pelo fallback |
| Login, sessão, rota protegida, logout | Login, `authService`, `ProtectedRoute`, Header e filtro JWT no servidor |
| Sessão após refresh | Token e dados mínimos no navegador; senha não é persistida pelo frontend |
| Segurança | Hash de senha no servidor, chave temporária somente local; produção exige segredo configurado |
| Dados de apresentação | 30 rotas locais, horários de ida/volta em dias úteis, referências de embarque identificadas |
| Evolução e contrato | README, tabelas de contrato e AV1 → AV2 |
| Participação | Histórico Git consultado: Isabelle, Gabrielly, Geovanna, Josinaldo e Gabriela têm commits; aliases de nome não representam pessoas extras |

Os fluxos usuais no navegador foram conferidos pelo integrante responsável em 25/11/2026. As falhas visuais relatadas depois disso foram corrigidas. A revisão automática não substitui teste visual em todos os dispositivos nem comprova que todos os integrantes já ensaiaram.

Validação local em 25/11/2026: 40 testes do frontend e 12 do backend passaram; lint e build do frontend passaram. Os testes incluem falha de rede, catálogo vazio, nova tentativa, 401/403, sessão e carga de dados. A inspeção de padrões de credenciais não encontrou tokens ou chaves privadas nos arquivos versionados; isso não equivale a uma auditoria de segurança completa. A chave fixa de desenvolvimento foi substituída por geração temporária no perfil local.

## Roteiro de apresentação

1. Explicar o problema: estudantes consultam transporte universitário em um único lugar.
2. Mostrar cadastro/login, erro de credenciais, acesso protegido e sessão preservada após atualizar.
3. Mostrar Linhas: buscar Condado, filtrar faculdade e abrir detalhes correspondentes.
4. Demonstrar horários e embarques vindos da API. Informar que a carga local é demonstrativa e usa dias úteis.
5. Mostrar o mapa e deixar explícito que é simulado, sem GPS real.
6. Mostrar favoritos e avisos; explicar que essas telas ainda persistem no navegador.
7. Demonstrar contingência: indisponibilidade da API, aviso e botão de nova tentativa. Explicar por que um ID remoto não é substituído silenciosamente por outro local.
8. Fazer logout e tentar acessar uma rota interna.
9. Apresentar a separação React → services/fetch → Spring Boot → banco, os testes e as limitações do README.

Cada integrante deve explicar sua contribuição real. Não atribuir autoria nem coautoria artificialmente.

## Conferência do ambiente publicado

O site publicado é independente do servidor local. A Render não recebe a carga H2 de demonstração. O banco publicado precisa ter registros válidos para a apresentação online; não substituir dados de produção pela carga fictícia.

Na revisão de 25/11/2026, a página inicial publicada respondeu 200 e `/linhas` diretamente respondeu 404. Foi incluído `unibus-frontend/vercel.json` para o fallback do React Router. É necessário validar novamente após a Vercel publicar o commit correspondente; um commit no GitHub não prova que o deploy concluiu.

A chamada à API publicada excedeu 45 segundos na verificação inicial. A disponibilidade da Render e os dados do PostgreSQL devem ser confirmados antes de depender exclusivamente da demonstração online. O ambiente local permanece como contingência.

## Encerramento

- Executar `npm test`, `npm run lint`, `npm run build` e a suíte Maven.
- Conferir o PR e integrar na `main` sem contornar revisões ou checks exigidos pelo GitHub.
- Criar `entrega-av2` no commit final integrado, sem mover uma tag existente.
- Confirmar o deploy e ensaiar a apresentação com a equipe. Esses itens exigem confirmação real, não apenas documentação.
