import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell, LabelList, Tooltip,
} from 'recharts';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';
import { logMean, lmdiSimple } from '../utils/lmdi';

export function Ch6_LmdiInAction() {
  const [users0, setUsers0] = useState(1000);
  const [price0, setPrice0] = useState(50);
  const [users1, setUsers1] = useState(1200);
  const [price1, setPrice1] = useState(60);
  const [showLaspeyres, setShowLaspeyres] = useState(false);

  const rev0 = users0 * price0;
  const rev1 = users1 * price1;
  const { dX: dUsers, dY: dPrice, total: dRev } = lmdiSimple(users0, price0, users1, price1);

  // Laspeyres for comparison
  const laspUsers = (users1 - users0) * price0;
  const laspPrice = users0 * (price1 - price0);
  const laspResid = (users1 - users0) * (price1 - price0);

  // LMDI waterfall
  const lmdiWaterfall = [
    { name: 'Revenue₀', base: 0, value: rev0, fill: '#111' },
    { name: 'Users effect', base: rev0, value: dUsers, fill: '#2563eb' },
    { name: 'Price effect', base: rev0 + dUsers, value: dPrice, fill: '#f59e0b' },
    { name: 'Revenue₁', base: 0, value: rev1, fill: '#111' },
  ];

  // Laspeyres waterfall
  const laspWaterfall = [
    { name: 'Revenue₀', base: 0, value: rev0, fill: '#111' },
    { name: 'Users effect', base: rev0, value: laspUsers, fill: '#2563eb' },
    { name: 'Price effect', base: rev0 + laspUsers, value: laspPrice, fill: '#f59e0b' },
    { name: 'Residual', base: rev0 + laspUsers + laspPrice, value: laspResid, fill: '#ef4444' },
    { name: 'Revenue₁', base: 0, value: rev1, fill: '#111' },
  ];

  const waterfall = showLaspeyres ? laspWaterfall : lmdiWaterfall;
  const L = logMean(rev1, rev0);

  return (
    <section className="chapter" id="chapter-6">
      <div className="chapter-header">
        <span className="chapter-number">Ch.06</span>
        <h2>LMDI in Action — Simple Example</h2>
      </div>

      <p>
        Now let's combine everything. <strong>Revenue = Users × Price.</strong> Revenue changed.
        How much from each factor?
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
        <Slider label="Users₀" value={users0} min={100} max={5000} step={50} onChange={setUsers0} format={(v) => v.toFixed(0)} />
        <Slider label="Price₀" value={price0} min={1} max={200} step={1} onChange={setPrice0} format={(v) => `$${v.toFixed(0)}`} />
        <Slider label="Users₁" value={users1} min={100} max={5000} step={50} onChange={setUsers1} format={(v) => v.toFixed(0)} />
        <Slider label="Price₁" value={price1} min={1} max={200} step={1} onChange={setPrice1} format={(v) => `$${v.toFixed(0)}`} />
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">Revenue₀</span>
          <div className="value">${rev0.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <span className="label">Revenue₁</span>
          <div className="value">${rev1.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ΔRevenue</span>
          <div className="value" style={{ color: dRev >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
            {dRev >= 0 ? '+' : ''}{dRev.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--spacing-md)' }}>
        <button
          onClick={() => setShowLaspeyres(false)}
          style={{
            background: !showLaspeyres ? 'var(--ink)' : 'none',
            color: !showLaspeyres ? 'var(--bg)' : 'var(--ink)',
            border: '1px solid var(--ink-20)',
            padding: '6px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          LMDI (no residual)
        </button>
        <button
          onClick={() => setShowLaspeyres(true)}
          style={{
            background: showLaspeyres ? 'var(--ink)' : 'none',
            color: showLaspeyres ? 'var(--bg)' : 'var(--ink)',
            border: '1px solid var(--ink-20)',
            padding: '6px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Laspeyres (with residual)
        </button>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={waterfall} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
            <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }} />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
              formatter={(val: any, name: any) => {
                if (name === 'base') return [null, null];
                return [`$${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, name];
              }}
            />
            <Bar dataKey="base" stackId="stack" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="value" stackId="stack" radius={[2, 2, 0, 0]}>
              {waterfall.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#111' }}
                formatter={(v: any) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Step-by-step calculation */}
      <div style={{ background: 'var(--surface)', padding: 'var(--spacing-md)', border: '1px solid var(--ink-10)' }}>
        <div className="label" style={{ marginBottom: 12 }}>Step-by-step LMDI</div>
        <div className="formula-block">
          <Formula tex={`L(V^1, V^0) = \\frac{${rev1} - ${rev0}}{\\ln ${rev1} - \\ln ${rev0}} = ${L.toFixed(2)}`} display />
        </div>
        <div className="formula-block">
          <Formula tex={`\\Delta V_{\\text{users}} = ${L.toFixed(1)} \\times \\ln\\frac{${users1}}{${users0}} = ${dUsers.toFixed(1)}`} display />
        </div>
        <div className="formula-block">
          <Formula tex={`\\Delta V_{\\text{price}} = ${L.toFixed(1)} \\times \\ln\\frac{${price1}}{${price0}} = ${dPrice.toFixed(1)}`} display />
        </div>
        <div className="formula-block">
          <Formula
            tex={`\\Delta V_{\\text{users}} + \\Delta V_{\\text{price}} = ${dUsers.toFixed(1)} + ${dPrice.toFixed(1)} = ${(dUsers + dPrice).toFixed(1)} \\approx ${dRev.toFixed(1)} \\; \\checkmark`}
            display
          />
        </div>
      </div>

      <div className="takeaway">
        LMDI gives a clean split. The bars add up exactly to the total change.
        No residual, no arbitrary choices. Toggle to Laspeyres to see the difference.
      </div>
    </section>
  );
}
