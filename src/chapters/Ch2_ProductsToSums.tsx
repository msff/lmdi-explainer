import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Cell, Tooltip,
} from 'recharts';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';

export function Ch2_ProductsToSums() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(4);

  const product = a * b;
  const lnA = Math.log(a);
  const lnB = Math.log(b);
  const lnProduct = Math.log(product);

  const barData = [
    { name: 'a × b', value: product, fill: '#111' },
  ];

  const stackedData = [
    { name: 'ln(a) + ln(b)', lnA: lnA, lnB: lnB },
  ];

  return (
    <section className="chapter" id="chapter-2">
      <div className="chapter-header">
        <span className="chapter-number">Ch.02</span>
        <h2>The Magic Property — Products Become Sums</h2>
      </div>

      <p>
        This is the <strong>one property</strong> that makes everything work. When you take the
        log of a product, it becomes a sum. Multiplication becomes addition.
      </p>

      <Slider label="a" value={a} min={1} max={20} step={0.5} onChange={setA} format={(v) => v.toFixed(1)} />
      <Slider label="b" value={b} min={1} max={20} step={0.5} onChange={setB} format={(v) => v.toFixed(1)} />

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">a × b</span>
          <div className="value">{product.toFixed(1)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ln(a)</span>
          <div className="value">{lnA.toFixed(3)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ln(b)</span>
          <div className="value">{lnB.toFixed(3)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ln(a×b)</span>
          <div className="value">{lnProduct.toFixed(3)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
        {/* Left: product bar */}
        <div className="chart-container" style={{ flex: 1 }}>
          <div className="label" style={{ marginBottom: 8 }}>Real world (multiplication)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
              <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
              <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                <Cell fill="#111" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: stacked ln bars */}
        <div className="chart-container" style={{ flex: 1 }}>
          <div className="label" style={{ marginBottom: 8 }}>Log world (addition)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stackedData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
              <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
              <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
              <Bar dataKey="lnA" stackId="stack" fill="#2563eb" name="ln(a)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="lnB" stackId="stack" fill="#f59e0b" name="ln(b)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="formula-block">
        <Formula
          tex={`\\ln(${a.toFixed(1)} \\times ${b.toFixed(1)}) = \\ln(${a.toFixed(1)}) + \\ln(${b.toFixed(1)}) = ${lnA.toFixed(3)} + ${lnB.toFixed(3)} = ${lnProduct.toFixed(3)}`}
          display
        />
      </div>

      <div className="takeaway">
        This means if revenue = users × price, then ln(revenue) = ln(users) + ln(price).
        In log-world, factors just add up — no interaction term!
      </div>
    </section>
  );
}
