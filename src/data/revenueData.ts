/**
 * Synthetic demo data for Revenue = MAU × OPC × IPO × AIV
 * across 6 user segments.
 *
 * Revenue totals match screenshots (Jan 2026):
 *   Новички:     0.24B scenario / 0.24B forecast
 *   Спонтанные:  0.45B / 0.45B
 *   Ядро:        1.90B / 1.897B
 *   Суперядро:   2.87B / 2.861B
 *   Киты:        2.91B / 2.909B
 *   Неавт.:      1.75B / 1.747B
 *
 * Factor values are synthetic (chosen so their product = revenue).
 * Marked as DEMO DATA — replace with real factor values for production.
 */

export interface SegmentData {
  name: string;
  scenario: { mau: number; opc: number; ipo: number; aiv: number };
  forecast: { mau: number; opc: number; ipo: number; aiv: number };
}

export const segments: SegmentData[] = [
  {
    name: 'Новички',
    // Revenue scenario: 240M  = 800k × 1.2 × 2.5 × 100
    scenario: { mau: 800_000, opc: 1.2, ipo: 2.5, aiv: 100 },
    // Revenue forecast: 240M  = 790k × 1.22 × 2.48 × 100.3
    forecast: { mau: 790_000, opc: 1.22, ipo: 2.48, aiv: 100.3 },
  },
  {
    name: 'Спонтанные',
    // Revenue scenario: 450M  = 500k × 2.0 × 3.0 × 150
    scenario: { mau: 500_000, opc: 2.0, ipo: 3.0, aiv: 150 },
    // Revenue forecast: 450M  = 498k × 2.01 × 2.99 × 150.2
    forecast: { mau: 498_000, opc: 2.01, ipo: 2.99, aiv: 150.2 },
  },
  {
    name: 'Ядро',
    // Revenue scenario: 1.90B = 1.2M × 3.5 × 3.2 × 141
    scenario: { mau: 1_200_000, opc: 3.5, ipo: 3.2, aiv: 141.37 },
    // Revenue forecast: 1.897B = 1.195M × 3.52 × 3.18 × 141.8
    forecast: { mau: 1_195_000, opc: 3.52, ipo: 3.18, aiv: 141.8 },
  },
  {
    name: 'Суперядро',
    // Revenue scenario: 2.87B = 800k × 5.0 × 3.5 × 205
    scenario: { mau: 800_000, opc: 5.0, ipo: 3.5, aiv: 205.0 },
    // Revenue forecast: 2.861B = 796k × 5.02 × 3.48 × 205.8
    forecast: { mau: 796_000, opc: 5.02, ipo: 3.48, aiv: 205.8 },
  },
  {
    name: 'Киты',
    // Revenue scenario: 2.91B = 200k × 8.0 × 4.0 × 455
    scenario: { mau: 200_000, opc: 8.0, ipo: 4.0, aiv: 454.69 },
    // Revenue forecast: 2.909B = 199.5k × 8.02 × 3.99 × 455.8
    forecast: { mau: 199_500, opc: 8.02, ipo: 3.99, aiv: 455.8 },
  },
  {
    name: 'Неавт.',
    // Revenue scenario: 1.75B = 3.5M × 1.0 × 2.0 × 250
    scenario: { mau: 3_500_000, opc: 1.0, ipo: 2.0, aiv: 250.0 },
    // Revenue forecast: 1.747B = 3.49M × 1.001 × 1.99 × 250.5
    forecast: { mau: 3_490_000, opc: 1.001, ipo: 1.99, aiv: 250.5 },
  },
];

export const FACTOR_LABELS = ['MAU', 'OPC', 'IPO', 'AIV'] as const;
export type FactorKey = typeof FACTOR_LABELS[number];

export function getRevenue(d: { mau: number; opc: number; ipo: number; aiv: number }): number {
  return d.mau * d.opc * d.ipo * d.aiv;
}
