/**
 * Logarithmic mean: L(a, b) = (a - b) / (ln a - ln b)
 * When a ≈ b, returns a (limit case).
 */
export function logMean(a: number, b: number): number {
  if (a <= 0 || b <= 0) return 0;
  if (Math.abs(a - b) < 1e-10) return a;
  return (a - b) / (Math.log(a) - Math.log(b));
}

/** Factor values for a single sector in both periods. */
export interface SectorFactors {
  before: number[];
  after: number[];
}

/**
 * LMDI additive decomposition.
 *
 * Given sectors where V_i = product of factors x_{k,i},
 * compute the contribution of each factor k to total ΔV.
 *
 * @param sectors Array of SectorFactors where before[k] and after[k]
 *   are factor k values in period 0 and T.
 * @returns contributions[k] = total contribution of factor k across all sectors.
 */
export function lmdiDecompose(sectors: SectorFactors[]): number[] {
  if (sectors.length === 0) return [];
  const numFactors = sectors[0].before.length;
  const contributions = new Array(numFactors).fill(0);

  for (const sector of sectors) {
    const vBefore = sector.before.reduce((a, b) => a * b, 1);
    const vAfter = sector.after.reduce((a, b) => a * b, 1);
    const L = logMean(vAfter, vBefore);

    for (let k = 0; k < numFactors; k++) {
      const xBefore = sector.before[k];
      const xAfter = sector.after[k];
      if (xBefore > 0 && xAfter > 0) {
        contributions[k] += L * Math.log(xAfter / xBefore);
      }
    }
  }

  return contributions;
}

/**
 * Simple 2-factor LMDI for a single entity: V = x * y
 */
export function lmdiSimple(
  x0: number, y0: number,
  x1: number, y1: number
): { dX: number; dY: number; total: number } {
  const v0 = x0 * y0;
  const v1 = x1 * y1;
  const L = logMean(v1, v0);
  const dX = x0 > 0 && x1 > 0 ? L * Math.log(x1 / x0) : 0;
  const dY = y0 > 0 && y1 > 0 ? L * Math.log(y1 / y0) : 0;
  return { dX, dY, total: v1 - v0 };
}
