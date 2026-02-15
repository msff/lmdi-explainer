import { useState, useEffect } from 'react';

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
              if (!isNaN(num)) setActive(num);
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    const els = document.querySelectorAll('[id^="chapter-"]');
    els.forEach((el) => observer.observe(el));

    // Handle initial hash
    const hash = window.location.hash;
    if (hash.startsWith('#chapter-')) {
      const num = parseInt(hash.replace('#chapter-', ''), 10);
      if (!isNaN(num)) setActive(num);
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
