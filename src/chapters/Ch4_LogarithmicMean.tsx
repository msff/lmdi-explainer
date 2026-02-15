import { useState } from 'react';
import { Formula } from '../components/Formula';
import { Slider } from '../components/Slider';
import { logMean } from '../utils/lmdi';

export function Ch4_LogarithmicMean() {
  const [a, setA] = useState(20);
  const [b, setB] = useState(80);

  const geo = Math.sqrt(a * b);
  const log = logMean(a, b);
  const arith = (a + b) / 2;

  const allVals = [a, b, geo, log, arith];
  const lo = Math.min(...allVals) - 5;
  const hi = Math.max(...allVals) + 5;
  const range = hi - lo;
  const pct = (v: number) => ((v - lo) / range) * 100;

  return (
    <section className="chapter" id="chapter-4">
      <div className="chapter-header">
        <span className="chapter-number">Ch.04</span>
        <h2>The Logarithmic Mean</h2>
      </div>

      <p>
        There's a lesser-known type of average sitting between the familiar ones.
        It will be the key to eliminating the residual.
      </p>

      <Slider label="a" value={a} min={1} max={200} step={1} onChange={setA} format={(v) => v.toFixed(0)} />
      <Slider label="b" value={b} min={1} max={200} step={1} onChange={setB} format={(v) => v.toFixed(0)} />

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="label">Geometric Mean</span>
          <div className="value" style={{ color: 'var(--positive)' }}>{geo.toFixed(2)}</div>
          <div className="annotation">√(a×b)</div>
        </div>
        <div className="kpi-card">
          <span className="label">Logarithmic Mean</span>
          <div className="value" style={{ color: 'var(--orange)' }}>{log.toFixed(2)}</div>
          <div className="annotation">(a−b)/(ln a − ln b)</div>
        </div>
        <div className="kpi-card">
          <span className="label">Arithmetic Mean</span>
          <div className="value" style={{ color: 'var(--accent)' }}>{arith.toFixed(2)}</div>
          <div className="annotation">(a+b)/2</div>
        </div>
      </div>

      {/* Number line visualization */}
      <div className="chart-container" style={{ padding: '48px 24px 32px' }}>
        <div className="label" style={{ marginBottom: 24 }}>Number Line — always: geometric ≤ logarithmic ≤ arithmetic</div>

        {/* The line */}
        <div style={{ position: 'relative', height: 60, margin: '0 20px' }}>
          {/* Base line */}
          <div style={{
            position: 'absolute',
            top: 30,
            left: 0,
            right: 0,
            height: 1,
            background: 'var(--ink-20)',
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

          {/* Geometric mean dot */}
          <div style={{ position: 'absolute', left: `${pct(geo)}%`, top: 24, transform: 'translateX(-50%)' }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: 'var(--positive)',
              margin: '0 auto',
            }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textAlign: 'center', marginTop: 6, color: 'var(--positive)' }}>
              GEO {geo.toFixed(1)}
            </div>
          </div>

          {/* Logarithmic mean dot — highlighted */}
          <div style={{ position: 'absolute', left: `${pct(log)}%`, top: 20, transform: 'translateX(-50%)' }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--orange)',
              boxShadow: '0 0 0 3px rgba(245,158,11,0.3)',
              margin: '0 auto',
            }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textAlign: 'center', marginTop: 6, color: 'var(--orange)', fontWeight: 600 }}>
              LOG {log.toFixed(1)}
            </div>
          </div>

          {/* Arithmetic mean dot */}
          <div style={{ position: 'absolute', left: `${pct(arith)}%`, top: 24, transform: 'translateX(-50%)' }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: 'var(--accent)',
              margin: '0 auto',
            }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textAlign: 'center', marginTop: 6, color: 'var(--accent)' }}>
              ARITH {arith.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="formula-block">
        <Formula
          tex={`L(a, b) = \\frac{a - b}{\\ln a - \\ln b} = \\frac{${a} - ${b}}{\\ln ${a} - \\ln ${b}} = ${log.toFixed(2)}`}
          display
        />
      </div>

      <p>
        Notice: as <strong>a approaches b</strong>, all three means converge to the same value.
        The logarithmic mean is always in between.
      </p>

      <div className="takeaway">
        The logarithmic mean is the <em>only</em> weight that exactly converts a difference-of-logs
        back to a difference-of-values. It's not arbitrary — it's forced by the math.
      </div>
    </section>
  );
}
