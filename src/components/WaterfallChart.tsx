import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Cell, LabelList,
} from 'recharts';

export interface WaterfallEntry {
  name: string;
  value: number;
  fill: string;
  /** true for anchor bars (start/end totals) that render from 0 */
  isTotal?: boolean;
}

interface WaterfallBar {
  name: string;
  /** Bottom of the invisible spacer */
  base: number;
  /** Height of the visible bar (always >= 0) */
  height: number;
  /** Original signed value for labels */
  displayValue: number;
  fill: string;
  isTotal: boolean;
}

/**
 * Compute waterfall bar positions from a list of entries.
 * Handles negative contributions correctly by using absolute heights
 * and computing the base as min(start, end) of each segment.
 */
function computeBars(entries: WaterfallEntry[]): WaterfallBar[] {
  const bars: WaterfallBar[] = [];
  let running = 0;

  for (const entry of entries) {
    if (entry.isTotal) {
      bars.push({
        name: entry.name,
        base: 0,
        height: Math.abs(entry.value),
        displayValue: entry.value,
        fill: entry.fill,
        isTotal: true,
      });
      running = entry.value;
    } else {
      const start = running;
      const end = running + entry.value;
      bars.push({
        name: entry.name,
        base: Math.min(start, end),
        height: Math.abs(entry.value),
        displayValue: entry.value,
        fill: entry.fill,
        isTotal: false,
      });
      running = end;
    }
  }

  return bars;
}

interface Props {
  entries: WaterfallEntry[];
  height?: number;
  formatValue?: (v: number) => string;
}

const defaultFormat = (v: number) => {
  if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1000).toFixed(0)}k`;
  return v.toFixed(0);
};

export function WaterfallChart({ entries, height = 300, formatValue = defaultFormat }: Props) {
  const bars = computeBars(entries);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={bars} margin={{ top: 24, right: 12, bottom: 4, left: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.07)" />
        <XAxis
          dataKey="name"
          tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
          tickFormatter={(v) => formatValue(v)}
        />
        <Tooltip
          contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
          formatter={(val: any, name: any) => {
            if (name === 'base') return [null, null];
            // Show the original signed value, not the absolute height
            const idx = bars.findIndex((b) => b.height === Number(val));
            const display = idx >= 0 ? bars[idx].displayValue : Number(val);
            return [formatValue(display), 'Value'];
          }}
        />
        {/* Invisible spacer bar */}
        <Bar dataKey="base" stackId="stack" fill="transparent" stroke="none" isAnimationActive={false} />
        {/* Visible value bar */}
        <Bar dataKey="height" stackId="stack" radius={[2, 2, 0, 0]} isAnimationActive={false}>
          {bars.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="displayValue"
            position="top"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: '#111' }}
            formatter={(v: any) => formatValue(Number(v))}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
