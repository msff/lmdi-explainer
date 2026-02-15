export function Ch8_History() {
  const timeline = [
    {
      year: '1925',
      who: 'François Divisia',
      what: 'Introduces the Divisia index — a continuous-time index that decomposes aggregate changes into factor contributions. Elegant in theory, but requires continuous data.',
    },
    {
      year: '1976',
      who: 'Yoshizoe Sato & Yrjö Vartia',
      what: 'Independently discover that the logarithmic mean L(a,b) = (a−b)/(ln a − ln b) is the ideal weight function for discrete-time decomposition. This is the missing bridge between continuous and discrete.',
    },
    {
      year: '1997',
      who: 'B.W. Ang & K.H. Choi',
      what: 'Propose a refined Divisia index method using logarithmic mean weights for decomposing energy intensity. The seed of LMDI.',
    },
    {
      year: '2004',
      who: 'B.W. Ang',
      what: 'Publishes the landmark comparison of decomposition methods, demonstrating LMDI\'s superiority: perfect decomposition (zero residual), time-reversal symmetry, and factor-reversal symmetry.',
    },
    {
      year: '2005',
      who: 'B.W. Ang',
      what: 'Releases "The LMDI approach to decomposition analysis: a practical guide" — the definitive how-to paper that makes the method accessible to practitioners.',
    },
    {
      year: '2015',
      who: 'B.W. Ang',
      what: 'Updated implementation guide covering multi-level decomposition, chaining across time periods, and handling of zero/negative values.',
    },
  ];

  const references = [
    {
      id: 1,
      authors: 'Ang, B.W. & Choi, K.H.',
      year: 1997,
      title: 'Decomposition of aggregate energy and gas emission intensities for industry: a refined Divisia index method',
      journal: 'The Energy Journal',
      volume: '18(3), 59–73',
    },
    {
      id: 2,
      authors: 'Ang, B.W.',
      year: 2004,
      title: 'Decomposition analysis for policymaking in energy: which is the preferred method?',
      journal: 'Energy Policy',
      volume: '32(9), 1131–1139',
    },
    {
      id: 3,
      authors: 'Ang, B.W.',
      year: 2005,
      title: 'The LMDI approach to decomposition analysis: a practical guide',
      journal: 'Energy Policy',
      volume: '33(7), 867–871',
    },
    {
      id: 4,
      authors: 'Ang, B.W.',
      year: 2015,
      title: 'LMDI decomposition approach: a guide for implementation',
      journal: 'Energy Policy',
      volume: '86, 233–238',
    },
    {
      id: 5,
      authors: 'Sato, K.',
      year: 1976,
      title: 'The ideal log-change index number',
      journal: 'The Review of Economics and Statistics',
      volume: '58(2), 223–228',
    },
    {
      id: 6,
      authors: 'Vartia, Y.O.',
      year: 1976,
      title: 'Ideal log-change index numbers',
      journal: 'Scandinavian Journal of Statistics',
      volume: '3(3), 121–126',
    },
    {
      id: 7,
      authors: 'Divisia, F.',
      year: 1925,
      title: "L'indice monétaire et la théorie de la monnaie",
      journal: 'Revue d\'Économie Politique',
      volume: '39(4), 842–861',
    },
  ];

  return (
    <section className="chapter" id="chapter-7">
      <div className="chapter-header">
        <span className="chapter-number">Ch.07</span>
        <h2>History & References</h2>
      </div>

      <p>
        LMDI didn't appear out of nowhere. It's the result of <strong>80 years of refinement</strong> — from
        a French economist's theoretical index to a practical tool used by analysts worldwide.
      </p>

      {/* Timeline */}
      <div style={{ margin: 'var(--spacing-md) 0' }}>
        {timeline.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            paddingBottom: 'var(--spacing-md)',
            borderLeft: i < timeline.length - 1 ? '2px solid var(--ink-10)' : '2px solid transparent',
            marginLeft: 32,
            paddingLeft: 'var(--spacing-md)',
            position: 'relative',
          }}>
            {/* Year badge */}
            <div style={{
              position: 'absolute',
              left: -43,
              top: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'var(--ink)',
              background: 'var(--bg)',
              padding: '2px 4px',
            }}>
              {item.year}
            </div>
            {/* Dot on timeline */}
            <div style={{
              position: 'absolute',
              left: -5,
              top: 6,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === 3 || i === 4 ? 'var(--accent)' : 'var(--ink-20)',
              border: '2px solid var(--bg)',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginBottom: 4,
              }}>
                {item.who}
              </div>
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--ink-50)',
                lineHeight: 1.5,
              }}>
                {item.what}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why it matters beyond energy */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--ink-10)',
        padding: 'var(--spacing-md)',
        margin: 'var(--spacing-md) 0',
      }}>
        <div className="label" style={{ marginBottom: 12 }}>Beyond Energy Economics</div>
        <p style={{ fontSize: '0.875rem', maxWidth: 580, marginBottom: 12 }}>
          LMDI was born in <strong>energy economics</strong> — decomposing changes in CO₂ emissions
          into activity, structure, and intensity effects. But the math is universal.
          Today it's used in:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px 24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
        }}>
          {[
            ['Revenue analytics', 'Users × Frequency × Basket × Price'],
            ['Carbon accounting', 'GDP × Energy intensity × Carbon factor'],
            ['Manufacturing', 'Output × Material intensity × Process yield'],
            ['Transportation', 'Fleet × Distance × Fuel rate × Emission factor'],
          ].map(([field, example]) => (
            <div key={field} style={{ marginBottom: 4 }}>
              <strong>{field}</strong>
              <div style={{ color: 'var(--ink-50)', fontSize: '0.6875rem' }}>{example}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key properties summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 'var(--spacing-sm)',
        margin: 'var(--spacing-md) 0',
      }}>
        {[
          { label: 'Zero residual', desc: 'Contributions sum to the exact total change. No unexplained gap.' },
          { label: 'Time-reversal', desc: 'Decomposing t₀→t₁ gives the negative of t₁→t₀. Consistent both ways.' },
          { label: 'Factor-reversal', desc: 'Swapping factor roles doesn\'t change the decomposition result.' },
        ].map((prop) => (
          <div key={prop.label} className="kpi-card">
            <span className="label">{prop.label}</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-50)', marginTop: 6, lineHeight: 1.5 }}>
              {prop.desc}
            </div>
          </div>
        ))}
      </div>

      {/* References */}
      <h3 style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>References</h3>
      <ol style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        lineHeight: 1.7,
        color: 'var(--ink-50)',
        paddingLeft: 20,
        listStyleType: 'decimal',
      }}>
        {references.map((ref) => (
          <li key={ref.id} style={{ marginBottom: 8 }}>
            <span style={{ color: 'var(--ink)' }}>{ref.authors}</span>{' '}
            ({ref.year}).{' '}
            <em>{ref.title}</em>.{' '}
            {ref.journal}, {ref.volume}.
          </li>
        ))}
      </ol>

      <div className="takeaway" style={{ marginTop: 'var(--spacing-lg)' }}>
        From Divisia's 1925 continuous-time index to Ang's 2005 practical guide, LMDI is the
        culmination of decades of mathematical refinement. Its zero-residual guarantee, simplicity
        of implementation, and universal applicability make it the gold standard for additive
        decomposition analysis.
      </div>
    </section>
  );
}
