import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ReferenceLine, ResponsiveContainer, Tooltip,
} from 'recharts';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';

// Generate ln(x) data points
const curveData = Array.from({ length: 200 }, (_, i) => {
  const x = 0.1 + (i / 199) * 99.9;
  return { x, y: Math.log(x) };
});

export function Ch1_WhatIsLog() {
  const [x, setX] = useState(10);
  const lnX = Math.log(x);

  return (
    <section className="chapter" id="chapter-1">
      <div className="chapter-header">
        <span className="chapter-number">Ch.01</span>
        <h2>What is a Logarithm?</h2>
      </div>

      <p>
        A logarithm answers a simple question: <strong>what power do I raise a number to, to get
        another number?</strong> If 2<sup>3</sup> = 8, then log<sub>2</sub>(8) = 3.
      </p>

      <p>
        We'll use the <strong>natural logarithm</strong> — written ln(x) — which uses the
        special number <em>e</em> ≈ 2.718 as its base. Drag the slider to explore how ln(x)
        behaves.
      </p>

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">Input x</span>
          <div className="value">{x.toFixed(1)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">ln(x)</span>
          <div className="value">{lnX.toFixed(3)}</div>
        </div>
      </div>

      <Slider
        label="x"
        value={x}
        min={0.1}
        max={100}
        step={0.1}
        onChange={setX}
        format={(v) => v.toFixed(1)}
      />

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={curveData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[0, 100]}
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
              label={{ value: 'x', position: 'insideBottom', offset: -10, style: { fontFamily: 'var(--font-mono)', fontSize: 11 } }}
            />
            <YAxis
              domain={[-2.5, 5]}
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
              label={{ value: 'ln(x)', angle: -90, position: 'insideLeft', style: { fontFamily: 'var(--font-mono)', fontSize: 11 } }}
            />
            <Tooltip
              formatter={(val: any) => Number(val).toFixed(3)}
              labelFormatter={(val: any) => `x = ${Number(val).toFixed(1)}`}
              contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
            />
            {/* Key reference lines */}
            <ReferenceLine y={0} stroke="rgba(17,17,17,0.2)" strokeDasharray="4 4" />
            <ReferenceLine x={1} stroke="rgba(17,17,17,0.15)" strokeDasharray="4 4"
              label={{ value: 'ln(1)=0', position: 'top', style: { fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'rgba(17,17,17,0.4)' } }} />
            <ReferenceLine x={Math.E} stroke="rgba(17,17,17,0.15)" strokeDasharray="4 4"
              label={{ value: 'ln(e)=1', position: 'top', style: { fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'rgba(17,17,17,0.4)' } }} />
            <ReferenceLine x={10} stroke="rgba(17,17,17,0.15)" strokeDasharray="4 4"
              label={{ value: 'ln(10)≈2.3', position: 'top', style: { fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'rgba(17,17,17,0.4)' } }} />
            {/* The curve */}
            <Line
              type="monotone"
              dataKey="y"
              stroke="#111"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            {/* Current point */}
            <ReferenceLine x={x} stroke="#2563eb" strokeDasharray="2 2" />
            <ReferenceLine y={lnX} stroke="#2563eb" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="formula-block">
        <Formula tex={`\\ln(${x.toFixed(1)}) = ${lnX.toFixed(3)}`} display />
      </div>

      <div className="takeaway">
        Logarithm grows slowly. Doubling x only adds a fixed amount to ln(x).
        It "compresses" big numbers — and that compression is exactly what we'll exploit.
      </div>
    </section>
  );
}
