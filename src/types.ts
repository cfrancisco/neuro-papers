export type Simulation = {
  id: string
  title: string
  description: string
  // Placeholder for future interactive component import
  componentKey?: string
}

export type Paper = {
  id: string
  title: string
  authors: string[]
  year: number
  venue?: string
  url?: string
  summary: string
  concepts: string[]
  simulations: Simulation[]
}
