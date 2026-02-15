import { useState } from 'react';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';
import { logMean } from '../utils/lmdi';

export function Ch4_LogarithmicMean() {
  const [a, setA] = useState(80);
  const [b, setB] = useState(50);

  const diff = a - b;
  const lnDiff = Math.log(a) - Math.log(b);
  const L = logMean(a, b);
  const bridgeResult = L * lnDiff;

  // For number line
  const geo = Math.sqrt(a * b);
  const arith = (a + b) / 2;
  const allVals = [a, b, geo, L, arith];
  const lo = Math.min(...allVals) - 5;
  const hi = Math.max(...allVals) + 5;
  const range = hi - lo;
  const pct = (v: number) => ((v - lo) / range) * 100;

  return (
    <section className="chapter" id="chapter-4">
      <div className="chapter-header">
        <span className="chapter-number">Ch.04</span>
        <h2>The Logarithmic Mean — and the Bridge</h2>
      </div>

      <p>
        In Chapter 2, we saw that logs turn products into sums — no residual in log-space.
        In Chapter 3, we saw the residual problem in real-dollar space.
        So here's the plan:
      </p>

      <div style={{
        background: 'var(--surface)',
        padding: 'var(--spacing-md)',
        border: '1px solid var(--ink-10)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        lineHeight: 1.8,
      }}>
        <div><strong>Step 1.</strong> Work in log-space (where products split cleanly — no residual).</div>
        <div><strong>Step 2.</strong> Convert the result back to real dollars.</div>
      </div>

      <p>
        But how do we convert back? We need a <strong>conversion factor</strong> — a number <em>L</em> that
        translates a difference-of-logs into a difference-of-values:
      </p>

      <div className="formula-block">
        <Formula
          tex={`a - b = L \\times (\\ln a - \\ln b)`}
          display
        />
      </div>

      <p>
        Solving for <em>L</em>:
      </p>

      <div className="formula-block">
        <Formula
          tex={`L = \\frac{a - b}{\\ln a - \\ln b}`}
          display
        />
      </div>

      <p>
        This is the <strong>logarithmic mean</strong>. We didn't choose it — the math forced it.
        It's the <em>only</em> number that makes the conversion exact.
      </p>

      <Slider label="a" value={a} min={1} max={200} step={1} onChange={setA} format={(v) => v.toFixed(0)} />
      <Slider label="b" value={b} min={1} max={200} step={1} onChange={setB} format={(v) => v.toFixed(0)} />

      {/* The bridge verification */}
      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">a − b (real diff)</span>
          <div className="value">{diff.toFixed(2)}</div>
        </div>
        <div className="kpi-card">
          <span className="label">L(a,b)</span>
          <div className="value" style={{ color: 'var(--orange)' }}>{L.toFixed(2)}</div>
          <div className="annotation">conversion factor</div>
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

      <p>
        This identity — <strong>a − b = L(a,b) × (ln a − ln b)</strong> — is called the
        <strong> bridge identity</strong>. It connects the real world (differences) to the log world
        (log-differences). The logarithmic mean is the exchange rate between them.
      </p>

      {/* Number line */}
      <div className="chart-container" style={{ padding: '32px 24px 24px' }}>
        <div className="label" style={{ marginBottom: 24 }}>
          Where does the log mean sit? Always: geometric ≤ logarithmic ≤ arithmetic
        </div>
        <div style={{ position: 'relative', height: 60, margin: '0 20px' }}>
          <div style={{
            position: 'absolute', top: 30, left: 0, right: 0,
            height: 1, background: 'var(--ink-20)',
          }} />

          {/* a marker */}
          <div style={{ position: 'absolute', left: `${pct(a)}%`, top: 20, transform: 'translateX(-50%)' }}>
            <div style={{ width: 1, height: 20, background: 'var(--ink-20)', margin: '0 auto' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textAlign: 'center', marginTop: 4 }}>a={a}</div>
          </div>

          {/* b marker */}
          <div style={{ position: 'absolute', left: `${pct(b)}%`, top: 20, transform: 'translateX(-50%)' }}>
            <div style={{ width: 1, height: 20, background: 'var(--ink-20)', margin: '0 auto' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textAlign: 'center', marginTop: 4 }}>b={b}</div>
          </div>

          {/* Geometric mean */}
          <div style={{ position: 'absolute', left: `${pct(geo)}%`, top: 24, transform: 'translateX(-50%)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--positive)', margin: '0 auto' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, textAlign: 'center', marginTop: 4, color: 'var(--positive)' }}>GEO</div>
          </div>

          {/* Logarithmic mean — highlighted */}
          <div style={{ position: 'absolute', left: `${pct(L)}%`, top: 20, transform: 'translateX(-50%)' }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--orange)', boxShadow: '0 0 0 3px rgba(245,158,11,0.3)',
              margin: '0 auto',
            }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textAlign: 'center', marginTop: 4, color: 'var(--orange)', fontWeight: 600 }}>LOG {L.toFixed(1)}</div>
          </div>

          {/* Arithmetic mean */}
          <div style={{ position: 'absolute', left: `${pct(arith)}%`, top: 24, transform: 'translateX(-50%)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', margin: '0 auto' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, textAlign: 'center', marginTop: 4, color: 'var(--accent)' }}>ARITH</div>
          </div>
        </div>
      </div>

      <p>
        <strong>Why does this matter for decomposition?</strong> Because if V = x × y, then
        ln V = ln x + ln y. The change in log-space splits cleanly:
      </p>

      <div className="formula-block">
        <Formula
          tex={`\\Delta V = L(V^1, V^0) \\times \\underbrace{(\\Delta \\ln x + \\Delta \\ln y)}_{\\text{clean split — no residual!}}`}
          display
        />
      </div>

      <p>
        Each factor's contribution in dollars = L × Δln(factor). The pieces add up exactly
        to the total change. The logarithmic mean is what makes this possible.
      </p>

      <div className="takeaway">
        The logarithmic mean is forced on us by the requirement of zero residual. It's the
        unique "exchange rate" that converts log-space decompositions back to real-dollar
        contributions. We derive it, not choose it.
      </div>
    </section>
  );
}
