/**
 * Synthetic demo data for Revenue = MAU × OPC × IPO × AIV
 * across 6 user segments.
 *
 * Designed for pedagogical impact: factor ratios range from 0.7× to 1.6×
 * so LMDI contributions are visually meaningful on the waterfall chart.
 *
 * Total scenario ≈ $310M, forecast ≈ $378M, Δ ≈ +$68M (+22%)
 *
 * Factor values are synthetic — DEMO DATA.
 */

export interface SegmentData {
  name: string;
  scenario: { mau: number; opc: number; ipo: number; aiv: number };
  forecast: { mau: number; opc: number; ipo: number; aiv: number };
}

export const segments: SegmentData[] = [
  {
    name: 'Новички',
    // Rev scenario: 50k × 1.2 × 2.0 × 120 = $14.4M
    // Rev forecast: 80k × 1.1 × 2.3 × 105 = $21.3M
    // Story: huge MAU surge (+60%), basket shrinks (AIV -12%)
    scenario: { mau: 50_000, opc: 1.2, ipo: 2.0, aiv: 120 },
    forecast: { mau: 80_000, opc: 1.1, ipo: 2.3, aiv: 105 },
  },
  {
    name: 'Спонтанные',
    // Rev scenario: 100k × 1.8 × 2.0 × 95 = $34.2M
    // Rev forecast: 115k × 1.65 × 2.3 × 100 = $43.7M
    // Story: moderate growth, IPO up, OPC slightly down
    scenario: { mau: 100_000, opc: 1.8, ipo: 2.0, aiv: 95 },
    forecast: { mau: 115_000, opc: 1.65, ipo: 2.3, aiv: 100 },
  },
  {
    name: 'Ядро',
    // Rev scenario: 200k × 2.5 × 2.8 × 80 = $112M
    // Rev forecast: 210k × 2.7 × 3.0 × 78 = $132.6M
    // Story: biggest segment, steady growth, slight AIV dip
    scenario: { mau: 200_000, opc: 2.5, ipo: 2.8, aiv: 80 },
    forecast: { mau: 210_000, opc: 2.7, ipo: 3.0, aiv: 78 },
  },
  {
    name: 'Суперядро',
    // Rev scenario: 60k × 4.0 × 3.5 × 100 = $84M
    // Rev forecast: 55k × 4.5 × 3.8 × 115 = $108.1M
    // Story: fewer users but spending way more (OPC+12%, AIV+15%)
    scenario: { mau: 60_000, opc: 4.0, ipo: 3.5, aiv: 100 },
    forecast: { mau: 55_000, opc: 4.5, ipo: 3.8, aiv: 115 },
  },
  {
    name: 'Киты',
    // Rev scenario: 8k × 6.0 × 4.0 × 220 = $42.2M
    // Rev forecast: 9k × 5.5 × 4.5 × 250 = $55.7M
    // Story: more whales (+12%), deeper baskets, but fewer orders
    scenario: { mau: 8_000, opc: 6.0, ipo: 4.0, aiv: 220 },
    forecast: { mau: 9_000, opc: 5.5, ipo: 4.5, aiv: 250 },
  },
  {
    name: 'Неавт.',
    // Rev scenario: 300k × 0.8 × 1.5 × 65 = $23.4M
    // Rev forecast: 250k × 0.7 × 1.4 × 70 = $17.2M
    // Story: shrinking segment — MAU -17%, OPC -12%
    scenario: { mau: 300_000, opc: 0.8, ipo: 1.5, aiv: 65 },
    forecast: { mau: 250_000, opc: 0.7, ipo: 1.4, aiv: 70 },
  },
];

export const FACTOR_LABELS = ['MAU', 'OPC', 'IPO', 'AIV'] as const;
export type FactorKey = typeof FACTOR_LABELS[number];

export function getRevenue(d: { mau: number; opc: number; ipo: number; aiv: number }): number {
  return d.mau * d.opc * d.ipo * d.aiv;
}
