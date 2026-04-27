type Props = { label: string }

export function ConceptTag({ label }: Props) {
  return (
    <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
      {label}
    </span>
  )
}
