import { useState } from 'react';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';
import { WaterfallChart, type WaterfallEntry } from '../components/WaterfallChart';

export function Ch3_DecompositionProblem() {
  const [x0, setX0] = useState(1000);
  const [y0, setY0] = useState(50);
  const [x1, setX1] = useState(1200);
  const [y1, setY1] = useState(60);
  const [showSliders, setShowSliders] = useState(false);

  const v0 = x0 * y0;
  const v1 = x1 * y1;
  const dV = v1 - v0;
  const xEffect = (x1 - x0) * y0;
  const yEffect = x0 * (y1 - y0);
  const residual = (x1 - x0) * (y1 - y0);
  const residualPct = dV !== 0 ? Math.abs(residual / dV) * 100 : 0;

  // Rectangle dimensions (SVG scaling)
  const maxW = 320;
  const maxH = 200;
  const scale = Math.min(maxW / Math.max(x0, x1), maxH / Math.max(y0, y1));
  const w0 = x0 * scale;
  const h0 = y0 * scale;
  const w1 = x1 * scale;
  const h1 = y1 * scale;
  const svgW = w1 + 60;
  const svgH = h1 + 40;

  const waterfall: WaterfallEntry[] = [
    { name: 'V₀', value: v0, fill: '#111', isTotal: true },
    { name: 'Users', value: xEffect, fill: '#2563eb' },
    { name: 'Price', value: yEffect, fill: '#f59e0b' },
    { name: 'Residual', value: residual, fill: '#ef4444' },
    { name: 'V₁', value: v1, fill: '#111', isTotal: true },
  ];

  const fmtK = (v: number) => {
    if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (Math.abs(v) >= 1e3) return `$${(v / 1000).toFixed(0)}k`;
    return `$${v}`;
  };

  return (
    <section className="chapter" id="chapter-3">
      <div className="chapter-header">
        <span className="chapter-number">Ch.03</span>
        <h2>The Decomposition Problem</h2>
      </div>

      <p>
        Last quarter: <strong>{x0.toLocaleString()} users</strong> × <strong>${y0}/user</strong> = <strong>{fmtK(v0)}</strong> revenue.<br />
        This quarter: <strong>{x1.toLocaleString()} users</strong> × <strong>${y1}/user</strong> = <strong>{fmtK(v1)}</strong> revenue.
      </p>

      <p>
        Revenue changed by <strong>{fmtK(dV)}</strong>. How much came from more users vs. higher price?
      </p>

      <p>
        The natural approach: <strong>hold one factor constant and measure the other.</strong>
      </p>

      <div style={{
        background: 'var(--surface)',
        padding: 'var(--spacing-md)',
        border: '1px solid var(--ink-10)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        lineHeight: 1.8,
      }}>
        <div>"What if only users changed?" → ({x1.toLocaleString()} − {x0.toLocaleString()}) × ${y0} = <strong style={{ color: '#2563eb' }}>{fmtK(xEffect)}</strong></div>
        <div>"What if only price changed?" → {x0.toLocaleString()} × (${y1} − ${y0}) = <strong style={{ color: '#f59e0b' }}>{fmtK(yEffect)}</strong></div>
        <div style={{ marginTop: 8, borderTop: '1px solid var(--ink-10)', paddingTop: 8 }}>
          Sum: {fmtK(xEffect)} + {fmtK(yEffect)} = {fmtK(xEffect + yEffect)}.
          But actual change = {fmtK(dV)}.
          {residual !== 0 && (
            <strong style={{ color: '#ef4444' }}> Missing: {fmtK(residual)}</strong>
          )}
        </div>
      </div>

      <p>
        This is called the <strong>Laspeyres method</strong>. It evaluates each factor at the
        old value of the other. The missing piece — <strong style={{ color: '#ef4444' }}>{fmtK(residual)}</strong> ({residualPct.toFixed(1)}%)
        — is the "interaction effect": extra revenue from <em>new</em> users paying the <em>new</em> price.
        It belongs to both factors simultaneously. No fair way to split it.
      </p>

      {/* Rectangle area visualization */}
      <div className="chart-container">
        <div className="label" style={{ marginBottom: 8 }}>Revenue = Users × Price (as an area)</div>
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ width: '100%', maxWidth: 420, display: 'block' }}
        >
          {/* Old rectangle (base) */}
          <rect x={0} y={svgH - h0} width={w0} height={h0}
            fill="var(--ink)" fillOpacity={0.08} stroke="var(--ink)" strokeWidth={1} />
          <text x={w0 / 2} y={svgH - h0 / 2} textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-mono)" fontSize={11} fill="var(--ink-50)">
            V₀ = {fmtK(v0)}
          </text>

          {/* x-effect strip (horizontal) */}
          <rect x={w0} y={svgH - h0} width={w1 - w0} height={h0}
            fill="#2563eb" fillOpacity={0.3} stroke="#2563eb" strokeWidth={1} />
          <text x={w0 + (w1 - w0) / 2} y={svgH - h0 / 2} textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-mono)" fontSize={9} fill="#2563eb">
            Users
          </text>

          {/* y-effect strip (vertical) */}
          <rect x={0} y={svgH - h1} width={w0} height={h1 - h0}
            fill="#f59e0b" fillOpacity={0.3} stroke="#f59e0b" strokeWidth={1} />
          <text x={w0 / 2} y={svgH - h0 - (h1 - h0) / 2} textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-mono)" fontSize={9} fill="#b45309">
            Price
          </text>

          {/* Residual corner */}
          <rect x={w0} y={svgH - h1} width={w1 - w0} height={h1 - h0}
            fill="#ef4444" fillOpacity={0.35} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={w0 + (w1 - w0) / 2} y={svgH - h0 - (h1 - h0) / 2} textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-mono)" fontSize={8} fill="#dc2626" fontWeight={600}>
            ?
          </text>

          {/* Dimension labels */}
          <text x={w1 / 2} y={svgH + 14} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--ink-50)">
            Users →
          </text>
          <text x={-8} y={svgH - h1 / 2} textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--ink-50)"
            transform={`rotate(-90, -8, ${svgH - h1 / 2})`}>
            Price →
          </text>
        </svg>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-50)', marginTop: 8, marginBottom: 0 }}>
          The <span style={{ color: '#ef4444' }}>red corner</span> is the residual — it belongs to both factors at once.
          Drag the sliders below: when both factors change a lot, the corner dominates.
        </p>
      </div>

      {/* Toggle for sliders */}
      <button
        onClick={() => setShowSliders(!showSliders)}
        style={{
          background: 'none',
          border: '1px solid var(--ink-20)',
          padding: '6px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {showSliders ? 'Hide' : 'Try your own'} values
      </button>

      {showSliders && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
          <Slider label="Users₀" value={x0} min={100} max={5000} step={50} onChange={setX0} format={(v) => v.toFixed(0)} />
          <Slider label="Price₀" value={y0} min={1} max={200} step={1} onChange={setY0} format={(v) => `$${v.toFixed(0)}`} />
          <Slider label="Users₁" value={x1} min={100} max={5000} step={50} onChange={setX1} format={(v) => v.toFixed(0)} />
          <Slider label="Price₁" value={y1} min={1} max={200} step={1} onChange={setY1} format={(v) => `$${v.toFixed(0)}`} />
        </div>
      )}

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">V₀</span>
          <div className="value">{fmtK(v0)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">V₁</span>
          <div className="value">{fmtK(v1)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ΔV</span>
          <div className="value" style={{ color: dV >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
            {dV >= 0 ? '+' : ''}{fmtK(dV)}
          </div>
        </div>
        <div className="kpi-card">
          <span className="label">Residual</span>
          <div className="value negative">{residualPct.toFixed(1)}%</div>
          <div className="annotation">unexplained</div>
        </div>
      </div>

      {/* Waterfall */}
      <div className="chart-container">
        <div className="label" style={{ marginBottom: 8 }}>Laspeyres Decomposition</div>
        <WaterfallChart entries={waterfall} formatValue={fmtK} />
      </div>

      <div className="formula-block">
        <Formula
          tex={`\\underbrace{(x_1 - x_0) \\cdot y_0}_{\\color{blue}{\\text{Users} = ${fmtK(xEffect)}}} + \\underbrace{x_0 \\cdot (y_1 - y_0)}_{\\color{orange}{\\text{Price} = ${fmtK(yEffect)}}} + \\underbrace{(x_1 - x_0)(y_1 - y_0)}_{\\color{red}{\\text{residual} = ${fmtK(residual)}}} = ${fmtK(dV)}`}
          display
        />
      </div>

      <div className="takeaway">
        The residual exists because we're trying to decompose a <em>product</em> in <em>additive</em> space.
        In the rectangle above, the <span style={{ color: '#ef4444' }}>red corner</span> is the
        revenue from <em>new</em> users at the <em>new</em> price — it belongs to both factors.
        We need a method that eliminates this corner entirely. That's where logarithms come in.
      </div>
    </section>
  );
}
