import { useState, useEffect } from 'react';

const CHAPTERS = 6;

export function useScrollChapter() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              const num = parseInt(id.replace('chapter-', ''), 10);
              if (num >= 1 && num <= CHAPTERS) setActive(num);
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    for (let i = 1; i <= CHAPTERS; i++) {
      const el = document.getElementById(`chapter-${i}`);
      if (el) observer.observe(el);
    }

    // Handle initial hash
    const hash = window.location.hash;
    if (hash.startsWith('#chapter-')) {
      const num = parseInt(hash.replace('#chapter-', ''), 10);
      if (num >= 1 && num <= CHAPTERS) setActive(num);
    }

    return () => observer.disconnect();
  }, []);

  // Update URL hash on change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      history.replaceState(null, '', `#chapter-${active}`);
    }, 200);
    return () => clearTimeout(timeout);
  }, [active]);

  return active;
}
