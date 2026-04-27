# neuro-papers

Site estático que serve como acervo pessoal de papers de neurociência, com resumos, conceitos-chave e simulações interativas para explorar as ideias centrais de cada paper.

Hospedado no GitHub Pages.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** via plugin oficial do Vite (`@tailwindcss/vite`) — sem `tailwind.config.js`, configuração mora no `src/index.css` com `@import "tailwindcss"`
- **React Router v7** com `HashRouter` (URLs `#/...` para funcionar em GitHub Pages sem rewrites)
- **gh-pages** para deploy (`npm run deploy`)

## Estrutura

```
src/
├── App.tsx               Rotas (HashRouter)
├── main.tsx              Entry point
├── index.css             @import "tailwindcss"
├── types.ts              Tipos: Paper, Simulation
├── data/
│   └── papers.ts         Array de papers (fonte da verdade, sem CMS/banco)
├── components/
│   ├── Navbar.tsx
│   ├── PaperCard.tsx     Card usado na Library
│   └── ConceptTag.tsx    Tag de conceito (badge violeta)
└── pages/
    ├── Library.tsx       Home: grid de papers + busca por título/autor/conceito
    └── PaperDetail.tsx   Detalhe de um paper: resumo, conceitos, simulações
```

## Modelo de dados

Definido em `src/types.ts`:

```ts
type Paper = {
  id: string                // slug usado na URL
  title: string
  authors: string[]
  year: number
  venue?: string
  url?: string              // link para o paper original
  summary: string
  concepts: string[]
  simulations: Simulation[]
}

type Simulation = {
  id: string
  title: string
  description: string
  componentKey?: string     // futuro: chave para mapear ao componente React
}
```

## Como adicionar um novo paper

Editar `src/data/papers.ts` e acrescentar um objeto ao array `papers`. Sem build extra, sem CMS — está tudo versionado no git.

## Como adicionar uma simulação interativa

Plano (ainda não implementado):

1. Criar `src/simulations/<NomeDaSim>.tsx` exportando um componente React.
2. Registrar o componente em um mapa `componentKey → Component` (a criar).
3. No `papers.ts`, preencher `simulations[].componentKey` com a chave registrada.
4. `PaperDetail` renderiza o componente quando `componentKey` está presente; senão mostra o placeholder atual.

Bibliotecas ainda não escolhidas — depende do tipo de simulação (séries temporais, redes, EDOs). Candidatas naturais: Canvas puro, `d3`, ou `three.js` para 3D.

## Scripts

```bash
npm run dev       # dev server
npm run build     # tsc -b && vite build
npm run preview   # serve o build local
npm run deploy    # build + push para branch gh-pages
```

## Configuração de deploy

`vite.config.ts` define `base: '/neuro-papers/'` — assume que o repo do GitHub se chama `neuro-papers`. Se renomear o repo, ajustar lá.

GitHub Pages: **Settings → Pages → branch `gh-pages`**.

## Decisões de design

- **HashRouter em vez de BrowserRouter**: GitHub Pages não faz rewrite de SPA, então rotas com `#` evitam 404 em refresh.
- **Dados em arquivo TS, não JSON**: aproveita autocomplete e checagem de tipo do TypeScript ao adicionar papers.
- **Sem backend, sem CMS**: prioridade é simplicidade e zero infraestrutura. Se a coleção crescer muito, considerar migrar para Markdown + frontmatter com algum loader do Vite.
- **Tailwind v4 sem config file**: usa o novo modo CSS-first; tema default cobre o que precisamos.
