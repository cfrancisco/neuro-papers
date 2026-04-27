// src/simulations/index.ts
// Mapa central de componentKey → Component
// Adicione novas simulações aqui conforme necessário

import type { ComponentType } from 'react'
import Pohl2026Simulation from './Pohl2026Simulation'

export const simulationComponents: Record<string, ComponentType> = {
  'pohl2026-simulation': Pohl2026Simulation,
  // Adicione outras simulações aqui:
  // 'outro-paper-sim': OutroPaperSimulation,
}
