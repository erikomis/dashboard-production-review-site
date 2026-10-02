<div align="center">

<img src="public/favicon.svg" alt="" width="72" height="72" />

# ReviewStore

**Avaliações reais de quem usou de verdade.**
Site público do ecossistema _Production Review_: compare produtos, veja notas e compartilhe sua experiência.

<p>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-3C50E0?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3C50E0?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-3C50E0?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-3C50E0?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>
<p>
  <img alt="TanStack Router" src="https://img.shields.io/badge/TanStack_Router-1C2434?style=flat-square" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-1C2434?style=flat-square" />
  <img alt="Acessibilidade WCAG 2.1 AA" src="https://img.shields.io/badge/WCAG_2.1-AA-067647?style=flat-square" />
  <img alt="Padrão MVVM" src="https://img.shields.io/badge/arquitetura-MVVM-1C2434?style=flat-square" />
</p>

[Funcionalidades](#-funcionalidades) ·
[Telas](#-telas) ·
[Como rodar](#-como-rodar) ·
[Testes](#-testes) ·
[SEO](#-seo) ·
[Arquitetura](#-arquitetura) ·
[Acessibilidade](#-acessibilidade) ·
[Design system](#-design-system)

</div>

<br />

<p align="center">
  <img src="docs/screenshots/home.png" alt="Página inicial do ReviewStore com busca, números da comunidade e uma avaliação em destaque" width="100%" />
</p>

---

## ✨ Funcionalidades

| | |
|---|---|
| 🔎 **Busca e catálogo** | Busca por nome, filtro por subcategoria, ordenação (recentes, nota, mais avaliados, nome) e paginação, tudo no servidor e refletido na URL. |
| 📸 **Fotos reais** | Catálogo importado do Open Food Facts: a foto da embalagem aparece inteira, sobre fundo neutro, com placeholder quando não há imagem. |
| 🏆 **Ranking** | Página _Mais bem avaliados_ com posição, nota e total, filtro por categoria e destaque na home (melhores notas e mais avaliados). |
| 🧭 **Páginas de categoria** | `/categorias/{slug}` com descrição, chips de subcategoria, ordenação e paginação. Links da home, do rodapé e do produto levam para cá. |
| ⭐ **Notas da comunidade** | Nota média, total e distribuição de 1 a 5 estrelas em cada produto. Cada barra da distribuição filtra as avaliações por nota. |
| ✍️ **Avaliações** | Usuários logados publicam avaliações com título, comentário e nota. Ordenação por mais recentes, mais úteis, maior/menor nota ou mais antigas. |
| 🖼 **Fotos nas avaliações** | Até 3 fotos por avaliação (JPEG, PNG ou WebP, até 5 MB) ao criar e ao editar: prévia, remoção, validação antes do envio e barra de progresso. Galeria com lightbox acessível (foco preso, <kbd>Esc</kbd>, setas e texto alternativo). |
| 💬 **Resposta oficial** | A resposta da equipe aparece abaixo da avaliação, no bloco _Resposta da equipe ReviewStore_. |
| 🚩 **Denunciar** | Modal com os motivos (spam, ofensivo, informação falsa, outro) e detalhes opcionais. A avaliação fica marcada como _Denunciada_; sem login, leva ao login e volta para a avaliação. |
| 🔔 **Notificações** | Sino no cabeçalho com contador (atualiza a cada 60 s e ao voltar para a aba), painel com as últimas, marcar como lida/todas e página `/notificacoes` com filtro. Clicar leva direto à avaliação. |
| ⚙️ **Preferências** | `/preferencias`: liga/desliga os e-mails de notificação (é para onde os e-mails apontam) e escolhe o tema. |
| 👤 **Perfil público** | `/u/{username}` com membro desde, estatísticas e avaliações paginadas. O nome do autor de cada avaliação leva ao perfil. |
| 📌 **Seguir produtos** | Botão _Seguir_/_Seguindo_ com contador no produto e página `/seguindo`. Quem segue recebe notificação de cada avaliação nova. |
| ⌨️ **Autocompletar** | Busca do cabeçalho e da home com sugestões a partir de 2 letras (sem acento), miniatura e categoria, num combobox ARIA completo. |
| 🌙 **Modo escuro** | Segue o sistema, tem alternância manual salva no navegador e não pisca ao carregar. Contraste AA nos dois temas. |
| 🔍 **SEO** | Título, descrição, canonical e Open Graph/Twitter por página, JSON-LD `Product` com notas no produto e `robots.txt` com o sitemap. |
| 👍 **Isso foi útil** | Marque as avaliações que ajudaram você, com resposta instantânea (atualização otimista com desfazer automático em caso de erro). |
| 🗂 **Minhas avaliações** | Lista das suas avaliações, inclusive as ocultas pela moderação (com o motivo), com edição e exclusão. |
| 🛍 **Produtos relacionados** | Na página do produto, outros itens da mesma subcategoria, os mais bem avaliados primeiro. |
| 🔐 **Conta completa** | Cadastro, ativação por e-mail, login (usuário ou e-mail), recuperação de senha com código de 6 dígitos e logout. Senha com a mesma política da API (8 a 72 caracteres, letras e números) e checklist ao digitar. No limite de tentativas (429), mostra a mensagem e a contagem regressiva. |
| ↩️ **Volta para onde parou** | Depois do login, o usuário retorna para a página de origem (inclusive para o formulário de avaliação). |
| 📱 **Responsivo** | De 360 px a telas grandes, com menu mobile acessível. |
| ♿ **Acessível** | Pensado para teclado e leitores de tela desde o início (veja [Acessibilidade](#-acessibilidade)). |

## 🖼 Telas

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/produtos.png" alt="Listagem de produtos com busca, filtros e cards com nota média" /></td>
    <td width="50%"><img src="docs/screenshots/login.png" alt="Tela de login dividida, com painel da marca e formulário" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Catálogo</b>: busca, filtros e notas</sub></td>
    <td align="center"><sub><b>Login</b>: usuário ou e-mail</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/ranking.png" alt="Ranking dos produtos mais bem avaliados com posição, nota e filtro por categoria" /></td>
    <td width="50%"><img src="docs/screenshots/categoria.png" alt="Página da categoria Laticínios com chips de subcategoria, ordenação e fotos dos produtos" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Ranking</b>: mais bem avaliados</sub></td>
    <td align="center"><sub><b>Categoria</b>: subcategorias e ordenação</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td width="68%"><img src="docs/screenshots/produto.png" alt="Página do produto com nota média, distribuição das notas clicável, ordenação e botão Isso foi útil" /></td>
    <td width="32%" valign="top"><img src="docs/screenshots/mobile.png" alt="Página inicial no celular" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Produto</b>: filtros por nota, ordenação e "útil"</sub></td>
    <td align="center"><sub><b>Mobile</b></sub></td>
  </tr>
</table>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/produto-avaliacoes.png" alt="Avaliações do produto com foto enviada pelo autor e resposta da equipe ReviewStore" /></td>
    <td width="50%"><img src="docs/screenshots/busca.png" alt="Busca da home com o autocompletar aberto: sugestões com miniatura, categoria e trecho digitado em destaque" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Avaliações</b>: fotos, resposta oficial e denúncia</sub></td>
    <td align="center"><sub><b>Busca</b>: autocompletar acessível</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/notificacoes.png" alt="Página de notificações com o painel do sino aberto e a opção de marcar todas como lidas" /></td>
    <td width="50%"><img src="docs/screenshots/perfil.png" alt="Perfil público com membro desde, avaliações publicadas, útil recebido e nota média" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Notificações</b>: sino, painel e página</sub></td>
    <td align="center"><sub><b>Perfil público</b>: /u/usuario</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/modo-escuro.png" alt="Página do produto no modo escuro, com a área de avaliações, a foto e a resposta da equipe" width="80%" />
  <br />
  <sub><b>Modo escuro</b>: mesmos componentes, contraste AA</sub>
</p>

<p align="center">
  <img src="docs/screenshots/minhas-avaliacoes.png" alt="Minhas avaliações: lista com produto, nota, data, status e botões de editar e excluir" width="80%" />
  <br />
  <sub><b>Minhas avaliações</b>: status, edição e exclusão</sub>
</p>

## 🚀 Como rodar

### Pré-requisitos

- **Node.js 20+** e npm
- A API [`production-review-api`](https://github.com/erikomis/production-review-api) rodando (por padrão em `http://localhost:8084`)

### Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. Aponte para a API
echo "VITE_API_URL=http://localhost:8084/api/v1" > .env.local

# 3. Suba em modo de desenvolvimento (http://localhost:5174)
npm run dev
```

> [!IMPORTANT]
> A API usa cookies `httpOnly` para a sessão. Adicione a origem do site (`http://localhost:5174`) à variável `ALLOWED_ORIGINS` da API, senão o navegador bloqueia as requisições por CORS.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR na porta **5174** |
| `npm run build` | Checagem de tipos (`tsc -b`) + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint em todo o projeto |
| `npm run test` | Testes de componente (Vitest + Testing Library + jsdom) |
| `npm run test:e2e` | E2E com Playwright e API mockada (sobe o Vite sozinho se a porta 5174 estiver livre) |

### Variáveis de ambiente

| Variável | Exemplo | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8084/api/v1` | URL base da API, incluindo `/api/v1`. As fotos das avaliações (`/api/v1/files/...`) usam a origem dela |
| `VITE_SITE_URL` | `https://reviewstore.com.br` | Opcional. Origem pública usada no canonical e no Open Graph (padrão: a origem atual) |

## 🐳 Docker e deploy

As imagens são publicadas **privadas** no GitHub Container Registry: `ghcr.io/erikomis/dashboard-production-review-site`. A URL da API entra como `--build-arg VITE_API_URL`, porque o Vite embute o valor no bundle durante o build.

```bash
docker build --build-arg VITE_API_URL=http://localhost:8084/api/v1 -t dashboard-production-review-site .
docker run -p 5174:5174 dashboard-production-review-site   # http://localhost:5174
```

```mermaid
flowchart LR
    T["testings<br/>lint + testes + build + E2E<br/>push na main"] -->|sucesso| P["publish<br/>build do commit testado"]
    P --> GHCR[("ghcr.io (privado)<br/>latest · sha-commit")]
    GHCR --> D["deploy<br/>login temporário + pull + up"]
    D --> VPS["VPS<br/>docker compose"]
```

- **publish**: só roda depois que os testes do push na `main` passam; builda exatamente o commit testado e publica as tags `latest` e `sha-<commit>`, autenticando com o `GITHUB_TOKEN` do próprio workflow.
- **deploy**: entra na VPS por SSH, faz login no GHCR com o token temporário do job, sobe a imagem daquele commit e faz logout. **Nenhuma credencial fica salva na VPS.** O deploy fica desligado até você criar a variável `DEPLOY_ENABLED=true`.

| Tipo | Nome | Para quê |
|---|---|---|
| Secret | `HOST`, `USERNAME`, `SSH_KEY` | Acesso SSH à VPS |
| Variável | `VITE_API_URL` | URL da API embutida no build (ex.: `https://api.seudominio.com/api/v1`). Sem ela, o publish falha com uma mensagem clara |
| Variável (opcional) | `DEPLOY_DIR` | Pasta do `docker-compose.yml` na VPS (padrão: `site`) |
| Variável | `DEPLOY_ENABLED` | Crie com o valor `true` para liberar o deploy. Sem ela, o workflow só publica a imagem |

> [!IMPORTANT]
> Antes do primeiro deploy, copie o `docker-compose.yml` deste repositório para a pasta da VPS. Depois do primeiro publish, confira em **Perfil → Packages → dashboard-production-review-site → Package settings** que a visibilidade está **Private**.

## 🏛 Arquitetura

O projeto segue **MVVM** por tela. A view é só apresentação; toda a lógica fica no _view-model_ (um hook), que conversa com a API por meio de hooks do React Query e services.

```mermaid
flowchart LR
    Page["XxxPage.tsx<br/><i>compõe</i>"] --> Model["xxx.model.tsx<br/><i>view-model (hook)</i>"]
    Page --> View["xxx.view.tsx<br/><i>apresentação</i>"]
    Model --> Schema["xxx.schema.ts<br/><i>validação zod</i>"]
    Model --> Hooks["hooks/useQuery* · useMutation*<br/><i>TanStack Query</i>"]
    Hooks --> Services["services/*.service.ts<br/><i>axios</i>"]
    Services --> API[("production-review-api")]
```

```tsx
// Toda tela segue o mesmo formato
const ProductDetailPage = () => {
  const methods = useProductDetailModel(); // lógica, estado, queries e handlers
  return <ProductDetailView {...methods} />; // só apresentação
};
```

<details>
<summary><b>📁 Estrutura de pastas</b></summary>

```text
src/
├── environment/            # configuração por ambiente (URL da API)
├── modules/
│   ├── auth/               # login, cadastro, ativação, esqueci/redefinir senha
│   │   ├── sign-in/        #   SignInPage · sign-in.model · sign-in.view · schema · type
│   │   ├── ...
│   │   ├── hooks/          #   mutations de autenticação
│   │   └── services/       #   chamadas /auth/*
│   └── site/
│       ├── components/     # ProductCard, ReviewCard, ReviewGallery, FollowButton, NotificationItem, photo-picker...
│       ├── layout/         # cabeçalho, rodapé, busca com autocompletar e sino (também em MVVM)
│       ├── hooks/          # queries e mutations (inclusive "útil" otimista)
│       ├── services/       # chamadas /production, /category, /review
│       ├── constants/      # opções de ordenação compartilhadas
│       └── view/           # home, product-list, product-detail (+ create-review),
│                           # ranking, category, my-reviews (+ edit-review), profile,
│                           # notifications, preferences, following
├── shared/                 # componentes (Modal, Lightbox, estados), hooks (useSeo, useTheme), tema, tipos e utilitários
├── test/                   # setup do Vitest e helpers de renderização
└── router.tsx              # rotas (TanStack Router) com loaders
e2e/                        # Playwright: specs, fixtures JSON e API mockada
```

</details>

### Integração com a API

| Recurso | Endpoint |
|---|---|
| Produtos com nota, total e foto (busca, filtros, ordenação, paginação) | `GET /production/list?page&size&search&categoryId&subCategorieId&property&sort` |
| Ranking (mais bem avaliados) | `GET /production/list?property=averageNote&sort=DESC&onlyRated=true[&categoryId]` |
| Mais avaliados | `GET /production/list?property=totalReviews&sort=DESC&onlyRated=true` |
| Produto pelo slug (com fotos) | `GET /production/slug/{slug}` |
| Categoria pelo slug | `GET /category/slug/{slug}` |
| Categorias e subcategorias | `GET /category/list` |
| Avaliações de um produto | `GET /review/product/{id}?page&size&note&sort` |
| Resumo e distribuição das notas | `GET /review/product/{id}/summary` |
| Avaliações recentes | `GET /review/list?size=6` |
| Minhas avaliações | `GET /review/me?page&size` |
| Publicar, editar e excluir avaliação | `POST /review/` · `PUT /review/{id}` · `DELETE /review/{id}` |
| Marcar como útil | `POST /review/{id}/helpful` |
| Sessão | `POST /auth/sign-in` · `POST /auth/logout` · `GET /user/me` |
| Autocompletar | `GET /production/suggest?q&limit=8` (só com 2+ caracteres) |
| Seguir produto | `POST` / `DELETE /production/{id}/follow` · `GET /user/me/following?page&size` |
| Fotos da avaliação | `POST /review/{id}/images` (multipart `file`) · `DELETE /review/{id}/images/{imageId}` · `GET /files/...` |
| Denunciar | `POST /review/{id}/report` `{reason, details?}` |
| Notificações | `GET /notifications?page&size&unreadOnly` · `GET /notifications/unread-count` · `PATCH /notifications/{id}/read` · `PATCH /notifications/read-all` |
| Preferências | `GET` / `PATCH /user/me/preferences` |
| Perfil público | `GET /users/{username}` · `GET /users/{username}/reviews?page&size` |
| JSON-LD do produto | `GET /seo/products/{slug}` |

> [!NOTE]
> Todas as datas chegam em ISO-8601 UTC (com `Z`) e são exibidas em pt-BR no fuso do navegador. Num 429, o site mostra a mensagem da API e bloqueia o envio até acabar o tempo de espera.

## 🧪 Testes

| Tipo | Ferramentas | O que cobre |
|---|---|---|
| Componente | Vitest, Testing Library, jsdom | `StarRatingInput`, combobox da busca, lightbox, sino de notificações, modal de denúncia, seletor de fotos, alternância de tema, política de senha e tratamento do 429 |
| E2E | Playwright | Home → autocompletar → produto (com SEO/JSON-LD) · login → avaliação com foto · denunciar · seguir · notificações e preferências · minhas avaliações (editar/excluir) · perfil público · modo escuro (sem flash) · menu mobile |

Os E2E usam a API **mockada** com `page.route` (`e2e/support/mock-api.ts` + fixtures JSON em `e2e/fixtures/`), então rodam no CI sem backend. Para rodar contra a API real:

```bash
E2E_REAL_API=1 npm run test:e2e
```

Nesse modo o login acontece uma única vez (a sessão fica em `e2e/.auth/user.json` e é reaproveitada por 1 h, porque o login aceita no máximo 5 tentativas por minuto) e só rodam os testes que não alteram dados. Localmente os E2E usam o Chrome instalado (`channel: "chrome"`); no CI, o Chromium do Playwright.

## 🔍 SEO

- `useSeo` define título, descrição, canonical, Open Graph e Twitter Card em cada página; telas da conta recebem `noindex`.
- Na página do produto, o JSON-LD `Product` + `AggregateRating` + `Review` vem pronto de `GET /seo/products/{slug}`.
- `public/robots.txt` aponta para o sitemap gerado pela API (`${VITE_API_URL}/seo/sitemap.xml`).

> [!IMPORTANT]
> O `robots.txt` é estático: antes de publicar, troque `http://localhost:8084` na linha `Sitemap:` pelo domínio público da API.

## ♿ Acessibilidade

Construído para atender **WCAG 2.1 nível AA**:

- **Estrutura semântica**: `header`, `nav` rotulados, `main` e `footer`, com títulos em ordem e o link **"Pular para o conteúdo"**.
- **Navegação por rota**: o título da aba muda a cada página e o foco vai para o conteúdo principal (ou para a âncora, como `#avaliar`).
- **Teclado**: foco sempre visível (contorno de 3 px), alvos de pelo menos 44 px, menus que fecham com <kbd>Esc</kbd> e devolvem o foco.
- **Formulários**: todo campo tem `label`; erros ficam ligados por `aria-describedby` + `aria-invalid`, e mensagens da API usam `role="alert"`.
- **Nota em estrelas**: na entrada, é um grupo de rádios nativo (as setas trocam a nota e cada opção é anunciada como _"3 de 5 estrelas"_); na exibição, tem texto alternativo como _"Nota 4,0 de 5 estrelas"_.
- **Filtros**: barras da distribuição são botões com `aria-pressed`; chips de categoria/subcategoria marcam o ativo com `aria-current`; a paginação usa `aria-current="page"`.
- **"Isso foi útil"**: botão com `aria-pressed`; na própria avaliação fica desabilitado com a explicação visível.
- **Diálogos**: edição e exclusão usam `<dialog>` modal com foco preso, <kbd>Esc</kbd> para fechar e foco devolvido ao botão de origem; a exclusão é um `alertdialog` com foco inicial em "Cancelar".
- **Feedback assíncrono**: `aria-live` no envio de avaliação, na contagem de resultados, nos filtros e nas marcações de útil.
- **Autocompletar**: `role="combobox"` com `aria-expanded`, `aria-controls` e `aria-activedescendant`; <kbd>↑</kbd> <kbd>↓</kbd> navegam, <kbd>Enter</kbd> abre o produto e <kbd>Esc</kbd> fecha. O total de sugestões é anunciado.
- **Lightbox**: `<dialog>` modal com foco preso, <kbd>Esc</kbd>, setas, contador "Foto 2 de 3" anunciado e `alt` descritivo em cada foto.
- **Notificações**: o sino diz quantas não lidas há no nome acessível, anuncia as novas com `aria-live` e o painel fecha com <kbd>Esc</kbd> devolvendo o foco.
- **Movimento e contraste**: respeita `prefers-reduced-motion` (microinterações desligadas); todos os textos passam de 4,5:1 de contraste nos temas claro **e** escuro (verificado por script).

## 🎨 Design system

Identidade compartilhada com o [painel administrativo](https://github.com/erikomis/dashboard-production-review-react): mesma marca, paleta e tipografia.

| Token | Cor | Uso |
|---|---|---|
| `brand-600` / `primary` | ![#3C50E0](https://img.shields.io/badge/%233C50E0-3C50E0?style=flat-square) | Botões, links e marca |
| `brand-950` | ![#141B45](https://img.shields.io/badge/%23141B45-141B45?style=flat-square) | Hero e rodapé |
| `ink` | ![#1C2434](https://img.shields.io/badge/%231C2434-1C2434?style=flat-square) | Texto principal |
| `muted` | ![#556274](https://img.shields.io/badge/%23556274-556274?style=flat-square) | Texto auxiliar |
| `canvas` | ![#F5F7FB](https://img.shields.io/badge/%23F5F7FB-F5F7FB?style=flat-square) | Fundo da página |
| `star` | ![#D97706](https://img.shields.io/badge/%23D97706-D97706?style=flat-square) | Estrelas das avaliações |

No modo escuro, os mesmos tokens trocam de valor por variáveis CSS (`src/index.css`): fundo `#0B1120`, superfície `#151D2E`, texto `#E8ECF3` e links `#A8B3FA`. Botões, estrelas e o índigo da marca não mudam.

**Tipografia:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) nos títulos e [Inter](https://fonts.google.com/specimen/Inter) no texto.

## 🧩 Ecossistema Production Review

| Projeto | Descrição |
|---|---|
| [**production-review-api**](https://github.com/erikomis/production-review-api) | API REST em Spring Boot: autenticação, catálogo e avaliações |
| [**dashboard-production-review-site**](https://github.com/erikomis/dashboard-production-review-site) | Este repositório: site público onde as pessoas avaliam produtos |
| [**dashboard-production-review-react**](https://github.com/erikomis/dashboard-production-review-react) | Painel administrativo do catálogo e das avaliações |

<div align="center">
<br />
<sub>Feito com ☕ e TypeScript.</sub>
</div>
