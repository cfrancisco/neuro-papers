import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            neuro-papers
          </span>
        </Link>
        <nav className="text-sm text-zinc-600 dark:text-zinc-400">
          <Link to="/" className="hover:text-violet-700 dark:hover:text-violet-300">
            Acervo
          </Link>
        </nav>
      </div>
    </header>
  )
}
