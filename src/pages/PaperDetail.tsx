import { Link, useParams } from 'react-router-dom'
import { papers } from '../data/papers'
import { ConceptTag } from '../components/ConceptTag'
import { simulationComponents } from '../simulations'

// Renderização leve de **negrito** dentro de um parágrafo
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function renderSummary(summary: string) {
  const paragraphs = summary.split(/\n\s*\n/)
  return paragraphs.map((p, i) => (
    <p key={i} className="leading-relaxed text-zinc-700 dark:text-zinc-300 [&:not(:last-child)]:mb-4">
      {renderInline(p)}
    </p>
  ))
}

export function PaperDetail() {
  const { id } = useParams<{ id: string }>()
  const paper = papers.find((p) => p.id === id)

  if (!paper) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-zinc-600 dark:text-zinc-400">Paper não encontrado.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-violet-700 hover:underline dark:text-violet-300"
        >
          ← Voltar ao acervo
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to="/"
        className="mb-6 inline-block text-sm text-violet-700 hover:underline dark:text-violet-300"
      >
        ← Voltar ao acervo
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
          {paper.title}
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          {paper.authors.join(', ')} · {paper.year}
          {paper.venue ? ` · ${paper.venue}` : ''}
        </p>
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-violet-700 hover:underline dark:text-violet-300"
          >
            Ler paper original ↗
          </a>
        )}
      </header>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Resumo
        </h2>
        {renderSummary(paper.summary)}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Conceitos
        </h2>
        <div className="flex flex-wrap gap-2">
          {paper.concepts.map((c) => (
            <ConceptTag key={c} label={c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Simulações
        </h2>
        {paper.simulations.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nenhuma simulação implementada ainda para este paper.
          </p>
        ) : (
          <ul className="space-y-6">
            {paper.simulations.map((sim) => {
              const SimulationComponent = sim.componentKey
                ? simulationComponents[sim.componentKey]
                : null

              return (
                <li
                  key={sim.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                    {sim.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {sim.description}
                  </p>

                  {SimulationComponent ? (
                    <div className="mt-4 rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                      <SimulationComponent />
                    </div>
                  ) : (
                    <p className="mt-3 text-xs italic text-zinc-500">
                      (placeholder — componente interativo a implementar)
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}
