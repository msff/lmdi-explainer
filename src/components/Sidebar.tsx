import { useState } from 'react';

const CHAPTERS = [
  'What is a Logarithm?',
  'Products Become Sums',
  'The Decomposition Problem',
  'The Logarithmic Mean',
  'LMDI in Action',
  'Revenue Decomposition',
  'History & References',
];

interface Props {
  active: number;
}

export function Sidebar({ active }: Props) {
  const [open, setOpen] = useState(false);

  const scrollTo = (n: number) => {
    const el = document.getElementById(`chapter-${n}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      {/* Mobile toggle — visible only below 768px via CSS */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setOpen(!open)}
        aria-label={`Chapter ${active} of ${CHAPTERS.length}`}
      >
        Ch {active}/{CHAPTERS.length}
      </button>

      {/* Backdrop */}
      {open && (
        <div className="sidebar-backdrop" onClick={() => setOpen(false)} />
      )}

      <nav className={`sidebar ${open ? 'open' : ''}`}>
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
      </nav>
    </>
  );
}
