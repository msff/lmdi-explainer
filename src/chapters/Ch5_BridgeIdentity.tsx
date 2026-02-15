import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';
import { logMean } from '../utils/lmdi';

export function Ch5_BridgeIdentity() {
  const [a, setA] = useState(80);
  const [b, setB] = useState(50);
  const [showSteps, setShowSteps] = useState(false);

  const diff = a - b;
  const L = logMean(a, b);
  const lnDiff = Math.log(a) - Math.log(b);
  const bridgeResult = L * lnDiff;

  const barData = [
    { name: 'a − b', value: diff },
    { name: 'L(a,b) × (ln a − ln b)', value: bridgeResult },
  ];

  return (
    <section className="chapter" id="chapter-5">
      <div className="chapter-header">
        <span className="chapter-number">Ch.05</span>
        <h2>The Bridge Identity</h2>
      </div>

      <p>
        Here's the magic bridge. This identity is just algebra — rearrange the definition of L(a,b).
        But it connects the <strong>"real world"</strong> (a − b) to <strong>"log world"</strong> (ln a − ln b).
      </p>

      <Slider label="a" value={a} min={1} max={200} step={1} onChange={setA} format={(v) => v.toFixed(0)} />
      <Slider label="b" value={b} min={1} max={200} step={1} onChange={setB} format={(v) => v.toFixed(0)} />

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">a − b (real diff)</span>
          <div className="value">{diff.toFixed(2)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">L(a,b)</span>
          <div className="value">{L.toFixed(2)}</div>
          <div className="annotation">the exchange rate</div>
        </div>
        <div className="kpi-card">
          <span className="label">ln a − ln b</span>
          <div className="value">{lnDiff.toFixed(4)}</div>
          <div className="annotation">log-space diff</div>
        </div>
        <div className="kpi-card">
          <span className="label">L × Δln</span>
          <div className="value">{bridgeResult.toFixed(2)}</div>
          <div className="annotation">= a − b ✓</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="label" style={{ marginBottom: 8 }}>These two bars are always equal</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
            <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }} />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              <Cell fill="#111" />
              <Cell fill="#2563eb" />
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fill: '#111' }}
                formatter={(v: any) => Number(v).toFixed(2)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="formula-block">
        <Formula
          tex={`a - b = L(a, b) \\times (\\ln a - \\ln b)`}
          display
        />
      </div>

      {/* Step-by-step proof toggle */}
      <button
        onClick={() => setShowSteps(!showSteps)}
        style={{
          background: 'none',
          border: '1px solid var(--ink-20)',
          padding: '8px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {showSteps ? 'Hide' : 'Show'} algebra proof
      </button>

      {showSteps && (
        <div style={{ background: 'var(--surface)', padding: 'var(--spacing-md)', border: '1px solid var(--ink-10)', marginBottom: 'var(--spacing-md)' }}>
          <div className="formula-block">
            <Formula tex={`L(a,b) = \\frac{a - b}{\\ln a - \\ln b} \\quad \\text{(definition)}`} display />
          </div>
          <div className="formula-block">
            <Formula tex={`L(a,b) \\times (\\ln a - \\ln b) = \\frac{a - b}{\\ln a - \\ln b} \\times (\\ln a - \\ln b)`} display />
          </div>
          <div className="formula-block">
            <Formula tex={`= a - b \\quad \\checkmark`} display />
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-50)', marginTop: 12, marginBottom: 0 }}>
            The log difference cancels out. It's that simple.
          </p>
        </div>
      )}

      <p>
        <strong>Why does this matter?</strong> Because in log-world, products split cleanly into
        sums (Chapter 2). So if V = x × y, then ln V = ln x + ln y, and:
      </p>

      <div className="formula-block">
        <Formula
          tex={`\\Delta V = L(V^T, V^0) \\times \\underbrace{(\\Delta \\ln x + \\Delta \\ln y)}_{\\text{clean split!}}`}
          display
        />
      </div>

      <div className="takeaway">
        This bridge lets us work in log-space (where products split cleanly into sums) and then
        convert back to real numbers. The logarithmic mean is the exchange rate.
      </div>
    </section>
  );
}
