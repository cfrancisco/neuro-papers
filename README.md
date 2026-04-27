# Neuro Papers

Bem vindo! Esse é o acervo de papers de neurociência com **resumos**, **conceitos-chave** e **simulações interativas** para explorar visualmente as ideias centrais de alguns papers importantes na área.

Para visualizar o site, abra com o GitHub Pages: [https://cfrancisco.github.io/neuro-papers/](https://cfrancisco.github.io/neuro-papers/)

## Por quê

Este projeto é um espaço para reunir os papers da area com visualizações interativas que tornam os conceitos tangíveis.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (sem `tailwind.config.js`)
- **React Router v7** com `HashRouter`
- **gh-pages** para deploy

## Estrutura

```
src/
├── App.tsx               Rotas
├── types.ts              Paper, Simulation
├── data/
│   └── papers.ts         Acervo (fonte da verdade)
├── components/
│   ├── Navbar.tsx
│   ├── PaperCard.tsx
│   └── ConceptTag.tsx
├── pages/
│   ├── Library.tsx       Grid + busca
│   └── PaperDetail.tsx   Resumo, conceitos, simulações
└── simulations/
    ├── index.ts          Mapa componentKey → Component
    └── *.tsx             Componentes interativos
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Adicionando um paper

Editar `src/data/papers.ts` e acrescentar um objeto ao array. O `summary` aceita `**negrito**` e parágrafos separados por linha em branco.

```ts
{
  id: 'slug-do-paper',
  title: '...',
  authors: ['...'],
  year: 2025,
  venue: '...',
  url: 'https://doi.org/...',
  summary: `Texto do resumo...`,
  concepts: ['conceito 1', 'conceito 2'],
  simulations: [],
}
```

## Adicionando uma simulação

1. Criar `src/simulations/MinhaSimulacao.tsx` exportando o componente como `default`.
2. Registrar em `src/simulations/index.ts`:
   ```ts
   import MinhaSimulacao from './MinhaSimulacao'
   export const simulationComponents = {
     'minha-sim': MinhaSimulacao,
   }
   ```
3. Referenciar no paper via `componentKey: 'minha-sim'`.

`PaperDetail` renderiza o componente automaticamente quando o `componentKey` está mapeado.

## Deploy

```bash
npm run deploy
```

Faz `build` e publica na branch `gh-pages`. No GitHub: **Settings → Pages → branch `gh-pages`**.

> O `base: '/neuro-papers/'` em `vite.config.ts` assume que o repositório se chama `neuro-papers`. Ajuste se renomear.

## Licença

[MIT](./LICENSE)
