import { useState, useEffect } from 'react';

// Tipos
type Stimulus = {
  key: string;
  emoji: string;
  name: string;
  color: string;
  on: boolean;
  from: number;
  to: number;
};

type RState = {
  key: string;
  label: string;
  n: number;
  p: number;
  color?: string;
  stim?: string;
};

type ComputeResult = {
  Hs: number;
  Hr: number;
  Hsr: number;
  Isr: number;
  sensitivity: number;
  specificity: number;
  counts: { apple: number; banana: number; duck: number; overlap: number; inactive: number };
  r_states: RState[];
  P_r_given_s: Record<string, Record<string, number>>;
  P_sr: Record<string, Record<string, number>>;
  s_values: string[];
};

const N = 40; // número de neurônios

const INITIAL_STIMS: Stimulus[] = [
  { key: 'apple',  emoji: '🍎', name: 'Maçã',   color: '#7F77DD', on: true,  from: 1,  to: 12 },
  { key: 'banana', emoji: '🍌', name: 'Banana', color: '#D4920A', on: true,  from: 9,  to: 32 },
  { key: 'duck',   emoji: '🦆', name: 'Pato',   color: '#1D9E75', on: true,  from: 29, to: 40 },
];

export default function Pohl2026Simulation() {
  const [stims, setStims] = useState<Stimulus[]>(INITIAL_STIMS);
  const [result, setResult] = useState<ComputeResult | null>(null);

  // Funções auxiliares
  const getActive = (n: number): Stimulus[] => {
    return stims.filter(s => s.on && n >= s.from && n <= s.to);
  };

  const compute = (): ComputeResult => {
    // ═══════════════════════════════════════════════════════════
    // PASSO 1: P(s) e H(s)
    // ═══════════════════════════════════════════════════════════
    const s_values = ['apple', 'banana', 'duck'];
    const P_s: Record<string, number> = {};
    s_values.forEach(s => P_s[s] = 1/3);
    
    let Hs = 0;
    s_values.forEach(s => {
      if(P_s[s] > 0) Hs -= P_s[s] * Math.log2(P_s[s]);
    });

    // ═══════════════════════════════════════════════════════════
    // PASSO 2: P(r) e H(r)
    // ═══════════════════════════════════════════════════════════
    const counts = { apple: 0, banana: 0, duck: 0, overlap: 0, inactive: 0 };
    
    for(let n = 1; n <= N; n++) {
      const act = getActive(n);
      if(act.length === 0) counts.inactive++;
      else if(act.length === 1) counts[act[0].key as keyof typeof counts]++;
      else counts.overlap++;
    }

    const r_states: RState[] = [];
    if(counts.apple > 0)    r_states.push({key:'apple_excl',    label:'🍎 exclusivo', n:counts.apple,    p:counts.apple/N,    color:'#7F77DD', stim:'apple'});
    if(counts.banana > 0)   r_states.push({key:'banana_excl',   label:'🍌 exclusivo', n:counts.banana,   p:counts.banana/N,   color:'#D4920A', stim:'banana'});
    if(counts.duck > 0)     r_states.push({key:'duck_excl',     label:'🦆 exclusivo', n:counts.duck,     p:counts.duck/N,     color:'#1D9E75', stim:'duck'});
    if(counts.overlap > 0)  r_states.push({key:'overlap',       label:'overlap',      n:counts.overlap,  p:counts.overlap/N,  color:'#aaa',    stim:'overlap'});
    if(counts.inactive > 0) r_states.push({key:'inactive',      label:'inativo',      n:counts.inactive, p:counts.inactive/N, color:'#ccc',    stim:'inactive'});

    const P_r: Record<string, number> = {};
    r_states.forEach(st => P_r[st.key] = st.p);

    let Hr = 0;
    r_states.forEach(st => {
      if(st.p > 0) Hr -= st.p * Math.log2(st.p);
    });

    // ═══════════════════════════════════════════════════════════
    // PASSO 3: P(s,r) e H(s,r)
    // ═══════════════════════════════════════════════════════════
    const P_r_given_s: Record<string, Record<string, number>> = {};

    s_values.forEach(s_key => {
      const stim = stims.find(st => st.key === s_key)!;
      const isOn = stim.on;
      const totalNeurons = stim.to - stim.from + 1;

      P_r_given_s[s_key] = {};

      // Verificar se s tem neurônios no overlap
      let hasOverlap = false;
      if(isOn) {
        for(let n = stim.from; n <= stim.to; n++) {
          if(getActive(n).length > 1) { hasOverlap = true; break; }
        }
      }

      r_states.forEach(r => {
        if(isOn) {
          if(r.key === s_key + '_excl') {
            P_r_given_s[s_key][r.key] = counts[s_key as keyof typeof counts] / totalNeurons;
          } else if(r.key === 'overlap') {
            P_r_given_s[s_key][r.key] = hasOverlap ? (counts.overlap / totalNeurons) : 0.01;
          } else if(r.key === 'inactive') {
            P_r_given_s[s_key][r.key] = 0.05;
          } else {
            P_r_given_s[s_key][r.key] = 0.01;
          }
        } else {
          if(r.key === 'inactive') {
            P_r_given_s[s_key][r.key] = 0.90;
          } else {
            P_r_given_s[s_key][r.key] = 0.02;
          }
        }
      });

      // Normalizar
      const sum = Object.values(P_r_given_s[s_key]).reduce((a,b) => a+b, 0);
      Object.keys(P_r_given_s[s_key]).forEach(rk => {
        P_r_given_s[s_key][rk] /= sum;
      });
    });

    // P(s,r) = P(s) × P(r|s)
    const P_sr: Record<string, Record<string, number>> = {};
    s_values.forEach(s => {
      P_sr[s] = {};
      r_states.forEach(r => {
        P_sr[s][r.key] = P_s[s] * P_r_given_s[s][r.key];
      });
    });

    // H(s,r) = −Σ_s Σ_r P(s,r) log₂ P(s,r)
    let Hsr = 0;
    s_values.forEach(s => {
      r_states.forEach(r => {
        const p = P_sr[s][r.key];
        if(p > 0.00001) Hsr -= p * Math.log2(p);
      });
    });

    // ═══════════════════════════════════════════════════════════
    // PASSO 4: I(s;r)
    // ═══════════════════════════════════════════════════════════
    const Isr = Hs + Hr - Hsr;
    const sensitivity = Isr / Hs;
    const specificity = Hr > 0 ? Isr / Hr : 0;

    return { Hs, Hr, Hsr, Isr, sensitivity, specificity, counts, r_states, P_r_given_s, P_sr, s_values };
  };

  // Recomputar quando stims mudam
  useEffect(() => {
    setResult(compute());
  }, [stims]);

  const toggleStim = (key: string) => {
    setStims(prev => prev.map(s => 
      s.key === key ? { ...s, on: !s.on } : s
    ));
  };

  if (!result) return <div className="p-4 text-zinc-600 dark:text-zinc-400">Calculando...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Sensitividade e Especificidade — Visualização Interativa
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Fórmulas da Wikipedia: H(X)=−ΣP(x)log₂P(x) · I(X;Y)=H(X)+H(Y)−H(X,Y)
        </p>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-3 flex-wrap">
        {stims.map(stim => (
          <button
            key={stim.key}
            onClick={() => toggleStim(stim.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              stim.on ? 'border-current' : 'border-zinc-300 dark:border-zinc-700'
            }`}
            style={{ borderColor: stim.on ? stim.color : undefined }}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center`}
              style={{ borderColor: stim.color, backgroundColor: stim.on ? stim.color : 'transparent' }}
            >
              {stim.on && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <span className="font-semibold text-sm" style={{ color: stim.on ? stim.color : undefined }}>
              <span className={stim.on ? '' : 'text-zinc-500 dark:text-zinc-400'}>
                {stim.emoji} {stim.name}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Neurônios */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl p-6 space-y-4 border border-zinc-200 dark:border-zinc-800">
        <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          r — 40 neurônios (cada cor = estímulo que ativa esse neurônio)
        </div>

        <div className="flex gap-0.5 mb-2">
          {Array.from({length: N}, (_, i) => {
            const n = i + 1;
            const act = getActive(n);
            // inativo: cor neutra que funciona em ambos os modos
            let bg = 'currentColor';
            const isInactive = act.length === 0;

            if (act.length === 1) {
              bg = act[0].color;
            } else if (act.length > 1) {
              bg = `repeating-linear-gradient(45deg, ${act[0].color}, ${act[0].color} 5px, ${act[1].color} 5px, ${act[1].color} 10px)`;
            }

            return (
              <div
                key={n}
                className={`h-10 rounded-sm ${isInactive ? 'bg-zinc-300 dark:bg-zinc-700' : ''}`}
                style={{
                  width: '20px',
                  background: isInactive ? undefined : bg,
                  outline: act.length > 1 ? '2px solid rgba(255,255,255,0.6)' : 'none',
                }}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-500">
          <span>1</span>
          <span>20</span>
          <span>40</span>
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap text-xs text-zinc-600 dark:text-zinc-400">
          {stims.filter(s => s.on).map(s => (
            <div key={s.key} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{background: s.color}} />
              <span>{s.emoji} {s.name}</span>
            </div>
          ))}
          {result.counts.overlap > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{background: 'repeating-linear-gradient(45deg, #888, #888 4px, #fff 4px, #fff 8px)'}} />
              <span>Overlap</span>
            </div>
          )}
        </div>
      </div>

      {/* Passos */}
      <div className="space-y-4">
        {/* Passo 1 */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="font-semibold text-lg mb-3 text-zinc-900 dark:text-zinc-100">Passo 1: H(s) — Entropia do estímulo</div>
          <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded inline-block mb-3 text-zinc-700 dark:text-zinc-300">
            H(s) = −Σ P(s) log₂ P(s)
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            3 estímulos equiprováveis: P(🍎) = P(🍌) = P(🦆) = 1/3<br/>
            H(s) = −3×(1/3)×log₂(1/3) = log₂(3)
          </p>
          <div className="inline-block bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-500 dark:border-purple-400 rounded-lg px-4 py-3">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">H(s)</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">{result.Hs.toFixed(3)}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">bits</div>
          </div>
        </div>

        {/* Passo 2 */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="font-semibold text-lg mb-3 text-zinc-900 dark:text-zinc-100">Passo 2: H(r) — Entropia da resposta</div>
          <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded inline-block mb-3 text-zinc-700 dark:text-zinc-300">
            H(r) = −Σ P(r) log₂ P(r)
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            r ∈ {'{' + result.r_states.map(r => r.key).join(', ') + '}'}<br/>
            P(r) = n_neurônios / 40
          </p>
          <div className="flex gap-3 flex-wrap mb-4">
            {result.r_states.map(st => (
              <div key={st.key} className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg px-4 py-3">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">{st.label}</div>
                <div className="text-2xl font-bold" style={{color: st.color || '#888'}}>{st.n}/40</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">P={st.p.toFixed(3)}</div>
              </div>
            ))}
            <div className="bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-500 dark:border-orange-400 rounded-lg px-4 py-3">
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">H(r)</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-300">{result.Hr.toFixed(3)}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">bits</div>
            </div>
          </div>
        </div>

        {/* Passo 3 */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="font-semibold text-lg mb-3 text-zinc-900 dark:text-zinc-100">Passo 3: H(s,r) e I(s;r)</div>
          <div className="space-y-2 mb-4">
            <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded inline-block text-zinc-700 dark:text-zinc-300">
              H(s,r) = −Σ_s Σ_r P(s,r) log₂ P(s,r)
            </div>
            <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded inline-block text-zinc-700 dark:text-zinc-300">
              P(s,r) = P(s) × P(r|s)
            </div>
          </div>

          {/* Tabela P(r|s) */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1">P(r|s)</th>
                  {result.r_states.map(r => (
                    <th key={r.key} className="border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1">{r.key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.s_values.map(s => {
                  const stim = stims.find(st => st.key === s)!;
                  return (
                    <tr key={s}>
                      <th className="border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 px-2 py-1 text-left">
                        {stim.emoji} {stim.name}
                      </th>
                      {result.r_states.map(r => (
                        <td key={r.key} className="border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-2 py-1 text-center">
                          {result.P_r_given_s[s][r.key].toFixed(3)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="bg-green-50 dark:bg-green-950/40 border-2 border-green-600 dark:border-green-400 rounded-lg px-4 py-3">
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">H(s,r)</div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">{result.Hsr.toFixed(3)}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">bits</div>
            </div>
          </div>

          <div className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded inline-block mb-3 text-zinc-700 dark:text-zinc-300">
            I(s;r) = H(s) + H(r) − H(s,r)
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            I(s;r) = {result.Hs.toFixed(3)} + {result.Hr.toFixed(3)} − {result.Hsr.toFixed(3)}
          </p>
          <div className="bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-600 dark:border-purple-400 rounded-lg px-4 py-3 inline-block">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">I(s;r)</div>
            <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">{result.Isr.toFixed(3)}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">bits</div>
          </div>
        </div>

        {/* Resultado Final */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="font-semibold text-lg mb-4 text-zinc-900 dark:text-zinc-100">Resultado: Sensitividade e Especificidade</div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Sensitividade */}
            <div className={`rounded-xl p-6 text-center ${result.sensitivity > 0.55 ? 'bg-green-50 dark:bg-green-950/40' : 'bg-red-50 dark:bg-red-950/40'}`}>
              <div className={`font-semibold mb-2 ${result.sensitivity > 0.65 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                Sensitividade
              </div>
              <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-3">
                I(s;r) / H(s)<br/>
                {result.Isr.toFixed(3)} / {result.Hs.toFixed(3)}
              </div>
              <div className={`text-5xl font-bold ${result.sensitivity > 0.65 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                {result.sensitivity.toFixed(2)}
              </div>
              <div className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">
                {result.sensitivity > 0.65 ? 'Alta — r informa bem sobre s.' : 'Moderada/Baixa'}
              </div>
            </div>

            {/* Especificidade */}
            <div className={`rounded-xl p-6 text-center ${result.specificity > 0.55 ? 'bg-green-50 dark:bg-green-950/40' : 'bg-red-50 dark:bg-red-950/40'}`}>
              <div className={`font-semibold mb-2 ${result.specificity > 0.65 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                Especificidade
              </div>
              <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-3">
                I(s;r) / H(r)<br/>
                {result.Isr.toFixed(3)} / {result.Hr.toFixed(3)}
              </div>
              <div className={`text-5xl font-bold ${result.specificity > 0.65 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                {result.specificity.toFixed(2)}
              </div>
              <div className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">
                {result.specificity > 0.65 ? 'Alta — s explica bem r.' : 'Moderada/Baixa'}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-sm text-zinc-700 dark:text-zinc-300">
            <strong>💡 Teste:</strong> Desative a banana → neurônios de overlap somem → H(s,r) diminui → I(s;r) sobe → ambas as métricas melhoram!
          </div>
        </div>
      </div>
    </div>
  );
}
