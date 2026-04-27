import { Link } from 'react-router-dom'
import type { Paper } from '../types'
import { ConceptTag } from './ConceptTag'

type Props = { paper: Paper }

export function PaperCard({ paper }: Props) {
  return (
    <Link
      to={`/papers/${paper.id}`}
      className="group block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-violet-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-500"
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-300">
          {paper.title}
        </h3>
        <span className="shrink-0 text-sm text-zinc-500">{paper.year}</span>
      </div>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
        {paper.authors.join(', ')}
        {paper.venue ? ` · ${paper.venue}` : ''}
      </p>
      <p className="mb-4 line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300">
        {paper.summary}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {paper.concepts.slice(0, 4).map((c) => (
          <ConceptTag key={c} label={c} />
        ))}
        <span className="ml-auto text-xs text-zinc-500">
          {paper.simulations.length} simulação
          {paper.simulations.length === 1 ? '' : 'es'}
        </span>
      </div>
    </Link>
  )
}
