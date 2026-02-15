import { useState, useMemo } from 'react';
import { Formula } from '../components/Formula';
import { WaterfallChart, type WaterfallEntry } from '../components/WaterfallChart';
import { segments as defaultSegments, FACTOR_LABELS, getRevenue } from '../data/revenueData';
import { lmdiDecompose } from '../utils/lmdi';

const COLORS: Record<string, string> = {
  MAU: '#2563eb',
  OPC: '#f59e0b',
  IPO: '#22c55e',
  AIV: '#a855f7',
};

const FACTOR_DESCRIPTIONS: Record<string, string> = {
  MAU: 'Monthly Active Users',
  OPC: 'Orders Per Customer',
  IPO: 'Items Per Order',
  AIV: 'Average Item Value',
};

export function Ch7_RevenueDecomp() {
  const [data] = useState(defaultSegments);
  const [viewMode, setViewMode] = useState<'absolute' | 'percent'>('absolute');

  const decomp = useMemo(() => {
    const sectors = data.map((seg) => ({
      before: [seg.scenario.mau, seg.scenario.opc, seg.scenario.ipo, seg.scenario.aiv],
      after: [seg.forecast.mau, seg.forecast.opc, seg.forecast.ipo, seg.forecast.aiv],
    }));

    const perSegment = data.map((seg) => {
      return lmdiDecompose([{
        before: [seg.scenario.mau, seg.scenario.opc, seg.scenario.ipo, seg.scenario.aiv],
        after: [seg.forecast.mau, seg.forecast.opc, seg.forecast.ipo, seg.forecast.aiv],
      }]);
    });

    const totalContribs = lmdiDecompose(sectors);
    const totalScenario = data.reduce((s, seg) => s + getRevenue(seg.scenario), 0);
    const totalForecast = data.reduce((s, seg) => s + getRevenue(seg.forecast), 0);

    return { perSegment, totalContribs, totalScenario, totalForecast };
  }, [data]);

  const dTotal = decomp.totalForecast - decomp.totalScenario;

  const waterfallEntries: WaterfallEntry[] = useMemo(() => {
    const entries: WaterfallEntry[] = [
      { name: 'Scenario', value: decomp.totalScenario, fill: '#111', isTotal: true },
    ];
    FACTOR_LABELS.forEach((label, k) => {
      entries.push({ name: label, value: decomp.totalContribs[k], fill: COLORS[label] });
    });
    entries.push({ name: 'Forecast', value: decomp.totalForecast, fill: '#111', isTotal: true });
    return entries;
  }, [decomp]);

  const fmt = (v: number) => {
    if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
    return `$${v.toFixed(0)}`;
  };

  return (
    <section className="chapter" id="chapter-6">
      <div className="chapter-header">
        <span className="chapter-number">Ch.06</span>
        <h2>From Two Factors to Four — Real Revenue Decomposition</h2>
      </div>

      <p>
        In Chapter 5, we decomposed <strong>Revenue = Users × Price</strong> into two factors.
        But real businesses are more complex. A company's revenue is typically a longer chain of factors:
      </p>

      <div className="formula-block">
        <Formula
          tex={`\\text{Revenue} = \\underbrace{\\text{MAU}}_{\\text{users}} \\times \\underbrace{\\text{OPC}}_{\\text{orders/user}} \\times \\underbrace{\\text{IPO}}_{\\text{items/order}} \\times \\underbrace{\\text{AIV}}_{\\text{avg item value}}`}
          display
        />
      </div>

      {/* Factor legend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 24px',
        background: 'var(--surface)',
        padding: 'var(--spacing-md)',
        border: '1px solid var(--ink-10)',
        marginBottom: 'var(--spacing-md)',
      }}>
        {FACTOR_LABELS.map((label) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[label], flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <strong style={{ color: COLORS[label] }}>{label}</strong> — {FACTOR_DESCRIPTIONS[label]}
            </span>
          </div>
        ))}
      </div>

      <p>
        <strong>The beautiful thing about LMDI:</strong> the formula doesn't change when you add more factors.
        With 2 factors, each contribution was L × ln(factor ratio). With 4 factors — same thing,
        just more terms:
      </p>

      <div className="formula-block">
        <Formula
          tex={`\\Delta V_k = L(V^1, V^0) \\times \\ln\\frac{x_k^1}{x_k^0} \\quad \\text{for each factor } k`}
          display
        />
      </div>

      <p>
        And just like with two factors, the contributions sum exactly to the total change — no residual,
        even with four factors. The math scales perfectly.
      </p>

      <p>
        Now for the real thing. This company has <strong>6 user segments</strong>, each with its own
        MAU, OPC, IPO, and AIV values.
      </p>

      <div style={{
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.2)',
        padding: '8px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        marginBottom: 'var(--spacing-md)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Demo data — factor values are synthetic.
      </div>

      {/* KPI Cards */}
      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">Scenario</span>
          <div className="value">{fmt(decomp.totalScenario)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">Forecast</span>
          <div className="value">{fmt(decomp.totalForecast)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ΔRevenue</span>
          <div className="value" style={{ color: dTotal >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
            {dTotal >= 0 ? '+' : ''}{fmt(dTotal)}
          </div>
        </div>
      </div>

      {/* Waterfall Chart — using shared component */}
      <div className="chart-container">
        <div className="label" style={{ marginBottom: 8 }}>LMDI Factor Contribution Waterfall</div>
        <WaterfallChart entries={waterfallEntries} height={340} formatValue={fmt} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', marginTop: 8 }}>
          {FACTOR_LABELS.map((label, k) => (
            <div key={label}>
              {label}: <strong style={{ color: COLORS[label] }}>{fmt(decomp.totalContribs[k])}</strong>
            </div>
          ))}
          <div style={{ color: 'var(--positive)', marginTop: 4 }}>
            Sum = {fmt(decomp.totalContribs.reduce((a, b) => a + b, 0))} = ΔRevenue ✓
          </div>
        </div>
      </div>

      {/* View mode toggle */}
      <div style={{ display: 'flex', gap: 12, margin: 'var(--spacing-md) 0' }}>
        <button
          onClick={() => setViewMode('absolute')}
          style={{
            background: viewMode === 'absolute' ? 'var(--ink)' : 'none',
            color: viewMode === 'absolute' ? 'var(--bg)' : 'var(--ink)',
            border: '1px solid var(--ink-20)',
            padding: '6px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Absolute
        </button>
        <button
          onClick={() => setViewMode('percent')}
          style={{
            background: viewMode === 'percent' ? 'var(--ink)' : 'none',
            color: viewMode === 'percent' ? 'var(--bg)' : 'var(--ink)',
            border: '1px solid var(--ink-20)',
            padding: '6px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Percentage
        </button>
      </div>

      {/* Impact Decomposition Table */}
      <div className="chart-container">
        <div className="label" style={{ marginBottom: 12 }}>Impact Decomposition by Segment</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Revenue Δ</th>
              {FACTOR_LABELS.map((f) => (
                <th key={f} style={{ color: COLORS[f] }}>{f}</th>
              ))}
              <th>Check</th>
            </tr>
          </thead>
          <tbody>
            {data.map((seg, i) => {
              const revS = getRevenue(seg.scenario);
              const revF = getRevenue(seg.forecast);
              const segDelta = revF - revS;
              const contribs = decomp.perSegment[i];

              return (
                <tr key={seg.name}>
                  <td>{seg.name}</td>
                  <td className={segDelta >= 0 ? '' : 'negative'}>
                    {viewMode === 'absolute'
                      ? fmt(segDelta)
                      : segDelta !== 0 ? `${((segDelta / revS) * 100).toFixed(2)}%` : '0%'}
                  </td>
                  {contribs.map((c, k) => (
                    <td key={k} style={{ color: c > 0.5 ? 'var(--positive)' : c < -0.5 ? 'var(--negative)' : 'var(--ink-50)' }}>
                      {viewMode === 'absolute'
                        ? fmt(c)
                        : dTotal !== 0 ? `${((c / Math.abs(dTotal)) * 100).toFixed(1)}%` : '0%'}
                    </td>
                  ))}
                  <td style={{ color: 'var(--ink-50)' }}>
                    {fmt(contribs.reduce((a, b) => a + b, 0))}
                  </td>
                </tr>
              );
            })}
            {/* Total row */}
            <tr>
              <td>Total</td>
              <td>{viewMode === 'absolute' ? fmt(dTotal) : '100%'}</td>
              {decomp.totalContribs.map((c, k) => (
                <td key={k} style={{ color: c > 0.5 ? 'var(--positive)' : c < -0.5 ? 'var(--negative)' : 'var(--ink-50)' }}>
                  {viewMode === 'absolute'
                    ? fmt(c)
                    : dTotal !== 0 ? `${((c / dTotal) * 100).toFixed(1)}%` : '0%'}
                </td>
              ))}
              <td>{fmt(decomp.totalContribs.reduce((a, b) => a + b, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="takeaway">
        LMDI scales from 2 factors to any number — same formula, same guarantee.
        Every dollar of the total revenue change is attributed to a specific factor across all segments.
        No residual. No arbitrary choices. The logarithmic mean handles it all.
      </div>
    </section>
  );
}
