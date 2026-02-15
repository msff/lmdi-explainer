import { useRef, useEffect, type ReactNode } from 'react';
import { inView } from 'motion';

interface Props {
  children: ReactNode;
  /** Extra delay in seconds (for staggering siblings) */
  delay?: number;
}

export function ScrollReveal({ children, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1';
      return;
    }

    // Start hidden
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';

    const cleanup = inView(el, () => {
      // Use native Web Animations API — lightweight, no typing issues
      el.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0px)' },
        ],
        { duration: 500, delay: delay * 1000, fill: 'forwards', easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
      );
    }, { amount: 0.15 });

    return cleanup;
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}
