import { Sidebar } from './components/Sidebar';
import { ScrollReveal } from './components/ScrollReveal';
import { useScrollChapter } from './hooks/useScrollChapter';
import { Ch1_WhatIsLog } from './chapters/Ch1_WhatIsLog';
import { Ch2_ProductsToSums } from './chapters/Ch2_ProductsToSums';
import { Ch3_DecompositionProblem } from './chapters/Ch3_DecompositionProblem';
import { Ch4_LogarithmicMean } from './chapters/Ch4_LogarithmicMean';
import { Ch6_LmdiInAction } from './chapters/Ch6_LmdiInAction';
import { Ch7_RevenueDecomp } from './chapters/Ch7_RevenueDecomp';
import { Ch8_History } from './chapters/Ch8_History';

const FACTORS = [
  { label: 'Users', color: '#2563eb' },
  { label: 'Frequency', color: '#f59e0b' },
  { label: 'Basket', color: '#22c55e' },
  { label: 'Price', color: '#a855f7' },
] as const;

function HeroInfographic() {
  // Single mystery waterfall: Start → ? → ? → ? → ? → End
  const svgW = 460;
  const svgH = 140;
  const baseY = 108;
  const barW = 52;
  const gap = 12;

  // Center the 6 bars (start + 4 factors + end)
  const totalW = 6 * barW + 5 * gap;
  const startX = (svgW - totalW) / 2;

  // Heights: start bar + factor bars must equal end bar
  const startH = 50;
  const factorHs = [8, 5, 11, 7]; // total = 31
  const endH = startH + factorHs.reduce((s, h) => s + h, 0); // 81

  // Running Y tracks the waterfall top as bars stack upward
  let runY = baseY - startH; // top of start bar

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--ink-10)',
      padding: '20px 24px 16px',
      marginTop: 'var(--spacing-md)',
    }}>
      {/* Factor equation bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Revenue</span>
        <span style={{ color: 'var(--ink-50)' }}>=</span>
        {FACTORS.map((f, i) => (
          <span key={f.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              background: f.color,
              color: '#fff',
              padding: '3px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}>
              {f.label}
            </span>
            {i < FACTORS.length - 1 && (
              <span style={{ color: 'var(--ink-20)', fontWeight: 300 }}>×</span>
            )}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', display: 'block' }}>
        {/* Start bar */}
        <rect x={startX} y={baseY - startH} width={barW} height={startH}
          fill="var(--ink-20)" rx={2} />
        <text x={startX + barW / 2} y={baseY + 14}
          textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--ink)"
          fontFamily="var(--font-mono)">
          $310M
        </text>

        {/* Factor bars — floating waterfall, each stacks upward */}
        {FACTORS.map((f, i) => {
          const x = startX + (i + 1) * (barW + gap);
          const h = factorHs[i];
          const barBottom = runY;    // bottom of this bar = top of previous
          const barTop = runY - h;   // this bar extends upward
          runY = barTop;             // next bar starts at this top
          return (
            <g key={f.label}>
              {/* Dashed connector from previous bar top to this bar bottom */}
              <line
                x1={x - gap} x2={x}
                y1={barBottom} y2={barBottom}
                stroke="var(--ink-10)" strokeWidth={1} strokeDasharray="3 2"
              />
              {/* Dashed mystery bar */}
              <rect x={x} y={barTop} width={barW} height={h}
                fill={f.color} fillOpacity={0.15} stroke={f.color}
                strokeWidth={1.5} strokeDasharray="4 3" rx={2} />
              {/* "?" label centered in bar */}
              <text x={x + barW / 2} y={barTop + h / 2 + 4}
                textAnchor="middle" fontSize={12} fontWeight={700} fill={f.color}
                fontFamily="var(--font-mono)">
                ?
              </text>
              {/* Factor name above */}
              <text x={x + barW / 2} y={barTop - 6}
                textAnchor="middle" fontSize={8} fontWeight={600} fill={f.color}
                fontFamily="var(--font-mono)">
                {f.label}
              </text>
            </g>
          );
        })}

        {/* End bar */}
        {(() => {
          const endX = startX + 5 * (barW + gap);
          return (
            <>
              {/* Connector from last factor to end bar */}
              <line
                x1={endX - gap} x2={endX}
                y1={runY} y2={runY}
                stroke="var(--ink-10)" strokeWidth={1} strokeDasharray="3 2"
              />
              <rect x={endX} y={baseY - endH} width={barW} height={endH}
                fill="var(--ink)" rx={2} />
              <text x={endX + barW / 2} y={baseY + 14}
                textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--ink)"
                fontFamily="var(--font-mono)">
                $378M
              </text>
            </>
          );
        })()}

        {/* "+$68M — how to split?" annotation between start and end */}
        {(() => {
          const annX1 = startX + barW + 6;
          const annX2 = startX + 5 * (barW + gap) - 6;
          const annY = baseY + 28;
          return (
            <>
              <line x1={annX1} x2={annX2} y1={annY} y2={annY}
                stroke="var(--ink-20)" strokeWidth={1} />
              <line x1={annX1} x2={annX1} y1={annY - 3} y2={annY + 3}
                stroke="var(--ink-20)" strokeWidth={1} />
              <line x1={annX2} x2={annX2} y1={annY - 3} y2={annY + 3}
                stroke="var(--ink-20)" strokeWidth={1} />
              <text x={(annX1 + annX2) / 2} y={annY - 6}
                textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--ink-50)"
                fontFamily="var(--font-mono)">
                +$68M — how to split?
              </text>
            </>
          );
        })()}
      </svg>
    </div>
  );
}

export default function App() {
  const activeChapter = useScrollChapter();

  return (
    <>
      <Sidebar active={activeChapter} />
      <main>
        <header style={{ marginBottom: 'var(--spacing-xl)' }}>
          <ScrollReveal>
            <div className="label" style={{ marginBottom: 8 }}>Interactive Explainer</div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1>LMDI Decomposition</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p style={{ maxWidth: 580, marginTop: 'var(--spacing-sm)', fontSize: '0.9375rem', color: 'var(--ink-50)' }}>
              Revenue grew from $310M to $378M. <strong style={{ color: 'var(--ink)' }}>How much
              came from each factor?</strong> This explainer builds the answer from first principles.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <HeroInfographic />
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--ink-50)',
              marginTop: 12,
              letterSpacing: '0.02em',
            }}>
              No prerequisites beyond arithmetic. 7 chapters. Fully interactive.
            </p>
          </ScrollReveal>
        </header>
        <ScrollReveal><Ch1_WhatIsLog /></ScrollReveal>
        <ScrollReveal><Ch2_ProductsToSums /></ScrollReveal>
        <ScrollReveal><Ch3_DecompositionProblem /></ScrollReveal>
        <ScrollReveal><Ch4_LogarithmicMean /></ScrollReveal>
        <ScrollReveal><Ch6_LmdiInAction /></ScrollReveal>
        <ScrollReveal><Ch7_RevenueDecomp /></ScrollReveal>
        <ScrollReveal><Ch8_History /></ScrollReveal>
      </main>
    </>
  );
}
