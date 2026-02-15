import { Sidebar } from './components/Sidebar';
import { ScrollReveal } from './components/ScrollReveal';
import { useScrollChapter } from './hooks/useScrollChapter';
import { Ch1_WhatIsLog } from './chapters/Ch1_WhatIsLog';
import { Ch2_ProductsToSums } from './chapters/Ch2_ProductsToSums';
import { Ch3_DecompositionProblem } from './chapters/Ch3_DecompositionProblem';
import { Ch4_LogarithmicMean } from './chapters/Ch4_LogarithmicMean';
import { Ch5_BridgeIdentity } from './chapters/Ch5_BridgeIdentity';
import { Ch6_LmdiInAction } from './chapters/Ch6_LmdiInAction';
import { Ch7_RevenueDecomp } from './chapters/Ch7_RevenueDecomp';

export default function App() {
  const activeChapter = useScrollChapter();

  return (
    <>
      <Sidebar active={activeChapter} />
      <main>
        <header style={{ marginBottom: 'var(--spacing-xl)' }}>
          <ScrollReveal>
            <div className="label" style={{ marginBottom: 8 }}>Interactive Explainer</div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1>LMDI Decomposition</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p style={{ maxWidth: 640, marginTop: 'var(--spacing-sm)', fontSize: '0.9375rem', color: 'var(--ink-50)' }}>
              From basic logarithms to real-world revenue decomposition —
              learn how LMDI splits changes into factor contributions with zero residual.
            </p>
          </ScrollReveal>
        </header>
        <ScrollReveal><Ch1_WhatIsLog /></ScrollReveal>
        <ScrollReveal><Ch2_ProductsToSums /></ScrollReveal>
        <ScrollReveal><Ch3_DecompositionProblem /></ScrollReveal>
        <ScrollReveal><Ch4_LogarithmicMean /></ScrollReveal>
        <ScrollReveal><Ch5_BridgeIdentity /></ScrollReveal>
        <ScrollReveal><Ch6_LmdiInAction /></ScrollReveal>
        <ScrollReveal><Ch7_RevenueDecomp /></ScrollReveal>
      </main>
    </>
  );
}
