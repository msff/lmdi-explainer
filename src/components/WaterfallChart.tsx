import { useMemo } from 'react';
import { formatCurrency } from '../utils/format';

export interface WaterfallEntry {
  name: string;
  value: number;
  fill: string;
  /** true for anchor bars (start/end totals) that render from 0 */
  isTotal?: boolean;
}

interface ComputedBar {
  name: string;
  /** Bottom of visible bar (data space) */
  base: number;
  /** Top of visible bar (data space) */
  top: number;
  displayValue: number;
  fill: string;
  isTotal: boolean;
  /** Where the running total ends after this bar */
  runningEnd: number;
}

interface Props {
  entries: WaterfallEntry[];
  height?: number;
  formatValue?: (v: number) => string;
}


/** Generate nice round tick values for Y axis */
function niceYTicks(min: number, max: number, count = 5): number[] {
  const range = max - min || 1;
  const rawStep = range / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = [1, 2, 5, 10].map(n => n * mag).find(s => s >= rawStep) || mag * 10;
  const ticks: number[] = [];
  const start = Math.floor(min / step) * step;
  for (let v = start; v <= max + step * 0.01; v += step) {
    ticks.push(v);
  }
  return ticks;
}

export function WaterfallChart({ entries, height = 300, formatValue = formatCurrency }: Props) {
  const svgWidth = 600;
  const marginTop = 28;
  const marginBottom = 36;
  const marginLeft = 56;
  const marginRight = 16;
  const barGapRatio = 0.3;

  const { bars, yMin, yMax } = useMemo(() => {
    let running = 0;
    const bars: ComputedBar[] = [];

    for (const entry of entries) {
      if (entry.isTotal) {
        bars.push({
          name: entry.name, base: 0, top: entry.value,
          displayValue: entry.value, fill: entry.fill,
          isTotal: true, runningEnd: entry.value,
        });
        running = entry.value;
      } else {
        const start = running;
        const end = running + entry.value;
        bars.push({
          name: entry.name,
          base: Math.min(start, end),
          top: Math.max(start, end),
          displayValue: entry.value,
          fill: entry.fill,
          isTotal: false,
          runningEnd: end,
        });
        running = end;
      }
    }

    let yMin = 0;
    let yMax = 0;
    for (const b of bars) {
      yMin = Math.min(yMin, b.base);
      yMax = Math.max(yMax, b.top);
    }
    // Add breathing room at the top
    const yRange = yMax - yMin || 1;
    yMax += yRange * 0.08;

    return { bars, yMin, yMax };
  }, [entries]);

  const plotW = svgWidth - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;
  const yRange = yMax - yMin;

  /** Map data value → SVG y coordinate */
  const toY = (v: number) => marginTop + (1 - (v - yMin) / yRange) * plotH;

  const n = bars.length;
  const slotW = plotW / n;
  const barW = slotW * (1 - barGapRatio);

  const barX = (i: number) => marginLeft + slotW * i + (slotW - barW) / 2;

  const yTicks = niceYTicks(yMin, yMax);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${svgWidth} ${height}`}
      style={{ display: 'block', fontFamily: 'var(--font-mono)' }}
    >
      {/* Grid lines + Y axis labels */}
      {yTicks.map((tick) => {
        const y = toY(tick);
        return (
          <g key={tick}>
            <line
              x1={marginLeft} x2={svgWidth - marginRight}
              y1={y} y2={y}
              stroke="rgba(17,17,17,0.07)" strokeDasharray="3 3"
            />
            <text
              x={marginLeft - 6} y={y}
              textAnchor="end" dominantBaseline="middle"
              fontSize={10} fill="rgba(17,17,17,0.5)"
            >
              {formatValue(tick)}
            </text>
          </g>
        );
      })}

      {/* X axis line */}
      <line
        x1={marginLeft} x2={svgWidth - marginRight}
        y1={height - marginBottom} y2={height - marginBottom}
        stroke="rgba(17,17,17,0.15)"
      />

      {/* Bars + connectors + labels */}
      {bars.map((bar, i) => {
        const bX = barX(i);
        const yTop = toY(bar.top);
        const yBot = toY(bar.base);
        const bH = Math.max(yBot - yTop, 1);

        const isNeg = bar.displayValue < 0;

        // Connector to next bar
        let connector = null;
        if (i < n - 1) {
          const connY = toY(bar.runningEnd);
          const nextX = barX(i + 1);
          connector = (
            <line
              x1={bX + barW} x2={nextX}
              y1={connY} y2={connY}
              stroke="rgba(17,17,17,0.2)"
              strokeDasharray="3 2"
            />
          );
        }

        return (
          <g key={i}>
            {/* Bar rectangle */}
            <rect x={bX} y={yTop} width={barW} height={bH} fill={bar.fill} rx={2} />

            {/* Value label */}
            <text
              x={bX + barW / 2}
              y={isNeg && !bar.isTotal ? yBot + 14 : yTop - 6}
              textAnchor="middle"
              fontSize={9}
              fill={bar.isTotal ? '#111' : bar.fill}
              fontWeight={bar.isTotal ? 600 : 500}
            >
              {formatValue(bar.displayValue)}
            </text>

            {/* Name label below axis */}
            <text
              x={bX + barW / 2}
              y={height - marginBottom + 16}
              textAnchor="middle"
              fontSize={10}
              fill="rgba(17,17,17,0.5)"
            >
              {bar.name}
            </text>

            {connector}
          </g>
        );
      })}
    </svg>
  );
}
