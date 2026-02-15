import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell, LabelList, Tooltip,
} from 'recharts';
import { Formula } from '../components/Formula';
import { segments as defaultSegments, FACTOR_LABELS, getRevenue } from '../data/revenueData';
import { lmdiDecompose } from '../utils/lmdi';

const COLORS: Record<string, string> = {
  MAU: '#2563eb',
  OPC: '#f59e0b',
  IPO: '#22c55e',
  AIV: '#a855f7',
};

export function Ch7_RevenueDecomp() {
  const [data] = useState(defaultSegments);
  const [viewMode, setViewMode] = useState<'absolute' | 'percent'>('absolute');

  // Compute decomposition
  const decomp = useMemo(() => {
    const sectors = data.map((seg) => ({
      before: [seg.scenario.mau, seg.scenario.opc, seg.scenario.ipo, seg.scenario.aiv],
      after: [seg.forecast.mau, seg.forecast.opc, seg.forecast.ipo, seg.forecast.aiv],
    }));

    // Per-segment decomposition
    const perSegment = data.map((seg) => {
      const sectorResult = lmdiDecompose([{
        before: [seg.scenario.mau, seg.scenario.opc, seg.scenario.ipo, seg.scenario.aiv],
        after: [seg.forecast.mau, seg.forecast.opc, seg.forecast.ipo, seg.forecast.aiv],
      }]);
      return sectorResult;
    });

    // Total across all segments
    const totalContribs = lmdiDecompose(sectors);
    const totalScenario = data.reduce((s, seg) => s + getRevenue(seg.scenario), 0);
    const totalForecast = data.reduce((s, seg) => s + getRevenue(seg.forecast), 0);

    return { perSegment, totalContribs, totalScenario, totalForecast };
  }, [data]);

  const dTotal = decomp.totalForecast - decomp.totalScenario;

  // Waterfall chart data (per factor)
  const waterfallData = useMemo(() => {
    let running = decomp.totalScenario;
    const bars = [
      { name: 'Scenario', base: 0, value: decomp.totalScenario, fill: '#111' },
    ];
    FACTOR_LABELS.forEach((label, k) => {
      const c = decomp.totalContribs[k];
      bars.push({ name: label, base: running, value: c, fill: COLORS[label] });
      running += c;
    });
    bars.push({ name: 'Forecast', base: 0, value: decomp.totalForecast, fill: '#111' });
    return bars;
  }, [decomp]);

  const fmt = (v: number) => {
    if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
    if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
    return v.toFixed(0);
  };

  return (
    <section className="chapter" id="chapter-7">
      <div className="chapter-header">
        <span className="chapter-number">Ch.07</span>
        <h2>Real World — Revenue Decomposition by Segment</h2>
      </div>

      <p>
        Now for the real thing. A company's revenue is the product of 4 factors across 6 user segments.
      </p>

      <div className="formula-block">
        <Formula
          tex={`\\text{Revenue}_i = \\text{MAU}_i \\times \\text{OPC}_i \\times \\text{IPO}_i \\times \\text{AIV}_i`}
          display
        />
      </div>

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
        Demo data — factor values are synthetic. Revenue totals match Jan 2026 screenshot.
      </div>

      {/* KPI Cards */}
      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">Total Scenario</span>
          <div className="value">{fmt(decomp.totalScenario)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">Total Forecast</span>
          <div className="value">{fmt(decomp.totalForecast)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ΔRevenue</span>
          <div className="value" style={{ color: dTotal >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
            {dTotal >= 0 ? '+' : ''}{fmt(dTotal)}
          </div>
        </div>
        <div className="kpi-card">
          <span className="label">Top Factor</span>
          <div className="value" style={{ fontSize: '1.25rem' }}>
            {FACTOR_LABELS[decomp.totalContribs.indexOf(
              decomp.totalContribs.reduce((a, b) => Math.abs(a) > Math.abs(b) ? a : b)
            )]}
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="chart-container">
        <div className="label" style={{ marginBottom: 8 }}>LMDI Factor Contribution Waterfall</div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={waterfallData} margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
            <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }} />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} tickFormatter={(v) => fmt(v)} />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
              formatter={(val: any, name: any) => {
                if (name === 'base') return [null, null];
                return [fmt(Number(val)), name];
              }}
            />
            <Bar dataKey="base" stackId="stack" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="value" stackId="stack" radius={[2, 2, 0, 0]}>
              {waterfallData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: '#111' }}
                formatter={(v: any) => fmt(Number(v))}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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

      {/* Revenue overview table */}
      <div className="chart-container" style={{ marginTop: 'var(--spacing-md)' }}>
        <div className="label" style={{ marginBottom: 12 }}>Segment Revenue Overview</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Scenario</th>
              <th>Forecast</th>
              <th>Diff</th>
              <th>Diff %</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {data.map((seg) => {
              const revS = getRevenue(seg.scenario);
              const revF = getRevenue(seg.forecast);
              const diff = revF - revS;
              const diffPct = revS > 0 ? (diff / revS) * 100 : 0;
              const share = dTotal !== 0 ? (diff / dTotal) * 100 : 0;
              return (
                <tr key={seg.name}>
                  <td>{seg.name}</td>
                  <td>{fmt(revS)}</td>
                  <td>{fmt(revF)}</td>
                  <td className={diff >= 0 ? '' : 'negative'}>{fmt(diff)}</td>
                  <td className={diff >= 0 ? '' : 'negative'}>{diffPct.toFixed(2)}%</td>
                  <td>{share.toFixed(1)}%</td>
                </tr>
              );
            })}
            <tr>
              <td>Total</td>
              <td>{fmt(decomp.totalScenario)}</td>
              <td>{fmt(decomp.totalForecast)}</td>
              <td>{fmt(dTotal)}</td>
              <td>{decomp.totalScenario > 0 ? ((dTotal / decomp.totalScenario) * 100).toFixed(2) : 0}%</td>
              <td>100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="takeaway">
        LMDI cleanly decomposes the total revenue change into contributions from each factor
        (MAU, OPC, IPO, AIV) across all segments. The contributions sum exactly to the total — no residual.
        Every penny is accounted for.
      </div>
    </section>
  );
}
