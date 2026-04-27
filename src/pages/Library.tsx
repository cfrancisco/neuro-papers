import { useMemo, useState } from 'react'
import { papers } from '../data/papers'
import { PaperCard } from '../components/PaperCard'

export function Library() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return papers
    return papers.filter((p) => {
      const haystack = [
        p.title,
        p.summary,
        p.authors.join(' '),
        p.concepts.join(' '),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          Acervo de papers
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Coletânea de papers de neurociência que ando lendo, com resumos,
          conceitos-chave e simulações interativas para explorar as ideias
          centrais.
        </p>
      </section>

      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, autor ou conceito…"
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-violet-900"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">Nenhum paper encontrado.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <PaperCard key={p.id} paper={p} />
          ))}
        </div>
      )}
    </main>
  )
}
