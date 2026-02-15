const CHAPTERS = [
  'What is a Logarithm?',
  'Products Become Sums',
  'The Decomposition Problem',
  'The Logarithmic Mean',
  'LMDI in Action',
  'Revenue Decomposition',
];

interface Props {
  active: number;
}

export function Sidebar({ active }: Props) {
  const scrollTo = (n: number) => {
    const el = document.getElementById(`chapter-${n}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-title">
        <span className="sidebar-label">LMDI</span>
        <span className="sidebar-subtitle">Decomposition</span>
      </div>
      <ul className="sidebar-nav">
        {CHAPTERS.map((title, i) => {
          const n = i + 1;
          return (
            <li key={n}>
              <button
                className={`sidebar-link ${active === n ? 'active' : ''}`}
                onClick={() => scrollTo(n)}
              >
                <span className="sidebar-dot" />
                <span className="sidebar-num">{String(n).padStart(2, '0')}</span>
                <span className="sidebar-text">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--sidebar-bg);
          color: var(--sidebar-ink);
          display: flex;
          flex-direction: column;
          padding: var(--spacing-lg) 0;
          z-index: 100;
          overflow: hidden;
        }
        .sidebar-title {
          padding: 0 var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        .sidebar-label {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0.5;
          display: block;
        }
        .sidebar-subtitle {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .sidebar-nav {
          list-style: none;
          flex: 1;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          width: 100%;
          padding: var(--spacing-xs) var(--spacing-md);
          background: none;
          border: none;
          color: var(--sidebar-ink);
          font-family: var(--font-display);
          font-size: 0.8125rem;
          text-align: left;
          cursor: pointer;
          opacity: 0.4;
          transition: opacity 0.2s;
        }
        .sidebar-link:hover {
          opacity: 0.7;
        }
        .sidebar-link.active {
          opacity: 1;
        }
        .sidebar-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .sidebar-link.active .sidebar-dot {
          opacity: 1;
        }
        .sidebar-num {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          opacity: 0.5;
          flex-shrink: 0;
        }
        .sidebar-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 1024px) {
          .sidebar-text { display: none; }
          .sidebar-link { justify-content: center; padding: var(--spacing-xs); }
          .sidebar-num { opacity: 1; font-size: 0.875rem; }
          .sidebar-dot { display: none; }
          .sidebar-title { text-align: center; }
          .sidebar-subtitle { display: none; }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
        }
      `}</style>
    </nav>
  );
}
