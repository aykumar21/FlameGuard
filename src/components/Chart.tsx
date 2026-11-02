import { witnesses } from "../data/materials";
import type { Witness } from "../data/types";
import { LUNAR_G, MARS_G } from "../lib/model";

type Props = {
  witness: Witness;
  gravity: number;
  oxygen: number;
  onGravity: (gravity: number) => void;
};

const marks = [
  { g: LUNAR_G, label: "Moon" },
  { g: MARS_G, label: "Mars" },
  { g: 1, label: "Earth" },
];

export function Chart({ witness, gravity, oxygen, onGravity }: Props) {
  const width = 680;
  const height = 250;
  const pad = { l: 48, r: 16, t: 18, b: 36 };
  const x0 = 0.1;
  const x1 = 1.08;
  const y0 = 12;
  const y1 = 42;
  const sx = (g: number) => pad.l + ((g - x0) / (x1 - x0)) * (width - pad.l - pad.r);
  const sy = (o2: number) => pad.t + ((y1 - o2) / (y1 - y0)) * (height - pad.t - pad.b);

  const yTicks = [15, 20, 25, 30, 34, 40];
  const cabinY = sy(Math.min(y1 - 0.4, Math.max(y0 + 0.4, oxygen)));
  const markerG = Math.min(1.05, Math.max(0.12, gravity <= 0.02 ? 0.12 : gravity));

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Limiting oxygen versus gravity for Mylar, Ultem, and Nomex">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={pad.l} x2={width - pad.r} y1={sy(tick)} y2={sy(tick)} className="grid" />
            <text x={pad.l - 8} y={sy(tick) + 4} className="tick" textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        {marks.map((mark) => (
          <text key={mark.label} x={sx(mark.g)} y={height - 10} className="tick" textAnchor="middle">
            {mark.label}
          </text>
        ))}
        <line x1={pad.l} x2={width - pad.r} y1={cabinY} y2={cabinY} className="cabin-line" />
        <text x={width - pad.r - 4} y={cabinY - 6} className="cabin-label" textAnchor="end">
          cabin {oxygen.toFixed(1)}%
        </text>
        <line x1={sx(markerG)} x2={sx(markerG)} y1={pad.t} y2={height - pad.b} className="g-line" />
        {witnesses.map((item) => {
          const pts = ["lunar", "mars", "earth"] as const;
          const d = pts
            .map((regime, index) => {
              const point = item.points.find((row) => row.regime === regime)!;
              return `${index === 0 ? "M" : "L"} ${sx(point.gravityG)} ${sy(point.uloi)}`;
            })
            .join(" ");
          const active = item.id === witness.id;
          return (
            <g key={item.id}>
              <path d={d} className={active ? "series active" : "series"} data-id={item.id} />
              {pts.map((regime) => {
                const point = item.points.find((row) => row.regime === regime)!;
                return (
                  <circle
                    key={regime}
                    cx={sx(point.gravityG)}
                    cy={sy(point.uloi)}
                    r={active ? 5.5 : 3.5}
                    className={active ? "dot active" : "dot"}
                    data-id={item.id}
                    onClick={() => onGravity(point.gravityG)}
                  >
                    <title>
                      {item.short} {regime} ULOI* {point.uloi}%
                    </title>
                  </circle>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="legend">
        {witnesses.map((item) => (
          <span key={item.id} data-id={item.id} className={item.id === witness.id ? "on" : ""}>
            {item.short}
            {item.id === witness.id ? " · witness" : ""}
          </span>
        ))}
      </div>
      <p className="chart-note">
        ULOI* from Olson &amp; Ferkul 2012, Table I. Lines connect measured gravities and are only a guide. Microgravity is
        omitted from the curve because that row is a forced-flow test, not a lower gravity. Mylar and Ultem were measured
        at 10.2 psia. Nomex was measured at 14.7 psia. Click a point to set gravity.
      </p>
    </div>
  );
}
