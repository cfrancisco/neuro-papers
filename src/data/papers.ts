import type { Paper } from '../types'

export const papers: Paper[] = [
  {
    id: 'pohl-2026-neural-representation',
    title: 'Conceptual dimensions of neural representation',
    authors: ['Pohl, S.', 'Sadil, P.', 'Malecek, N.', 'Chau, B.K.H.', 'Lopez-Persem, A.', 'Cockburn, J.'],
    year: 2026,
    venue: 'Nature Reviews Neuroscience',
    url: 'https://www.nature.com/articles/s41583-025-00911-z',
    summary: `Este paper propõe uma estrutura conceitual para caracterizar representações neurais através de quatro dimensões ortogonais: sensitividade, especificidade, invariância e funcionalidade.

**Sensitividade** (I(s;r)/H(s)): Mede se a representação neural r muda quando o estímulo s muda. Neurônios com alta sensitividade têm padrões de ativação distintos para diferentes valores de s, permitindo decodificação precisa do estímulo a partir da resposta neural.

**Especificidade** (I(s;r)/H(r)): Mede quanto da variabilidade em r é explicada por s. Alta especificidade significa que neurônios são "dedicados" a um estímulo específico, sem responder a outros estímulos ou variáveis irrelevantes (nuisance variables).

**Invariância**: Mede se r permanece constante quando variáveis irrelevantes n mudam, dado s fixo. Por exemplo, neurônios de reconhecimento de objetos podem manter a mesma resposta independente de rotação ou iluminação.

**Funcionalidade**: Mede se r causa comportamento. Uma representação pode ter alta sensitividade mas baixa funcionalidade se não conecta à ação (ex: pato vs maçã — ambos processados visualmente, mas só maçã aciona comportamento alimentar).

O paper usa teoria da informação para formalizar essas dimensões e mostra como diferentes áreas cerebrais (V1, ITC, OFC) variam ao longo delas. A estrutura resolve confusões na literatura onde "representação" significa coisas diferentes em contextos diferentes.`,
    concepts: [
      'Teoria da Informação',
      'Representação Neural',
      'Sensitividade',
      'Especificidade',
      'Invariância',
      'Funcionalidade',
      'Informação Mútua',
      'Entropia',
      'Decodificação Neural',
      'Nuisance Variables',
    ],
    simulations: [
      {
        id: 'sensitivity-specificity-interactive',
        title: 'Sensitividade vs Especificidade — Visualização Interativa',
        description:
          'Visualização de 40 neurônios respondendo a 3 estímulos (🍎 maçã, 🍌 banana, 🦆 pato). Neurônios exclusivos de um estímulo têm alta especificidade; neurônios em overlap (respondem a múltiplos estímulos) têm baixa especificidade. Use os checkboxes para ativar/desativar estímulos e veja como I(s;r), sensitividade e especificidade mudam. Implementa rigorosamente as fórmulas da Wikipedia: H(X)=−ΣP(x)log₂P(x) e I(X;Y)=H(X)+H(Y)−H(X,Y).',
        componentKey: 'pohl2026-simulation',
      },
    ],
  },
]
