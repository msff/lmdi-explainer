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
              const checkSum = contribs.reduce((a, b) => a + b, 0);

              const pct = (v: number) => dTotal !== 0 ? `${((v / dTotal) * 100).toFixed(1)}%` : '0%';
              const colorFor = (v: number) => v > 0.5 ? 'var(--positive)' : v < -0.5 ? 'var(--negative)' : 'var(--ink-50)';

              return (
                <tr key={seg.name}>
                  <td>{seg.name}</td>
                  <td style={{ color: colorFor(segDelta) }}>
                    {viewMode === 'absolute' ? fmt(segDelta) : pct(segDelta)}
                  </td>
                  {contribs.map((c, k) => (
                    <td key={k} style={{ color: colorFor(c) }}>
                      {viewMode === 'absolute' ? fmt(c) : pct(c)}
                    </td>
                  ))}
                  <td style={{ color: 'var(--ink-50)' }}>
                    {viewMode === 'absolute' ? fmt(checkSum) : pct(checkSum)}
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
              <td>{viewMode === 'absolute' ? fmt(decomp.totalContribs.reduce((a, b) => a + b, 0)) : '100%'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="takeaway">
        LMDI scales from 2 factors to any number — same formula, same guarantee.
        Every dollar of the total revenue change is attributed to a specific factor across all segments.
        No residual. No arbitrary choices. The logarithmic mean handles it all.
      </div>

      {/* ─── Excel Implementation Guide ─────────────── */}
      <h3 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>
        Hands-on: Build This in Excel
      </h3>

      <p>
        You need exactly <strong>three formulas</strong> to implement LMDI in a spreadsheet.
        Here's the layout — each segment gets one row.
      </p>

      {/* Spreadsheet layout preview */}
      <div className="chart-container" style={{ overflowX: 'auto' }}>
        <div className="label" style={{ marginBottom: 12 }}>Spreadsheet Layout</div>
        <table className="data-table" style={{ fontSize: '0.75rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', color: 'var(--ink-50)' }}></th>
              <th style={{ textAlign: 'center' }}>A</th>
              <th style={{ textAlign: 'center' }}>B</th>
              <th style={{ textAlign: 'center' }}>C</th>
              <th style={{ textAlign: 'center' }}>D</th>
              <th style={{ textAlign: 'center' }}>E</th>
              <th style={{ textAlign: 'center' }}>F</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>1</td>
              <td style={{ fontWeight: 600 }}>Segment</td>
              <td style={{ fontWeight: 600 }}>MAU₀</td>
              <td style={{ fontWeight: 600 }}>OPC₀</td>
              <td style={{ fontWeight: 600 }}>IPO₀</td>
              <td style={{ fontWeight: 600 }}>AIV₀</td>
              <td style={{ fontWeight: 600 }}>Rev₀</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>2</td>
              <td>{data[0].name}</td>
              <td>{data[0].scenario.mau.toLocaleString()}</td>
              <td>{data[0].scenario.opc}</td>
              <td>{data[0].scenario.ipo}</td>
              <td>{data[0].scenario.aiv}</td>
              <td style={{ color: 'var(--accent)' }}>=B2*C2*D2*E2</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>3…</td>
              <td colSpan={6} style={{ color: 'var(--ink-50)', fontStyle: 'italic', textAlign: 'center' }}>
                …one row per segment…
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ height: 12 }} />
        <table className="data-table" style={{ fontSize: '0.75rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', color: 'var(--ink-50)' }}></th>
              <th style={{ textAlign: 'center' }}>A</th>
              <th style={{ textAlign: 'center' }}>B</th>
              <th style={{ textAlign: 'center' }}>C</th>
              <th style={{ textAlign: 'center' }}>D</th>
              <th style={{ textAlign: 'center' }}>E</th>
              <th style={{ textAlign: 'center' }}>F</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>8</td>
              <td style={{ fontWeight: 600 }}>Segment</td>
              <td style={{ fontWeight: 600 }}>MAU₁</td>
              <td style={{ fontWeight: 600 }}>OPC₁</td>
              <td style={{ fontWeight: 600 }}>IPO₁</td>
              <td style={{ fontWeight: 600 }}>AIV₁</td>
              <td style={{ fontWeight: 600 }}>Rev₁</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>9</td>
              <td>{data[0].name}</td>
              <td>{data[0].forecast.mau.toLocaleString()}</td>
              <td>{data[0].forecast.opc}</td>
              <td>{data[0].forecast.ipo}</td>
              <td>{data[0].forecast.aiv}</td>
              <td style={{ color: 'var(--accent)' }}>=B9*C9*D9*E9</td>
            </tr>
          </tbody>
        </table>

        <div style={{ height: 12 }} />
        <table className="data-table" style={{ fontSize: '0.75rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', color: 'var(--ink-50)' }}></th>
              <th style={{ textAlign: 'center' }}>A</th>
              <th style={{ textAlign: 'center' }}>B</th>
              <th style={{ textAlign: 'center', color: COLORS.MAU }}>C</th>
              <th style={{ textAlign: 'center', color: COLORS.OPC }}>D</th>
              <th style={{ textAlign: 'center', color: COLORS.IPO }}>E</th>
              <th style={{ textAlign: 'center', color: COLORS.AIV }}>F</th>
              <th style={{ textAlign: 'center' }}>G</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>15</td>
              <td style={{ fontWeight: 600 }}>Segment</td>
              <td style={{ fontWeight: 600 }}>L</td>
              <td style={{ fontWeight: 600, color: COLORS.MAU }}>ΔMAU</td>
              <td style={{ fontWeight: 600, color: COLORS.OPC }}>ΔOPC</td>
              <td style={{ fontWeight: 600, color: COLORS.IPO }}>ΔIPO</td>
              <td style={{ fontWeight: 600, color: COLORS.AIV }}>ΔAIV</td>
              <td style={{ fontWeight: 600 }}>Check</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>16</td>
              <td>{data[0].name}</td>
              <td style={{ color: 'var(--accent)', fontSize: '0.625rem' }}><span title="Logarithmic Mean">=IF(F9=F2, F2, (F9-F2)/(LN(F9)-LN(F2)))</span></td>
              <td style={{ color: COLORS.MAU }}>=B16*LN(B9/B2)</td>
              <td style={{ color: COLORS.OPC }}>=B16*LN(C9/C2)</td>
              <td style={{ color: COLORS.IPO }}>=B16*LN(D9/D2)</td>
              <td style={{ color: COLORS.AIV }}>=B16*LN(E9/E2)</td>
              <td style={{ color: 'var(--ink-50)' }}>=SUM(C16:F16)</td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>17…</td>
              <td colSpan={7} style={{ color: 'var(--ink-50)', fontStyle: 'italic', textAlign: 'center' }}>
                …one row per segment, same formulas…
              </td>
            </tr>
            <tr>
              <td style={{ color: 'var(--ink-50)', fontWeight: 600 }}>22</td>
              <td style={{ fontWeight: 600 }}>Total</td>
              <td></td>
              <td style={{ color: COLORS.MAU }}>=SUM(C16:C21)</td>
              <td style={{ color: COLORS.OPC }}>=SUM(D16:D21)</td>
              <td style={{ color: COLORS.IPO }}>=SUM(E16:E21)</td>
              <td style={{ color: COLORS.AIV }}>=SUM(F16:F21)</td>
              <td style={{ fontWeight: 600 }}>=SUM(C22:F22)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Formula breakdown */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--ink-10)',
        padding: 'var(--spacing-md)',
        marginTop: 'var(--spacing-md)',
      }}>
        <div className="label" style={{ marginBottom: 12 }}>The Three Formulas</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-50)', marginBottom: 4 }}>
            Formula 1 — Revenue (just multiply factors):
          </div>
          <code style={{
            display: 'block',
            background: 'var(--ink-05)',
            padding: '8px 12px',
            fontSize: '0.8125rem',
          }}>
            =MAU * OPC * IPO * AIV
          </code>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-50)', marginBottom: 4 }}>
            Formula 2 — Logarithmic mean (the conversion factor):
          </div>
          <code style={{
            display: 'block',
            background: 'var(--ink-05)',
            padding: '8px 12px',
            fontSize: '0.8125rem',
          }}>
            =IF(Rev₁=Rev₀, Rev₀, (Rev₁ - Rev₀) / (LN(Rev₁) - LN(Rev₀)))
          </code>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-50)', marginTop: 4 }}>
            The IF handles the edge case where revenue didn't change (avoids division by zero).
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-50)', marginBottom: 4 }}>
            Formula 3 — Factor contribution (repeat for each factor):
          </div>
          <code style={{
            display: 'block',
            background: 'var(--ink-05)',
            padding: '8px 12px',
            fontSize: '0.8125rem',
          }}>
            =L * LN(Factor₁ / Factor₀)
          </code>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-50)', marginTop: 4 }}>
            That's it. Multiply L by the log-ratio of each factor. Sum across all segments for total impact.
          </div>
        </div>
      </div>

      <div className="takeaway" style={{ marginTop: 'var(--spacing-md)' }}>
        The Check column must equal Rev₁ − Rev₀ for each segment — if it doesn't, you have a formula error.
        That's the LMDI guarantee: contributions always sum to the exact total change.
      </div>
    </section>
  );
}
