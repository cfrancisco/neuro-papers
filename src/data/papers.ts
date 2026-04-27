import type { Paper } from '../types'

export const papers: Paper[] = [
  {
    id: 'hodgkin-huxley-1952',
    title: 'A quantitative description of membrane current and its application to conduction and excitation in nerve',
    authors: ['Alan L. Hodgkin', 'Andrew F. Huxley'],
    year: 1952,
    venue: 'The Journal of Physiology',
    url: 'https://doi.org/10.1113/jphysiol.1952.sp004764',
    summary:
      'O paper fundador da neurociência computacional. Hodgkin e Huxley descrevem matematicamente o potencial de ação no axônio gigante da lula, modelando os canais iônicos de sódio e potássio com um sistema de equações diferenciais.',
    concepts: [
      'potencial de ação',
      'canais iônicos',
      'condutância de membrana',
      'equações diferenciais',
    ],
    simulations: [
      {
        id: 'hh-action-potential',
        title: 'Potencial de ação interativo',
        description:
          'Aplique correntes em diferentes amplitudes e veja como o potencial de membrana evolui ao longo do tempo.',
      },
    ],
  },
  {
    id: 'hopfield-1982',
    title: 'Neural networks and physical systems with emergent collective computational abilities',
    authors: ['John J. Hopfield'],
    year: 1982,
    venue: 'PNAS',
    url: 'https://doi.org/10.1073/pnas.79.8.2554',
    summary:
      'Hopfield introduz uma rede neural recorrente capaz de armazenar memórias como atratores de um sistema dinâmico, conectando neurociência, física estatística e computação.',
    concepts: [
      'memória associativa',
      'redes recorrentes',
      'atratores',
      'energia',
    ],
    simulations: [
      {
        id: 'hopfield-attractor',
        title: 'Recuperação de padrões',
        description:
          'Treine a rede com padrões binários e veja a convergência a partir de entradas ruidosas.',
      },
    ],
  },
  {
    id: 'izhikevich-2003',
    title: 'Simple model of spiking neurons',
    authors: ['Eugene M. Izhikevich'],
    year: 2003,
    venue: 'IEEE Transactions on Neural Networks',
    url: 'https://doi.org/10.1109/TNN.2003.820440',
    summary:
      'Modelo de neurônio com apenas duas equações diferenciais que reproduz uma vasta gama de comportamentos de disparo observados em neurônios reais — equilíbrio raro entre realismo biológico e custo computacional.',
    concepts: [
      'spiking neurons',
      'modelos reduzidos',
      'bifurcações',
      'simulação em larga escala',
    ],
    simulations: [],
  },
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
