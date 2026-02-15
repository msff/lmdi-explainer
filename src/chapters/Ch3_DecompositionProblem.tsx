import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Cell, LabelList,
} from 'recharts';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';

export function Ch3_DecompositionProblem() {
  const [x0, setX0] = useState(5);
  const [y0, setY0] = useState(10);
  const [x1, setX1] = useState(7);
  const [y1, setY1] = useState(12);

  const v0 = x0 * y0;
  const v1 = x1 * y1;
  const dV = v1 - v0;
  const xEffect = (x1 - x0) * y0;
  const yEffect = x0 * (y1 - y0);
  const residual = (x1 - x0) * (y1 - y0);
  const residualPct = dV !== 0 ? Math.abs(residual / dV) * 100 : 0;

  // Waterfall data: base → +xEffect → +yEffect → +residual → final
  const waterfall = [
    { name: 'Base (V₀)', base: 0, value: v0, fill: '#111' },
    { name: 'x effect', base: v0, value: xEffect, fill: '#2563eb' },
    { name: 'y effect', base: v0 + xEffect, value: yEffect, fill: '#f59e0b' },
    { name: 'Residual', base: v0 + xEffect + yEffect, value: residual, fill: '#ef4444' },
    { name: 'Final (V₁)', base: 0, value: v1, fill: '#111' },
  ];

  return (
    <section className="chapter" id="chapter-3">
      <div className="chapter-header">
        <span className="chapter-number">Ch.03</span>
        <h2>The Decomposition Problem</h2>
      </div>

      <p>
        Imagine revenue went from <strong>{v0}</strong> to <strong>{v1}</strong>.
        Revenue = x × y. How much came from more x vs higher y?
      </p>

      <p>
        The naive approach — the <strong>Laspeyres method</strong> — leaves a mystery
        "residual" that nobody can explain. Watch the red bar:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
        <Slider label="x₀" value={x0} min={1} max={20} step={1} onChange={setX0} format={(v) => v.toFixed(0)} />
        <Slider label="y₀" value={y0} min={1} max={20} step={1} onChange={setY0} format={(v) => v.toFixed(0)} />
        <Slider label="x₁" value={x1} min={1} max={20} step={1} onChange={setX1} format={(v) => v.toFixed(0)} />
        <Slider label="y₁" value={y1} min={1} max={20} step={1} onChange={setY1} format={(v) => v.toFixed(0)} />
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">V₀ = x₀ × y₀</span>
          <div className="value">{v0}</div>
        </div>
        <div className="kpi-card">
          <span className="label">V₁ = x₁ × y₁</span>
          <div className="value">{v1}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ΔV</span>
          <div className="value" style={{ color: dV >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
            {dV >= 0 ? '+' : ''}{dV}
          </div>
        </div>
        <div className="kpi-card">
          <span className="label">Residual</span>
          <div className="value negative">{residualPct.toFixed(1)}%</div>
          <div className="annotation">unexplained</div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={waterfall} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
            <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }} />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
              formatter={(val: any, name: any) => {
                if (name === 'base') return [null, null];
                return [Number(val).toFixed(1), name];
              }}
            />
            {/* Invisible base */}
            <Bar dataKey="base" stackId="stack" fill="transparent" isAnimationActive={false} />
            {/* Visible segment */}
            <Bar dataKey="value" stackId="stack" radius={[2, 2, 0, 0]}>
              {waterfall.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: '#111' }}
                formatter={(v: any) => Number(v).toFixed(0)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="formula-block">
        <Formula
          tex={`\\underbrace{(x_1 - x_0) \\cdot y_0}_{\\text{x effect} = ${xEffect}} + \\underbrace{x_0 \\cdot (y_1 - y_0)}_{\\text{y effect} = ${yEffect}} + \\underbrace{(x_1 - x_0)(y_1 - y_0)}_{\\color{red}{\\text{residual} = ${residual}}} = ${dV}`}
          display
        />
      </div>

      <div className="takeaway">
        The residual exists because we're trying to decompose a <em>product</em> in <em>additive</em> space.
        It's like trying to cut a rectangle's area into two strips — the corner piece doesn't belong to either side.
      </div>
    </section>
  );
}
