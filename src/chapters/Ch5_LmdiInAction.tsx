import { useState } from 'react';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';
import { WaterfallChart, type WaterfallEntry } from '../components/WaterfallChart';
import { logMean, lmdiSimple } from '../utils/lmdi';
import { formatCurrency } from '../utils/format';

export function Ch5_LmdiInAction() {
  const [users0, setUsers0] = useState(600);
  const [price0, setPrice0] = useState(30);
  const [users1, setUsers1] = useState(1400);
  const [price1, setPrice1] = useState(70);

  const rev0 = users0 * price0;
  const rev1 = users1 * price1;
  const { dX: dUsers, dY: dPrice, total: dRev } = lmdiSimple(users0, price0, users1, price1);

  // Laspeyres for comparison
  const laspUsers = (users1 - users0) * price0;
  const laspPrice = users0 * (price1 - price0);
  const laspResid = (users1 - users0) * (price1 - price0);

  const lmdiEntries: WaterfallEntry[] = [
    { name: 'Rev\u2080', value: rev0, fill: '#111', isTotal: true },
    { name: 'Users', value: dUsers, fill: '#2563eb' },
    { name: 'Price', value: dPrice, fill: '#f59e0b' },
    { name: 'Rev\u2081', value: rev1, fill: '#111', isTotal: true },
  ];

  const laspEntries: WaterfallEntry[] = [
    { name: 'Rev\u2080', value: rev0, fill: '#111', isTotal: true },
    { name: 'Users', value: laspUsers, fill: '#2563eb' },
    { name: 'Price', value: laspPrice, fill: '#f59e0b' },
    { name: 'Residual', value: laspResid, fill: '#ef4444' },
    { name: 'Rev\u2081', value: rev1, fill: '#111', isTotal: true },
  ];

  const L = logMean(rev1, rev0);

  return (
    <section className="chapter" id="chapter-5">
      <div className="chapter-header">
        <span className="chapter-number">Ch.05</span>
        <h2>LMDI in Action</h2>
      </div>

      <p>
        Now let's put it all together. <strong>Revenue = Users × Price.</strong> Revenue changed
        from {formatCurrency(rev0)} to {formatCurrency(rev1)}. How much from each factor?
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
          <div className="value">{formatCurrency(rev0)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">Revenue₁</span>
          <div className="value">{formatCurrency(rev1)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ΔRevenue</span>
          <div className="value" style={{ color: dRev >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
            {dRev >= 0 ? '+' : ''}{formatCurrency(dRev)}
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
        <div className="chart-container">
          <div className="label" style={{ marginBottom: 8 }}>Laspeyres (with residual)</div>
          <WaterfallChart entries={laspEntries} height={280} formatValue={formatCurrency} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', marginTop: 8 }}>
            <div>Users: <strong style={{ color: '#2563eb' }}>{formatCurrency(laspUsers)}</strong></div>
            <div>Price: <strong style={{ color: '#f59e0b' }}>{formatCurrency(laspPrice)}</strong></div>
            <div>Residual: <strong style={{ color: '#ef4444' }}>{formatCurrency(laspResid)}</strong></div>
          </div>
        </div>
        <div className="chart-container">
          <div className="label" style={{ marginBottom: 8 }}>LMDI (exact, no residual)</div>
          <WaterfallChart entries={lmdiEntries} height={280} formatValue={formatCurrency} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', marginTop: 8 }}>
            <div>Users: <strong style={{ color: '#2563eb' }}>{formatCurrency(dUsers)}</strong></div>
            <div>Price: <strong style={{ color: '#f59e0b' }}>{formatCurrency(dPrice)}</strong></div>
            <div style={{ color: 'var(--positive)' }}>No residual ✓</div>
          </div>
        </div>
      </div>

      {/* Step-by-step calculation */}
      <div style={{ background: 'var(--surface)', padding: 'var(--spacing-md)', border: '1px solid var(--ink-10)', marginTop: 'var(--spacing-md)' }}>
        <div className="label" style={{ marginBottom: 12 }}>Step-by-step LMDI</div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-50)', margin: '0 0 8px' }}>
          Step 1: Compute the logarithmic mean — our conversion factor.
        </p>
        <div className="formula-block">
          <Formula tex={`L(V^1, V^0) = \\frac{${rev1.toLocaleString()} - ${rev0.toLocaleString()}}{\\ln ${rev1} - \\ln ${rev0}} = ${L.toFixed(2)}`} display />
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-50)', margin: '0 0 8px' }}>
          Step 2: Multiply L by each factor's log-ratio.
        </p>
        <div className="formula-block">
          <Formula tex={`\\Delta V_{\\text{users}} = ${L.toFixed(1)} \\times \\ln\\frac{${users1}}{${users0}} = ${dUsers.toFixed(1)}`} display />
        </div>
        <div className="formula-block">
          <Formula tex={`\\Delta V_{\\text{price}} = ${L.toFixed(1)} \\times \\ln\\frac{${price1}}{${price0}} = ${dPrice.toFixed(1)}`} display />
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-50)', margin: '0 0 8px' }}>
          Step 3: Verify — they sum to the exact total change.
        </p>
        <div className="formula-block">
          <Formula
            tex={`${dUsers.toFixed(1)} + ${dPrice.toFixed(1)} = ${(dUsers + dPrice).toFixed(1)} = ${dRev.toFixed(1)} \\; \\checkmark`}
            display
          />
        </div>
      </div>

      <div className="takeaway">
        Compare the two waterfalls. Laspeyres leaves a <span style={{ color: '#ef4444' }}>red residual</span> that
        nobody can explain. LMDI gives a clean two-way split — every dollar accounted for. The
        logarithmic mean absorbed the interaction effect that Laspeyres couldn't handle.
      </div>
    </section>
  );
}
